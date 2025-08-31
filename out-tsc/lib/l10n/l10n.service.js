import { __decorate, __metadata } from "tslib";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
let L10nService = class L10nService {
    http;
    lang = 'ja';
    dictionary$ = new BehaviorSubject({});
    constructor(http) {
        this.http = http;
        this.use(this.lang);
    }
    use(lang) {
        this.lang = lang;
        this.http.get(`/assets/dist/l10n/${lang}.json`).subscribe((dict) => {
            this.dictionary$.next(dict);
        });
    }
    get(key, values = {}) {
        const dictionary = this.dictionary$.value;
        return key in dictionary
            ? this.replacePlaceholders(dictionary[key], values)
            : key;
    }
    getStream() {
        return this.dictionary$.asObservable();
    }
    getLang() {
        return this.lang;
    }
    replacePlaceholders(translation, values) {
        const matches = [...translation.matchAll(/\{\{\s*([^}]+)\s*\}\}/g)];
        const keys = matches.map((m) => m[1].trim());
        if (typeof values !== 'object' && keys.length === 1) {
            // プレースホルダ1個だけのとき、stringを直接当てはめる
            values = this.get('' + values) || values;
            translation = translation.replace(matches[0][0], values);
        }
        else if (typeof values === 'object' && values !== null) {
            translation = translation.replace(/\{\{([^}]+)\}\}/g, (match, p1) => {
                const key = p1.trim();
                return key in values ? values[key] : '';
            });
        }
        return translation;
    }
};
L10nService = __decorate([
    Injectable({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [HttpClient])
], L10nService);
export { L10nService };
//# sourceMappingURL=l10n.service.js.map