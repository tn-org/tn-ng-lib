import { Directive, HostListener, Input } from "@angular/core";
import { firstValueFrom, isObservable } from "rxjs";

@Directive({
  selector: "[exClick]",
  host: {
    "[attr.aria-busy]": 'processing ? "true" : null',
    "[attr.aria-disabled]": 'processing ? "true" : null',
    "[attr.disabled]": "processing || exDisabled ? true : null",
  },
})
export class ExhaustClickDirective {
  @Input("exClick") handler?: () => Promise<any> | any;
  @Input() exDisabled = false; // 外部から渡す無効条件
  processing = false;

  @HostListener("click", ["$event"])
  async onClick(e: Event) {
    if (this.processing || this.exDisabled || !this.handler) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    this.processing = true;
    try {
      const r = this.handler();
      if (r?.then) await r;
      else if (isObservable(r)) await firstValueFrom(r as any);
    } finally {
      this.processing = false;
    }
  }
}
