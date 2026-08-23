# guard-destructive-ops.ps1 -- PreToolUse guard on Bash/PowerShell for dangates.co.il.
#
# Blocks irreversible repo actions and any production/infra mutation unless it is previewed
# (-DryRun / --dry-run) or explicitly approved (-Confirm together with "# APPROVED: <reason>").
# Production here is Cloudflare Pages via ops/deploy-site.ps1 (CLAUDE.md section 10), and
# "deploying is a production mutation -- always ask first". Adapted from the fleet's
# zappoacrepairdallas.com hook. Reads the tool-call JSON on stdin. exit 2 = block, exit 0 = allow.
# ASCII-only on purpose (PS 5.1 mis-decodes non-ASCII in -File scripts).

$ErrorActionPreference = 'SilentlyContinue'
$raw = [Console]::In.ReadToEnd()
if (-not $raw) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$tool = [string]$data.tool_name
$cmd = ''
if ($data.tool_input.command) { $cmd = [string]$data.tool_input.command }
$text = "$tool `n $cmd"
if (-not $text.Trim()) { exit 0 }

# Irreversible / production signatures (case-insensitive regex).
$destructive = @(
    # git history / working-tree destruction
    'git\s+push\s+.*(--force\b|--force-with-lease|\s-f\b)',
    'git\s+reset\s+--hard',
    'git\s+clean\s+-[a-z]*f',
    'git\s+branch\s+-D\b',
    'git\s+checkout\s+--\s',
    # filesystem wipes
    'rm\s+-rf\b', 'rm\s+-fr\b',
    'Remove-Item\s+.*-Recurse.*-Force', 'Remove-Item\s+.*-Force.*-Recurse',
    # publish / repo deletion
    '\bnpm\s+publish\b',
    'gh\s+repo\s+delete\b',
    # production deploys -- dry-run first, then -Confirm with an APPROVED marker
    'deploy-site\.ps1',
    'wrangler\s+(pages\s+)?(deploy|delete|publish)',
    # direct infra edits (Cloudflare zone / DNS) -- owner-only per CLAUDE.md section 12
    'api\.cloudflare\.com', '\bcf-api\.ps1\b', 'mcp__cloudflare'
)

$matched = $null
foreach ($d in $destructive) {
    if ($text -imatch $d) { $matched = $d; break }
}
if (-not $matched) { exit 0 }

$isDryRun   = ($text -imatch '-DryRun') -or ($text -imatch '--dry-run')
$isApproved = ($text -imatch '-Confirm') -and ($text -imatch '#\s*APPROVED:')
if ($isDryRun) { exit 0 }
if ($isApproved) { exit 0 }

$msg = @"
BLOCKED by guard-destructive-ops: this looks like an irreversible or production action ($matched).

  - Repo (force-push, reset --hard, git clean, rm -rf, npm publish): re-run with -DryRun first, then
      add '# APPROVED: <reason>' and -Confirm once the user has OK'd it in this conversation.
  - Deploy (ops/deploy-site.ps1, wrangler): run the -DryRun first; the real deploy needs the user's
      explicit go-ahead, '-Confirm' AND a trailing '# APPROVED: <reason>'. See the deploy-dangates skill.
  - Cloudflare zone / DNS: owner-only. Document the exact toggle in docs/owner-actions.md instead.
"@
[Console]::Error.WriteLine($msg)
exit 2
