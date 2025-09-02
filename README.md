# TN Angular Library

Angular 20 library for tn-org. A collection of reusable Angular components and services.

## Installation

```bash
npm install @tnlake/tn-ng-lib

# Initialize l10n files (required)
npx tn-init-l10n
```

## Modules

### L10n Module

Localization module for internationalization support.

#### Setup

1. Import the L10nModule in your Angular application:

```typescript
import { L10nModule } from '@tnlake/tn-ng-lib';

@NgModule({
  imports: [L10nModule],
})
export class AppModule { }
```

2. Create `l10n.yml` files in your project's `src` folder (using `npx tn-init-l10n`). You can now organize translations modularly:

**Multiple Files Support**: Place `l10n.yml` files anywhere in `src/` directory for modular organization.

**Basic Setup:**
```yaml
# src/l10n.yml (global translations)
# Project-specific translations (will be merged with library defaults)
CUSTOM_MESSAGE:
  ja: カスタムメッセージ
  en: Custom message

# Override library defaults if needed
SAVE:
  ja: セーブ  # Override library default "保存"
  en: Save

# Nested structure example
USER:
  PROFILE:
    ja: プロフィール
    en: Profile
```

**Modular Organization with Namespaces:**
```yaml
# src/pages/mypage/l10n.yml
namespace: MYPAGE
TITLE:
  ja: マイページ  
  en: My Page
SETTINGS:
  ja: 設定
  en: Settings

# src/components/form/l10n.yml  
namespace: FORM
VALIDATION:
  REQUIRED:
    ja: 必須項目です
    en: This field is required
```

This creates JSON keys like: `MYPAGE.TITLE`, `FORM.VALIDATION.REQUIRED`

**Note**: The library comes with common UI words pre-defined (SAVE, CANCEL, DELETE, etc.). Your project's `l10n.yml` files will be merged with these defaults, with your project taking priority for any conflicts.

#### Usage

```typescript
// Component - using library defaults
<l10n [single]="'SAVE'"></l10n>           <!-- "保存" / "Save" -->
<l10n [single]="'CANCEL'"></l10n>         <!-- "キャンセル" / "Cancel" -->
<l10n [single]="'CONFIRM_DELETE'"></l10n> <!-- "削除してもよろしいですか？" -->

// Component - using project custom
<l10n [single]="'CUSTOM_MESSAGE'"></l10n>
<l10n [single]="'USER.PROFILE'"></l10n>

// Pipe
{{ 'SAVE' | l10n }}
{{ 'LOADING' | l10n }}
{{ 'CUSTOM_MESSAGE' | l10n }}

// Service
constructor(private l10nService: L10nService) {}
getText(key: string, args?: any): string
```

#### Built-in Translations

The library includes common UI translations for Japanese and English:

- **Basic Actions**: SAVE, CANCEL, DELETE, EDIT, ADD, UPDATE, CONFIRM, etc.
- **Status Messages**: SUCCESS, ERROR, WARNING, INFO, LOADING, COMPLETED
- **UI Elements**: LOGIN, LOGOUT, USERNAME, PASSWORD, EMAIL, SEARCH, etc.
- **Validation**: REQUIRED, INVALID_EMAIL, PASSWORD_REQUIRED
- **Confirmations**: CONFIRM_DELETE, CONFIRM_SAVE, UNSAVED_CHANGES

See `src/assets/default-l10n.yml` in the library for the complete list.

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
npx tn-init-l10n         # Create sample l10n.yml (one-time setup)
npx tn-build-l10n        # Build l10n files once
npx tn-build-l10n-watch  # Watch and build l10n files

# Or add to your project's package.json scripts:
{
  "scripts": {
    "prebuild": "npx tn-build-l10n",
    "build": "ng build",
    "start": "npx tn-build-l10n-watch & ng serve",
    "serve": "npx tn-build-l10n && ng serve"
  }
}

# For Windows (use npm-run-all for cross-platform):
npm install --save-dev npm-run-all
{
  "scripts": {
    "start": "npm-run-all --parallel l10n:watch serve",
    "l10n:watch": "npx tn-build-l10n-watch",
    "serve": "ng serve"
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