import { inject } from "@angular/core";
import { type HttpInterceptorFn, HttpErrorResponse, HttpContextToken, HttpResponse } from "@angular/common/http";
import { VersionService, type AppVersionInfo } from "./version.service";
import { AlertController, Platform, LoadingController, ToastController } from "@ionic/angular";
import { App } from "@capacitor/app";
import { catchError, from, switchMap, throwError, tap } from "rxjs";
import { L10nService } from "@tnlake/tn-ng-lib/l10n";

export const SKIP_VERSION_CHECK = new HttpContextToken<boolean>(() => false);

export const versionInterceptor: HttpInterceptorFn = (req, next) => {
  // バージョンチェックをスキップする場合
  if (req.context.get(SKIP_VERSION_CHECK)) {
    return next(req);
  }

  // 必要なサービスをインジェクト
  const services = {
    version: inject(VersionService),
    alert: inject(AlertController),
    loading: inject(LoadingController),
    toast: inject(ToastController),
    platform: inject(Platform),
    l10n: inject(L10nService),
  };

  // バージョン情報を取得してリクエストに付与
  return from(services.version.getAppVersion()).pipe(
    switchMap((appVersion) => {
      const requestWithVersion = addVersionHeaders(req, appVersion);

      return next(requestWithVersion).pipe(
        tap((event) => {
          // レスポンスに新バージョン通知があるかチェック
          if (event instanceof HttpResponse) {
            handleNewVersionNotification(event, services);
          }
        }),
        catchError((error) => handleVersionError(error, services))
      );
    })
  );
};

/**
 * リクエストにバージョンヘッダーを追加
 */
function addVersionHeaders(req: any, appVersion: AppVersionInfo) {
  return req.clone({
    setHeaders: {
      "X-App-Version": appVersion.version,
      "X-App-Platform": appVersion.platform,
    },
  });
}

/**
 * バージョンエラーを処理
 */
function handleVersionError(
  error: any,
  services: {
    alert: AlertController;
    loading: LoadingController;
    platform: Platform;
    l10n: L10nService;
  }
) {
  // 426 (Upgrade Required) 以外はそのまま通す
  if (!(error instanceof HttpErrorResponse) || error.status !== 426) {
    return throwError(() => error);
  }

  const updateUrl = error.headers.get("X-Update-URL");

  // 非同期処理をObservableに変換
  return from(
    (async () => {
      // ローディングを閉じる
      await dismissLoading(services.loading);

      // アップデート要求ダイアログを表示
      await showUpdateDialog(services.alert, services.platform, services.l10n, updateUrl);

      // 426エラーはそのまま伝播させる（呼び出し側で判定可能にする）
      throw error;
    })()
  );
}

/**
 * ローディングを閉じる
 */
async function dismissLoading(loadingController: LoadingController) {
  try {
    const loading = await loadingController.getTop();
    if (loading) {
      await loading.dismiss();
    }
  } catch (e) {
    console.error("Failed to dismiss loading:", e);
  }
}

/**
 * アップデート要求ダイアログを表示
 */
async function showUpdateDialog(
  alertController: AlertController,
  platform: Platform,
  l10n: L10nService,
  updateUrl: string | null
) {
  // 既存のアラートを閉じる
  await dismissExistingAlert(alertController);

  // 多言語対応のメッセージを取得
  const messages = await getUpdateMessages(l10n);

  // アラートを作成
  const alert = await alertController.create({
    header: messages.header,
    message: messages.message,
    backdropDismiss: false,
    buttons: [
      {
        text: messages.updateButton,
        handler: () =>
          handleUpdateAction(platform, updateUrl, () => showUpdateDialog(alertController, platform, l10n, updateUrl)),
      },
    ],
  });

  await alert.present();
}

/**
 * 既存のアラートを閉じる
 */
async function dismissExistingAlert(alertController: AlertController) {
  const existingAlert = await alertController.getTop();
  if (existingAlert) {
    await existingAlert.dismiss();
  }
}

/**
 * 多言語メッセージを取得
 */
async function getUpdateMessages(l10n: L10nService) {
  const [header, message, updateButton] = await Promise.all([
    l10n.get("APP_UPDATE_REQUIRED"),
    l10n.get("APP_UPDATE_MESSAGE"),
    l10n.get("UPDATE_NOW"),
  ]);

  return { header, message, updateButton };
}

/**
 * アップデートボタンのアクション処理
 */
async function handleUpdateAction(platform: Platform, updateUrl: string | null, retryCallback: () => void) {
  // ストアを開く
  if (updateUrl) {
    window.open(updateUrl, "_system");
  }

  // プラットフォーム別の処理
  if (platform.is("android")) {
    // Androidはアプリを終了
    try {
      await App.exitApp();
    } catch (e) {
      console.error("App.exitApp not available:", e);
    }
  } else if (platform.is("ios")) {
    // iOSは再表示（アプリ終了はAppleガイドライン違反）
    setTimeout(retryCallback, 100);
  }
}

/**
 * 新バージョン通知を処理
 */
async function handleNewVersionNotification(
  response: HttpResponse<any>,
  services: {
    toast: ToastController;
    l10n: L10nService;
  }
) {
  // 新バージョン通知ヘッダーをチェック
  const newVersionAvailable = response.headers.get("X-New-Version-Available");
  const latestVersion = response.headers.get("X-Latest-Version");
  const updateUrl = response.headers.get("X-Update-URL");

  if (newVersionAvailable === "true") {
    // 既に表示済みかチェック（セッション中に1回だけ表示）
    const warningKey = "new_version_notification_shown";
    if (sessionStorage.getItem(warningKey)) {
      return;
    }
    sessionStorage.setItem(warningKey, "true");

    // 新バージョン通知を表示
    let [message, updateButton] = await Promise.all([
      services.l10n.get("APP_VERSION_DEPRECATED"),
      services.l10n.get("UPDATE_RECOMMENDED"),
    ]);

    // 最新バージョンを含めたメッセージにする
    if (latestVersion) {
      message = `${message} (v${latestVersion})`;
    }

    const buttons = [];
    if (updateUrl) {
      buttons.push({
        text: updateButton,
        handler: () => {
          window.open(updateUrl, "_system");
        },
      });
    }

    const toast = await services.toast.create({
      message: message,
      duration: 5000,
      position: "top",
      color: "warning",
      buttons,
    });
    await toast.present();
  }
}
