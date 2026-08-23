# secret-scan.ps1 -- PreToolUse guard on Edit/Write for dangates.co.il.
#
# Blocks writing credential-shaped strings into tracked files. Allow-lists the values that are
# PUBLIC by design in this fleet -- the Web3Forms access key (it is a browser-side key; CLAUDE.md
# backlog section 12.5), the GTM container id, and a Google site-verification token -- so they never
# trip the guard. Adapted from the fleet's zappoacrepairdallas.com hook. Reads the tool-call JSON
# on stdin. exit 2 = block, exit 0 = allow. ASCII-only on purpose (PS 5.1).

$ErrorActionPreference = 'SilentlyContinue'
$raw = [Console]::In.ReadToEnd()
if (-not $raw) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$path = [string]$data.tool_input.file_path
if (-not $path) { exit 0 }

# Gather the text being written (Write -> content, Edit -> new_string, MultiEdit -> edits[].new_string).
$content = ''
if ($data.tool_input.content)    { $content += [string]$data.tool_input.content }
if ($data.tool_input.new_string) { $content += "`n" + [string]$data.tool_input.new_string }
if ($data.tool_input.edits) {
    foreach ($e in $data.tool_input.edits) { if ($e.new_string) { $content += "`n" + [string]$e.new_string } }
}
if (-not $content) { exit 0 }

# Obvious placeholders never trip the guard.
$placeholder = 'your-|example|xxxx|<[^>]+>|changeme|placeholder|\.\.\.'

# Public-by-design values in this fleet.
$publicByDesign = '(?i)(formAccessKey|access_key|gtmId|GTM-[A-Z0-9]+|googleSiteVerification|google-site-verification|NEXT_PUBLIC_WEB3FORMS_KEY)'

$patterns = @(
    @{ name = 'Cloudflare token';      rx = '(?i)CLOUDFLARE_API_TOKEN\s*[:=]\s*[A-Za-z0-9_\-]{30,}' },
    @{ name = 'GitHub token';          rx = 'gh[pousr]_[A-Za-z0-9]{20,}' },
    @{ name = 'AWS access key';        rx = 'AKIA[0-9A-Z]{16}' },
    @{ name = 'Private key block';     rx = '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----' },
    @{ name = 'Generic secret assign'; rx = '(?i)\b(api[_-]?key|api[_-]?token|secret|password|client[_-]?secret)\b\s*[:=]\s*["'']?[A-Za-z0-9_\-\.]{16,}["'']?' }
)

foreach ($p in $patterns) {
    $m = [regex]::Matches($content, $p.rx)
    foreach ($hit in $m) {
        if ($hit.Value -imatch $placeholder) { continue }
        if ($hit.Value -imatch $publicByDesign) { continue }
        $msg = @"
BLOCKED by secret-scan: a value matching '$($p.name)' would be written to a tracked file:
  $path

Real secrets never go into code, docs or config in this repo (CLAUDE.md golden rules, "Security").
Reference them by environment-variable name only. Public fleet values (Web3Forms formAccessKey,
GTM id, google-site-verification) are allowed. If this is a placeholder, make it obviously fake.
"@
        [Console]::Error.WriteLine($msg)
        exit 2
    }
}

exit 0
