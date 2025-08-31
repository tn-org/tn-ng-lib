import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { L10nComponent } from './l10n.component';
import { L10nService } from './l10n.service';
import { L10nPipe } from './l10n.pipe';
import { L10nDirective } from './l10n.directive';
let L10nModule = class L10nModule {
};
L10nModule = __decorate([
    NgModule({
        declarations: [L10nComponent, L10nPipe, L10nDirective],
        imports: [CommonModule],
        exports: [L10nComponent, L10nPipe, L10nDirective],
        providers: [L10nService],
    })
], L10nModule);
export { L10nModule };
//# sourceMappingURL=l10n.module.js.map