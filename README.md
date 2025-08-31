# TN Angular Library

Angular 20 library for tn-org. A collection of reusable Angular components and services.

## Installation

```bash
npm install tn-ng-lib

# Create sample l10n.yml (if not auto-generated)
npx tn-init-l10n
```

**Note**: When installing via Git URL, you may need to manually run `npx tn-init-l10n` to create the sample `l10n.yml` file.

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

2. The library automatically creates a sample `l10n.yml` file in your project's `assets` folder during installation (if it doesn't exist). You can customize it as needed:

```yaml
# assets/l10n.yml
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

**Note**: The library comes with common UI words pre-defined (SAVE, CANCEL, DELETE, etc.). Your project's `l10n.yml` will be merged with these defaults, with your project taking priority for any conflicts.

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