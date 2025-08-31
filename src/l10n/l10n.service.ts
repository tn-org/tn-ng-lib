import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, firstValueFrom, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class L10nService {
  private lang: string = "ja";
  private dictionary$ = new BehaviorSubject<any>({});
  private initialized = false;

  constructor(private http: HttpClient) {
    // 初期化はAPP_INITIALIZERで行うためコンストラクタでは呼ばない
    console.log("L10nService constructor");
  }

  init(lang: string = this.lang): Promise<any> {
    console.log(`L10n init called with lang: "${lang}", this.lang: "${this.lang}"`);
    return this.use(lang).then(() => {
      this.initialized = true;
      console.log(`L10n initialized with language: ${lang}, initialized: ${this.initialized}`);
    });
  }

  use(lang: string) {
    return firstValueFrom(this.loadLanguage(lang));
  }

  private loadLanguage(lang: string) {
    this.lang = lang;
    return this.http.get(`/assets/dist/l10n/${lang}.json`).pipe(
      tap((dict) => {
        this.dictionary$.next(dict);
      }),
      catchError((error) => {
        console.error(`Failed to initialize l10n with language ${lang}:`, error);
        // 初期化失敗時は空の辞書で続行
        this.dictionary$.next({});
        return of({});
      })
    );
  }

  get(key: string, values: any = {}): string {
    if (!this.initialized) {
      console.warn(`L10n service not initialized. Key: "${key}", initialized: ${this.initialized}. Make sure to call init() or use APP_INITIALIZER`);
      return key; // 初期化前はキーをそのまま返す
    }

    const dictionary = this.dictionary$.value;
    return key in dictionary ? this.replacePlaceholders(dictionary[key], values) : key;
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

    if (typeof values !== "object" && keys.length === 1) {
      // プレースホルダ1個だけのとき、stringを直接当てはめる
      values = this.get("" + values) || values;
      translation = translation.replace(matches[0][0], values);
    } else if (typeof values === "object" && values !== null) {
      translation = translation.replace(/\{\{([^}]+)\}\}/g, (match, p1) => {
        const key = p1.trim();
        return key in values ? values[key] : "";
      });
    }

    return translation;
  }
}
