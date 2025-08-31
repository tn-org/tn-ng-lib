import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class L10nService {
  private lang: string = 'ja';
  private dictionary$ = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {
    this.use(this.lang);
  }

  use(lang: string) {
    this.lang = lang;
    this.http.get(`/assets/dist/l10n/${lang}.json`).subscribe((dict) => {
      this.dictionary$.next(dict);
    });
  }

  get(key: string, values: any = {}): string {
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

  private replacePlaceholders(translation: string, values: any): string {
    const matches = [...translation.matchAll(/\{\{\s*([^}]+)\s*\}\}/g)];
    const keys = matches.map((m) => m[1].trim());

    if (typeof values !== 'object' && keys.length === 1) {
      // プレースホルダ1個だけのとき、stringを直接当てはめる
      values = this.get('' + values) || values;
      translation = translation.replace(matches[0][0], values);
    } else if (typeof values === 'object' && values !== null) {
      translation = translation.replace(/\{\{([^}]+)\}\}/g, (match, p1) => {
        const key = p1.trim();
        return key in values ? values[key] : '';
      });
    }

    return translation;
  }
}
