import { NgModule } from "@angular/core";
import { IonPicker, IonPickerColumn, IonPickerColumnOption } from "@ionic/angular/standalone";

const ION_PICKER_COMPONENTS = [IonPicker, IonPickerColumn, IonPickerColumnOption];

@NgModule({
  imports: [...ION_PICKER_COMPONENTS],
  exports: [...ION_PICKER_COMPONENTS],
})
export class IonPickerModule {}
