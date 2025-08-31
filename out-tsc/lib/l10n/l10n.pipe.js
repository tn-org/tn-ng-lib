import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Pipe } from '@angular/core';
import { L10nService } from './l10n.service';
let L10nPipe = class L10nPipe {
    l10n;
    cdr;
    value = '';
    lastKey = '';
    lastValues = {};
    sub;
    constructor(l10n, cdr) {
        this.l10n = l10n;
        this.cdr = cdr;
        this.sub = this.l10n.getStream().subscribe(() => {
            this.value = this.l10n.get(this.lastKey, this.lastValues);
            this.cdr.markForCheck();
        });
    }
    transform(key, values = {}) {
        const valuesChanged = JSON.stringify(values) !== JSON.stringify(this.lastValues);
        if (key !== this.lastKey || valuesChanged) {
            this.lastKey = key;
            this.lastValues = { ...values };
            this.value = this.l10n.get(key, values);
        }
        return this.value;
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
};
L10nPipe = __decorate([
    Pipe({
        name: 'l10n',
        pure: false,
    }),
    __metadata("design:paramtypes", [L10nService, ChangeDetectorRef])
], L10nPipe);
export { L10nPipe };
//# sourceMappingURL=l10n.pipe.js.map