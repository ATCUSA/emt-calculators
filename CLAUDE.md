# CLAUDE.md

EMT Calculator Tools - Medical PWA built with Astro 5 + Svelte 5 + Tailwind CSS 4.

## Commands

```bash
pnpm dev              # Dev server at localhost:4321
pnpm build            # Production build to ./dist/
pnpm preview          # Preview production build
pnpm astro check      # TypeScript validation (run before committing)
```

## Architecture

```
src/
├── components/       # Svelte 5 components (medical calculators)
├── data/             # Medical data + tool registry (tools.ts is source of truth)
├── config/           # App version config (version.ts)
├── layouts/          # Astro Layout component
├── pages/            # File-based routing (Astro pages wrap Svelte components)
├── types/            # TypeScript interfaces (medical.ts)
└── styles/           # Global CSS with theme system
```

**Adding a new tool:** Add to `src/data/tools.ts` → create data file → create Svelte component → create Astro page → update `public/sw.ts` cache lists. Use `/add-calculator` command.

## Key Patterns

**Svelte 5 Runes:** Use `$state<Type>()`, `$derived.by(() => {...})`, `onclick={fn}` syntax. Always run `mcp__svelte-docs__svelte-autofixer` after writing Svelte components.

**Theme System:** Use CSS custom property classes, NOT hardcoded colors:
- `theme-bg-primary`, `theme-bg-secondary`, `theme-bg-tertiary`
- `theme-text-primary`, `theme-text-secondary`, `theme-text-muted`
- `theme-accent-primary`, `theme-border-primary`
- For semantic colors (alerts, badges): use `dark:` variant pairs (e.g., `bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200`)

**Component Loading:** Always use `<Component client:load />` in Astro pages.

**Touch Targets:** Minimum 44px (60px emergency mode). Use `py-3` on buttons, not `py-2`.

## MCP Tools Available

- `mcp__svelte-docs__svelte-autofixer` - Validate Svelte 5 components (always use after writing .svelte files)
- `mcp__astro-docs__search_astro_docs` - Astro framework guidance
- `mcp__cloudflare-docs__search_cloudflare_documentation` - Deployment/hosting docs

## Version Management

**All 4 files must stay in sync** (use `/bump-version` command):
1. `package.json` - `"version"`
2. `src/config/version.ts` - `version` in APP_CONFIG + changelog
3. `public/manifest.json` - `"version"`
4. `public/sw.ts` - `APP_VERSION` constant

Version change triggers cache invalidation and update notifications.

## Medical Safety (Critical)

- Every medical calculation needs input validation with physiological limits
- Wrap calculations in error handling - never crash
- Critical values require confirmation (HR <40/>150, BP sys <70/>200, SpO2 <88%)
- Include medical citations for all formulas
- Color-code results by urgency (normal/caution/critical)
- Professional medical disclaimers on all clinical tools

## Git Conventions

- **NEVER commit directly to `master`** - always use feature branches and PRs
- **Branch naming:** `feature/`, `fix/`, `chore/`, `refactor/`, `hotfix/` prefixes
- **Commit format:** `type(scope): description` (feat, fix, docs, style, refactor, chore)
- **Never mention Claude, AI, or automated tools in commit messages**
- **No Co-Authored-By lines** referencing AI in commits
- Run `pnpm astro check` and `pnpm build` before committing
- See [Git Workflow Guide](docs/guides/git-workflow.md) for full branching strategy and PR guidelines

## Reference Guides

Detailed guides in `docs/guides/`:
- [Development Guide](docs/guides/development.md) - Component patterns, testing, code quality
- [PWA & Deployment Guide](docs/guides/pwa-deployment.md) - Service worker, offline, CI/CD
- [Medical Standards Guide](docs/guides/medical-standards.md) - Safety, validation, citations
- [UI/UX & Accessibility Guide](docs/guides/ui-ux-accessibility.md) - Design system, WCAG, emergency mode
- [Git Workflow Guide](docs/guides/git-workflow.md) - Branching strategy, commit messages, PR guidelines