import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { L10nComponent } from './l10n.component';
import { L10nPipe } from './l10n.pipe';
import { L10nDirective } from './l10n.directive';

@NgModule({
  declarations: [L10nComponent, L10nPipe, L10nDirective],
  imports: [CommonModule],
  exports: [L10nComponent, L10nPipe, L10nDirective],
})
export class L10nModule {}
