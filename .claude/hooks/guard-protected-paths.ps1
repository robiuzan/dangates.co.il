# guard-protected-paths.ps1 -- PreToolUse guard on Edit/Write/MultiEdit/NotebookEdit for dangates.co.il.
#
# Makes CLAUDE.md golden rules 2 and 9 mechanical: nothing may write to the synced manifest, to
# generated/vendored output, or to the 37 generated redirect stubs under public/. A match returns a
# JSON "deny" decision (exit 0) with the reason and the place to edit instead. permissions.deny in
# settings.json carries the same set, so this hook is belt-and-braces, not the only line.
#
# Reads the tool-call JSON on stdin. ASCII-only on purpose (PS 5.1 mis-decodes non-ASCII in -File
# scripts). Best-effort: any internal failure allows the call (exit 0, no output).

$ErrorActionPreference = 'SilentlyContinue'
$raw = [Console]::In.ReadToEnd()
if (-not $raw) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$path = [string]$data.tool_input.file_path
if (-not $path) { exit 0 }

# Resolve the project root: the hook payload's cwd, else the env var, else two levels up from here.
$root = $null
if ($data.cwd) { $root = [string]$data.cwd }
if (-not $root -and $env:CLAUDE_PROJECT_DIR) { $root = $env:CLAUDE_PROJECT_DIR }
if (-not $root) { $root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path }

$norm = ($path -replace '\\', '/')
$rootNorm = ($root -replace '\\', '/').TrimEnd('/')

# Only police paths inside this project. Anything else (scratchpad, sibling repos) is not ours.
if ($norm.ToLower().StartsWith($rootNorm.ToLower() + '/')) {
    $rel = $norm.Substring($rootNorm.Length + 1)
} elseif ($norm -match '^[A-Za-z]:/' -or $norm.StartsWith('/')) {
    exit 0
} else {
    $rel = $norm.TrimStart('./')
}

$rules = @(
    @{ rx = '^site\.config\.json$';        why = 'site.config.json is synced downstream from "Israeli services sites/roster/sites/dangates.json". Edit the roster, then sync (CLAUDE.md golden rule 2).' },
    @{ rx = '^out/';                       why = 'out/ is the generated static export. Change the source under app/, components/ or lib/ and rebuild (golden rule 9).' },
    @{ rx = '^out\.prev/';                 why = 'out.prev/ is the deploy rollback copy kept by ops/deploy-site.ps1. Never edit it.' },
    @{ rx = '^vendor/';                    why = 'vendor/ holds the @ishub/site-kit tarball. Fix the kit in "Israeli services sites/packages/site-kit" and run ops/bump-site-kit.ps1.' },
    @{ rx = '^node_modules/';              why = 'node_modules/ is installed output (golden rule 9).' },
    @{ rx = '^\.next/';                    why = '.next/ is the Next.js build cache (golden rule 9).' },
    @{ rx = '^public/.+/index\.html$';     why = 'This is one of the generated legacy-redirect stubs. Edit REDIRECTS.md and run "node scripts/gen-redirects.mjs" (golden rule 9).' }
)

foreach ($r in $rules) {
    if ($rel -imatch $r.rx) {
        $reason = "BLOCKED by guard-protected-paths: '$rel' is a protected path. " + $r.why
        $out = @{
            hookSpecificOutput = @{
                hookEventName            = 'PreToolUse'
                permissionDecision       = 'deny'
                permissionDecisionReason = $reason
            }
        }
        [Console]::Out.Write(($out | ConvertTo-Json -Depth 4 -Compress))
        exit 0
    }
}

exit 0
