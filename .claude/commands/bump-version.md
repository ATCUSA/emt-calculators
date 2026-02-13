Bump the application version across all 4 PWA files atomically.

Ask the user what the new version should be (or suggest based on changes: patch for fixes, minor for new features, major for breaking changes).

Update ALL of these files to the same version:
1. `package.json` - the `"version"` field
2. `src/config/version.ts` - the `version` in `APP_CONFIG` object
3. `public/manifest.json` - the `"version"` field
4. `public/sw.ts` - the `APP_VERSION` constant

Also in `src/config/version.ts`:
- Add a new entry to the `VERSION_CHANGES` array at the top (newest first)
- Include the version number, today's date, type (major/minor/patch), and a list of changes

After updating, verify all 4 files have the same version string by reading them back.

Run `pnpm build` to verify the build passes with the new version.
