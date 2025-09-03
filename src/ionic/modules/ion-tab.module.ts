import { NgModule } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonTab,
} from '@ionic/angular/standalone';

const ION_TAB_COMPONENTS = [IonTabs, IonTab, IonTabBar, IonTabButton];

@NgModule({
  imports: [...ION_TAB_COMPONENTS],
  exports: [...ION_TAB_COMPONENTS],
})
export class IonTabModule {}
