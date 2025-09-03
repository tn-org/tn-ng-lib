import { NgModule } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle
} from '@ionic/angular/standalone';

const ION_CARD_COMPONENTS = [
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle
];

@NgModule({
  imports: [...ION_CARD_COMPONENTS],
  exports: [...ION_CARD_COMPONENTS]
})
export class IonCardModule {}