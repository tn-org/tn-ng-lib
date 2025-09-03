import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  IonToggle,
  IonRange,
  IonSearchbar,
  IonDatetime,
  IonDatetimeButton,
} from '@ionic/angular/standalone';

const ION_FORM_COMPONENTS = [
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  IonToggle,
  IonRange,
  IonSearchbar,
  IonDatetime,
  IonDatetimeButton,
];

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, ...ION_FORM_COMPONENTS],
  exports: [FormsModule, ReactiveFormsModule, ...ION_FORM_COMPONENTS],
})
export class IonFormModule {}
