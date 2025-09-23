import { Injectable, inject } from "@angular/core";
import { Platform, AlertController } from "@ionic/angular";
import { AppUpdate, AppUpdateAvailability, FlexibleUpdateInstallStatus } from "@capawesome/capacitor-app-update";
import { L10nService } from "@tnlake/tn-ng-lib/l10n";

/**
 * Androidアプリ更新サービス
 * Google Play Storeのアプリ内アップデート機能を使用
 * @capawesome/capacitor-app-update を利用
 */
@Injectable({
  providedIn: "root",
})
export class AndroidAppUpdateService {
  private readonly platform = inject(Platform);
  private readonly alertController = inject(AlertController);
  private readonly l10n = inject(L10nService);

  /**
   * アプリ更新チェック（Android専用）
   */
  async checkForUpdate(): Promise<void> {
    // Android以外は何もしない
    if (!this.platform.is("android")) {
      return;
    }

    try {
      // Google Play Storeの更新チェック
      const result = await AppUpdate.getAppUpdateInfo();

      if (result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
        // 更新が利用可能
        console.log("Update available:", result);

        // 柔軟な更新（flexible update）を開始
        // ユーザーはアプリを使い続けながらバックグラウンドでダウンロード
        await this.startFlexibleUpdate();
      } else if (result.updateAvailability === AppUpdateAvailability.UPDATE_NOT_AVAILABLE) {
        // 更新なし
        console.log("No update available");
      } else if (result.updateAvailability === AppUpdateAvailability.UPDATE_IN_PROGRESS) {
        // 更新が進行中
        console.log("Update in progress");
      }
    } catch (error) {
      console.error("Failed to check for updates:", error);
    }
  }

  /**
   * 柔軟な更新を開始
   */
  private async startFlexibleUpdate(): Promise<void> {
    try {
      // 柔軟な更新を開始
      const result = await AppUpdate.startFlexibleUpdate();

      if (result.code === 0) {
        console.log("Update started successfully");

        // 更新のインストール準備ができたらリスナーで通知を受け取る
        await this.listenForUpdateCompletion();
      }
    } catch (error) {
      console.error("Failed to start flexible update:", error);
    }
  }

  /**
   * 即座の更新を開始（強制アップデート用）
   */
  async startImmediateUpdate(): Promise<void> {
    if (!this.platform.is("android")) {
      return;
    }

    try {
      // 即座の更新を開始（アプリが再起動される）
      await AppUpdate.performImmediateUpdate();
    } catch (error) {
      console.error("Failed to start immediate update:", error);
    }
  }

  /**
   * 更新完了を監視
   */
  private async listenForUpdateCompletion(): Promise<void> {
    // リスナーを追加
    await AppUpdate.addListener("onFlexibleUpdateStateChange", async (state) => {
      console.log("Update state:", state);

      // ダウンロード完了
      if (state.installStatus === FlexibleUpdateInstallStatus.DOWNLOADED) {
        await this.showUpdateReadyDialog();
      }
    });
  }

  /**
   * 更新準備完了ダイアログを表示
   */
  private async showUpdateReadyDialog(): Promise<void> {
    const [header, message, installButton, laterButton] = await Promise.all([
      this.l10n.get("UPDATE_READY"),
      this.l10n.get("UPDATE_READY_MESSAGE"),
      this.l10n.get("RESTART_NOW"),
      this.l10n.get("LATER"),
    ]);

    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: laterButton,
          role: "cancel",
        },
        {
          text: installButton,
          handler: async () => {
            await this.completeUpdate();
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * 更新を完了してアプリを再起動
   */
  private async completeUpdate(): Promise<void> {
    try {
      await AppUpdate.completeFlexibleUpdate();
    } catch (error) {
      console.error("Failed to complete update:", error);
    }
  }

  /**
   * Play Storeを開く（手動更新用）
   */
  async openAppStore(): Promise<void> {
    if (!this.platform.is("android")) {
      return;
    }

    try {
      await AppUpdate.openAppStore();
    } catch (error) {
      console.error("Failed to open app store:", error);
    }
  }

  /**
   * 現在のバージョン情報を取得
   */
  async getCurrentVersion(): Promise<string | null> {
    if (!this.platform.is("android")) {
      return null;
    }

    try {
      const info = await AppUpdate.getAppUpdateInfo();
      return info.currentVersionName || null;
    } catch (error) {
      console.error("Failed to get version info:", error);
      return null;
    }
  }

  /**
   * 利用可能なバージョン情報を取得
   */
  async getAvailableVersion(): Promise<string | null> {
    if (!this.platform.is("android")) {
      return null;
    }

    try {
      const info = await AppUpdate.getAppUpdateInfo();
      return info.availableVersionName || null;
    } catch (error) {
      console.error("Failed to get available version:", error);
      return null;
    }
  }
}
