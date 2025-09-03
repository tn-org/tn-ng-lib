import { NgModule } from '@angular/core';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';

const ION_INFINITE_SCROLL_COMPONENTS = [
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
];

@NgModule({
  imports: [...ION_INFINITE_SCROLL_COMPONENTS],
  exports: [...ION_INFINITE_SCROLL_COMPONENTS],
})
export class IonInfiniteScrollModule {}
