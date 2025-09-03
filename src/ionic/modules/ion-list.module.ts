import { NgModule } from '@angular/core';
import {
  IonList,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonNote,
  IonListHeader,
} from '@ionic/angular/standalone';

const ION_LIST_COMPONENTS = [
  IonList,
  IonListHeader,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonNote,
];

@NgModule({
  imports: [...ION_LIST_COMPONENTS],
  exports: [...ION_LIST_COMPONENTS],
})
export class IonListModule {}
