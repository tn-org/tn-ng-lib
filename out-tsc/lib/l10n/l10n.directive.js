import { __decorate, __metadata } from "tslib";
import { Directive, ElementRef, Input, } from '@angular/core';
import { L10nService } from './l10n.service';
let L10nDirective = class L10nDirective {
    el;
    l10n;
    values = {};
    originalText = '';
    sub;
    constructor(el, l10n) {
        this.el = el;
        this.l10n = l10n;
    }
    ngOnInit() {
        this.sub = this.l10n.getStream().subscribe(() => {
            this.updateText();
        });
    }
    ngAfterViewInit() {
        this.originalText = (this.el.nativeElement.textContent || '').trim();
        this.updateText();
    }
    updateText() {
        const translationKey = this.originalText;
        if (!translationKey)
            return;
        this.el.nativeElement.textContent = this.l10n.get(translationKey, this.values);
    }
    ngOnDestroy() {
        this.sub?.unsubscribe();
    }
};
__decorate([
    Input('l10n'),
    __metadata("design:type", Object)
], L10nDirective.prototype, "values", void 0);
L10nDirective = __decorate([
    Directive({
        selector: '[l10n]',
    }),
    __metadata("design:paramtypes", [ElementRef, L10nService])
], L10nDirective);
export { L10nDirective };
//# sourceMappingURL=l10n.directive.js.map