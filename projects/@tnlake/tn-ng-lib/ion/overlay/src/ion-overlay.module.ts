import { NgModule } from '@angular/core';
import {
  IonAlert,
  IonLoading,
  IonToast,
  IonModal,
  IonPopover,
  IonActionSheet,
} from '@ionic/angular/standalone';

const ION_OVERLAY_COMPONENTS = [
  IonAlert,
  IonLoading,
  IonToast,
  IonModal,
  IonPopover,
  IonActionSheet,
];

@NgModule({
  imports: [...ION_OVERLAY_COMPONENTS],
  exports: [...ION_OVERLAY_COMPONENTS],
})
export class IonOverlayModule {}
