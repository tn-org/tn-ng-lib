# TN Angular Library

Angular 20 library for tn-org. A collection of reusable Angular components and services.

## Installation

```bash
npm install tn-ng-lib
```

## Modules

### L10n Module

Localization module for internationalization support.

#### Setup

1. Import the L10nModule in your Angular application:

```typescript
import { L10nModule } from 'tn-ng-lib';

@NgModule({
  imports: [L10nModule],
})
export class AppModule { }
```

2. Create `l10n.yml` file in your project's `assets` folder:

```yaml
# assets/l10n.yml
EDIT:
  ja: 編集
  en: Edit
DELETE:
  ja: 削除
  en: Delete
  DO:
    ja: 削除する
    en: Delete
WELCOME:
  ja: ようこそ
  en: Welcome
HELLO:
  ja: こんにちは {name}
  en: Hello {name}
```

#### Usage

```typescript
// Component
<l10n [single]="'EDIT'"></l10n>
<l10n [single]="'DELETE.DO'"></l10n>
<l10n [single]="'HELLO'" [values]="{name: 'John'}"></l10n>

// Pipe
{{ 'EDIT' | l10n }}
{{ 'DELETE.DO' | l10n }}
{{ 'HELLO' | l10n : {name: 'John'} }}

// Service
constructor(private l10nService: L10nService) {}
getText(key: string, args?: any): string
```

#### Components

- `L10nComponent` - Localization component
- `L10nService` - Localization service
- `L10nPipe` - Localization pipe
- `L10nDirective` - Localization directive

## Future Modules

This library is designed to be extensible. Additional modules will be added over time.

## Scripts

The library provides utility scripts that can be run from other projects:

```bash
# In your project after installing tn-ng-lib
npx tn-build-l10n        # Build l10n files once
npx tn-build-l10n-watch  # Watch and build l10n files

# Or add to your project's package.json scripts:
{
  "scripts": {
    "prebuild": "npx tn-build-l10n",
    "build": "ng build",
    "dev": "npx tn-build-l10n-watch & ng serve"
  }
}
```

## Development

```bash
npm run build        # Build the library
npm run build:watch  # Build in watch mode
npm run build-l10n   # Build l10n files
```

## License

MIT