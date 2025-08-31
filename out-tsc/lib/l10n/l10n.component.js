import { __decorate, __metadata } from "tslib";
import { ElementRef, ViewChild, Component, ChangeDetectorRef, Input, } from '@angular/core';
let L10nComponent = class L10nComponent {
    cd;
    text = '';
    values = null;
    single = null;
    content;
    constructor(cd) {
        this.cd = cd;
    }
    ngOnChanges() {
        this.updateText();
    }
    ngAfterViewInit() {
        this.updateText();
    }
    updateText() {
        if (!this.content) {
            return;
        }
        this.text = this.content.nativeElement.innerHTML.trim();
        this.content.nativeElement.remove();
        this.cd.detectChanges();
    }
    get args() {
        return this.values ?? this.single ?? {};
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], L10nComponent.prototype, "values", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], L10nComponent.prototype, "single", void 0);
__decorate([
    ViewChild('content'),
    __metadata("design:type", ElementRef)
], L10nComponent.prototype, "content", void 0);
L10nComponent = __decorate([
    Component({
        selector: 'l10n',
        template: `
    {{ text | l10n : args }}
    <span #content>
      <ng-content></ng-content>
    </span>
  `,
        styles: [
            `
      :host {
        font-family: inherit;
      }
    `,
        ],
    }),
    __metadata("design:paramtypes", [ChangeDetectorRef])
], L10nComponent);
export { L10nComponent };
//# sourceMappingURL=l10n.component.js.map