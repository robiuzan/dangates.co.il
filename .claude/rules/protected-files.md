# Protected paths — enforced, not advisory

These paths are blocked for Edit/Write by `.claude/settings.json` (`permissions.deny`) **and** by
`.claude/hooks/guard-protected-paths.ps1`. A blocked call is not a prompt to try another tool — it
is a pointer to the real source.

| Path                   | Why                                               | Edit this instead                                                            |
| ---------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `site.config.json`     | Synced downstream from the roster (golden rule 2) | `Israeli services sites/roster/sites/dangates.json`, then sync               |
| `out/`, `.next/`       | Generated build output (golden rule 9)            | `app/`, `components/`, `lib/` — then `npm run build`                         |
| `out.prev/`            | Rollback copy kept by `ops/deploy-site.ps1`       | nothing — it is the rollback                                                 |
| `vendor/`              | The `@ishub/site-kit` tarball                     | `Israeli services sites/packages/site-kit/src`, then `ops/bump-site-kit.ps1` |
| `node_modules/`        | Installed packages                                | `package.json`                                                               |
| `public/**/index.html` | The 37 generated legacy-redirect stubs            | `REDIRECTS.md`, then `node scripts/gen-redirects.mjs`                        |

Also blocked in Bash/PowerShell without a `-DryRun` preview or `-Confirm` + `# APPROVED: <reason>`:
`git push --force`, `git reset --hard`, `git clean -f`, `rm -rf`, `Remove-Item -Recurse -Force`,
`ops/deploy-site.ps1`, `wrangler pages deploy`, any Cloudflare API/DNS call
(`.claude/hooks/guard-destructive-ops.ps1`). Deploying is a production mutation — the user says go
first, every time.

`docs/business-facts.md` is not mechanically protected but is the one file an agent may **not fill
in** — its `Value` column is the owner's.
