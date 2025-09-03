import { NgModule } from '@angular/core';
import {
  // 最もよく使用される基本コンポーネント
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonSpinner,
  IonItem,
  IonLabel,
  IonList,
  IonBackButton,
  IonFooter,
  IonProgressBar,
  IonThumbnail,
  IonAvatar,
  IonSkeletonText,
  IonImg,
  IonBreadcrumb,
  IonBreadcrumbs,
  IonButtons,
  IonNote,
  IonText,
} from '@ionic/angular/standalone';

const ION_CORE_COMPONENTS = [
  // Layout基本
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonFooter,

  // 基本アクション
  IonIcon,
  IonButton,
  IonButtons,
  IonBackButton,

  // ステータス表示
  IonSpinner,
  IonProgressBar,
  IonSkeletonText,
  IonImg,

  // 基本表示
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonText,

  IonThumbnail,
  IonAvatar,

  IonBreadcrumbs,
  IonBreadcrumb,
];

@NgModule({
  imports: [...ION_CORE_COMPONENTS],
  exports: [...ION_CORE_COMPONENTS],
})
export class IonCoreModule {}
