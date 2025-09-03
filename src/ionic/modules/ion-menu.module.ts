import { NgModule } from '@angular/core';
import {
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
} from '@ionic/angular/standalone';

const ION_MENU_COMPONENTS = [IonMenu, IonMenuButton, IonMenuToggle];

@NgModule({
  imports: [...ION_MENU_COMPONENTS],
  exports: [...ION_MENU_COMPONENTS],
})
export class IonMenuModule {}
