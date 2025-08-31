import { ChangeDetectorRef, PipeTransform } from '@angular/core';
import { L10nService } from './l10n.service';
export declare class L10nPipe implements PipeTransform {
    private l10n;
    private cdr;
    private value;
    private lastKey;
    private lastValues;
    private sub;
    constructor(l10n: L10nService, cdr: ChangeDetectorRef);
    transform(key: string, values?: any): string;
    ngOnDestroy(): void;
}
//# sourceMappingURL=l10n.pipe.d.ts.map