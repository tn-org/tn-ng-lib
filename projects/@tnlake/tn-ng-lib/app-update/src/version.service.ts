import { Injectable, inject, InjectionToken } from '@angular/core';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

// バージョン情報を提供するためのトークン
export const APP_VERSION = new InjectionToken<string>('APP_VERSION');

export interface AppVersionInfo {
  version: string;
  platform: 'ios' | 'android' | 'web';
}

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private readonly platform = inject(Platform);
  private readonly appVersion = inject(APP_VERSION, { optional: true });
  private cachedVersionInfo: AppVersionInfo | null = null;

  /**
   * アプリのバージョン情報を取得
   * 一度取得したらキャッシュして再利用
   */
  async getAppVersion(): Promise<AppVersionInfo> {
    // キャッシュがあれば返す
    if (this.cachedVersionInfo) {
      return this.cachedVersionInfo;
    }

    // プラットフォームに応じて取得方法を分岐
    this.cachedVersionInfo = this.isNativeApp()
      ? await this.getNativeAppVersion()
      : this.getWebVersion();

    return this.cachedVersionInfo;
  }

  /**
   * ネイティブアプリ環境かどうか判定
   */
  private isNativeApp(): boolean {
    return this.platform.is('capacitor');
  }

  /**
   * ネイティブアプリのバージョン情報を取得
   */
  private async getNativeAppVersion(): Promise<AppVersionInfo> {
    try {
      const info = await App.getInfo();
      return {
        version: info.version,
        platform: this.getPlatformType(),
      };
    } catch (error) {
      console.error('Failed to get native app info:', error);
      // エラー時はWebバージョンをフォールバック
      return this.getWebVersion();
    }
  }

  /**
   * Webバージョン情報を取得
   */
  private getWebVersion(): AppVersionInfo {
    return {
      version: this.appVersion || '1.0.0',
      platform: 'web',
    };
  }

  /**
   * プラットフォームタイプを判定
   */
  private getPlatformType(): 'ios' | 'android' | 'web' {
    if (this.platform.is('ios')) return 'ios';
    if (this.platform.is('android')) return 'android';
    return 'web';
  }
}
