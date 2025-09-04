import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { L10nService } from './l10n.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[l10n]',
  standalone: false,
})
export class L10nDirective implements OnInit, OnDestroy, AfterViewInit {
  @Input('l10n') values?: Record<string, any> | string = {};

  private originalText: string = '';
  private sub: Subscription | undefined;

  constructor(private el: ElementRef, private l10n: L10nService) {}

  ngOnInit(): void {
    this.sub = this.l10n.getStream().subscribe(() => {
      this.updateText();
    });
  }

  ngAfterViewInit(): void {
    this.originalText = (this.el.nativeElement.textContent || '').trim();
    this.updateText();
  }

  private updateText(): void {
    const translationKey = this.originalText;
    if (!translationKey) return;

    this.el.nativeElement.textContent = this.l10n.get(
      translationKey,
      this.values
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
