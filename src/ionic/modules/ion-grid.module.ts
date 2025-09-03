import { NgModule } from '@angular/core';
import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

const ION_GRID_COMPONENTS = [IonGrid, IonRow, IonCol];

@NgModule({
  imports: [...ION_GRID_COMPONENTS],
  exports: [...ION_GRID_COMPONENTS],
})
export class IonGridModule {}
