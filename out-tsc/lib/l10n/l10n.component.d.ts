import { ChangeDetectorRef, AfterViewInit, OnChanges } from '@angular/core';
export declare class L10nComponent implements OnChanges, AfterViewInit {
    private cd;
    text: string;
    values: any;
    single: string | number | null;
    private content;
    constructor(cd: ChangeDetectorRef);
    ngOnChanges(): void;
    ngAfterViewInit(): void;
    updateText(): void;
    get args(): any;
}
//# sourceMappingURL=l10n.component.d.ts.map