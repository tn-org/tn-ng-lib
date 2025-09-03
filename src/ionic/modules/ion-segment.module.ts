import { NgModule } from '@angular/core';
import {
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
} from '@ionic/angular/standalone';

const ION_SEGMENT_COMPONENTS = [
  IonSegment,
  IonSegmentContent,
  IonSegmentView,
  IonSegmentButton,
];

@NgModule({
  imports: [...ION_SEGMENT_COMPONENTS],
  exports: [...ION_SEGMENT_COMPONENTS],
})
export class IonSegmentModule {}
