import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { L10nService } from './l10n.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'l10n',
  pure: false,
})
export class L10nPipe implements PipeTransform {
  private value = '';
  private lastKey = '';
  private lastValues: any = {};
  private sub: Subscription;

  constructor(private l10n: L10nService, private cdr: ChangeDetectorRef) {
    this.sub = this.l10n.getStream().subscribe(() => {
      this.value = this.l10n.get(this.lastKey, this.lastValues);
      this.cdr.markForCheck();
    });
  }

  transform(key: string, values: any = {}): string {
    const valuesChanged =
      JSON.stringify(values) !== JSON.stringify(this.lastValues);
    if (key !== this.lastKey || valuesChanged) {
      this.lastKey = key;
      this.lastValues = { ...values };
      this.value = this.l10n.get(key, values);
    }
    return this.value;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
