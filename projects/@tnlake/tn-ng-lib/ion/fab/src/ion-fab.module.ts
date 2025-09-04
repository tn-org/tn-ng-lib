import { NgModule } from '@angular/core';
import { IonFab, IonFabButton, IonFabList } from '@ionic/angular/standalone';

const ION_BUTTON_COMPONENTS = [IonFab, IonFabList, IonFabButton];

@NgModule({
  imports: [...ION_BUTTON_COMPONENTS],
  exports: [...ION_BUTTON_COMPONENTS],
})
export class IonFabModule {}
