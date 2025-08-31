import { ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { L10nService } from './l10n.service';
export declare class L10nDirective implements OnInit, OnDestroy, AfterViewInit {
    private el;
    private l10n;
    values?: Record<string, any> | string;
    private originalText;
    private sub;
    constructor(el: ElementRef, l10n: L10nService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    private updateText;
    ngOnDestroy(): void;
}
//# sourceMappingURL=l10n.directive.d.ts.map