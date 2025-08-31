import { HttpClient } from '@angular/common/http';
export declare class L10nService {
    private http;
    private lang;
    private dictionary$;
    constructor(http: HttpClient);
    use(lang: string): void;
    get(key: string, values?: any): string;
    getStream(): import("rxjs").Observable<any>;
    getLang(): string;
    private replacePlaceholders;
}
//# sourceMappingURL=l10n.service.d.ts.map