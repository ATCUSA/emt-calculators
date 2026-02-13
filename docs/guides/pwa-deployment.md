# PWA & Deployment Guide

## Service Worker (`public/sw.ts`)

- TypeScript with proper type definitions
- Version-based cache names: `emt-calc-v${APP_VERSION}`
- Two cache lists to update when adding pages:
  - `ESSENTIAL_FILES` - Core files cached on install
  - `PRECACHE_URLS` - Pages cached for offline use
- Old caches auto-deleted on activation

### Adding a New Page to Offline Cache

Add both forms to `PRECACHE_URLS`:
```typescript
'/new-page/',
'/new-page/index.html',
```

And add the route to `ESSENTIAL_FILES`:
```typescript
'/new-page',
```

## Version Sync

All 4 files must match (breaks PWA updates if mismatched):

| File | Field |
|------|-------|
| `package.json` | `"version"` |
| `src/config/version.ts` | `APP_CONFIG.version` + changelog |
| `public/manifest.json` | `"version"` |
| `public/sw.ts` | `APP_VERSION` constant |

Use `/bump-version` command to update all atomically.

## Update Notifications

- `UpdateNotification.svelte` detects SW updates
- Compares `version.ts` with SW version
- Prompts user to refresh on mismatch

## Deployment

- **Cloudflare Pages** auto-deploys from `master` branch
- Build command: `pnpm build`
- Output directory: `dist/`

## GitHub Actions

- `basic-ci.yml` - TypeScript check, build, security audit, preview test
- `claude.yml` - Claude Code Action for `@claude` mentions
- `claude-code-review.yml` - Auto PR review
- Disabled workflows in `.github/workflows/*.disabled` await ESLint/testing setup

## Pre-deployment Checklist

- [ ] All 4 version files in sync
- [ ] `pnpm astro check` passes
- [ ] `pnpm build` succeeds
- [ ] New pages added to SW cache lists
- [ ] Manifest shortcuts updated if needed