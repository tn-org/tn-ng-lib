import {
  ElementRef,
  ViewChild,
  Component,
  ChangeDetectorRef,
  AfterViewInit,
  Input,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'l10n',
  standalone: false,
  template: `
    {{ text | l10n : args }}
    <span #content>
      <ng-content></ng-content>
    </span>
  `,
  styles: [
    `
      :host {
        font-family: inherit;
      }
    `,
  ],
})
export class L10nComponent implements OnChanges, AfterViewInit {
  text: string = '';

  @Input() values: any = null;
  @Input() single: string | number | null = null;

  @ViewChild('content')
  private content!: ElementRef<Element>;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges() {
    this.updateText();
  }

  ngAfterViewInit() {
    this.updateText();
  }

  updateText() {
    if (!this.content) {
      return;
    }
    this.text = this.content.nativeElement.innerHTML.trim();
    this.content.nativeElement.remove();
    this.cd.detectChanges();
  }

  get args() {
    return this.values ?? this.single ?? {};
  }
}
