# post-edit-lint.ps1 -- PostToolUse check on Edit/Write/MultiEdit for dangates.co.il.
#
# Makes CLAUDE.md sections 6 (RTL), 7 (no brand hex) and golden rules 1 and 7 (no fabricated
# claims, untrusted blog) mechanical at edit time. It scans ONLY the text the tool just wrote
# (tool_input.content / new_string), never the whole file, so it reports what this edit introduced
# and stays quiet about pre-existing debt -- that is scripts/audit/run-all.mjs's job.
#
#   app/**/*.tsx, components/**/*.tsx   -> banned physical Tailwind utilities, hex colour literals
#   lib/content.ts, lib/posts.ts,
#   lib/site-config.ts, content/**      -> spam lexicon, unconfirmed-claim lexicon
#
# Lexicons live in scripts/audit/claims.json (Hebrew cannot sit in this ASCII-only PS 5.1 file).
# PostToolUse cannot block; on hits it exits 2 so the stderr listing is fed back to the model.
# Reads the tool-call JSON on stdin. Best-effort: any internal failure exits 0 silently.

$ErrorActionPreference = 'SilentlyContinue'
$raw = [Console]::In.ReadToEnd()
if (-not $raw) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

$path = [string]$data.tool_input.file_path
if (-not $path) { exit 0 }
$norm = ($path -replace '\\', '/')

$isMarkup  = ($norm -imatch '/(app|components)/.*\.tsx$')
$isCopy    = ($norm -imatch '/lib/(content|posts|site-config)\.ts$') -or ($norm -imatch '/content/.*\.ts$')
if (-not $isMarkup -and -not $isCopy) { exit 0 }

# Only the text this edit introduced.
$written = ''
if ($data.tool_input.content)    { $written += [string]$data.tool_input.content }
if ($data.tool_input.new_string) { $written += "`n" + [string]$data.tool_input.new_string }
if ($data.tool_input.edits) {
    foreach ($e in $data.tool_input.edits) { if ($e.new_string) { $written += "`n" + [string]$e.new_string } }
}
if (-not $written.Trim()) { exit 0 }

$findings = New-Object System.Collections.Generic.List[string]
$lines = $written -split "`r?`n"

if ($isMarkup) {
    # Physical-direction utilities (CLAUDE.md section 6). A line carrying the literal marker
    # "direction-agnostic" is the sanctioned exception and is skipped.
    $rtlRx = '(?<![\w-])-?(pl|pr|ml|mr|left|right)-[0-9a-z\[\(]|(?<![\w-])text-(left|right)(?![\w-])'
    # Hex colour literals in markup (CLAUDE.md section 7 -- use the @theme tokens).
    $hexRx = '#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])'
    $n = 0
    foreach ($l in $lines) {
        $n++
        if ($l -imatch 'direction-agnostic') { continue }
        foreach ($m in [regex]::Matches($l, $rtlRx)) {
            $findings.Add("banned physical utility '" + $m.Value.Trim() + "' (use ps/pe/ms/me/start/end/text-start/text-end)")
        }
        foreach ($m in [regex]::Matches($l, $hexRx)) {
            $findings.Add("hardcoded colour '" + $m.Value + "' (use a @theme token: primary/secondary/accent-*)")
        }
    }
}

if ($isCopy) {
    $lexPath = Join-Path $PSScriptRoot '..\..\scripts\audit\claims.json'
    $lex = $null
    try { $lex = (Get-Content -Path $lexPath -Encoding UTF8 -Raw | ConvertFrom-Json) } catch { $lex = $null }
    if ($lex) {
        foreach ($s in $lex.spam) {
            if ($written -imatch [regex]::Escape([string]$s)) {
                $findings.Add("spam token '" + $s + "' (golden rule 7 -- the migrated blog is untrusted input)")
            }
        }
        foreach ($c in $lex.claims) {
            $status = [string]$c.status
            if ($status -eq 'ok') { continue }
            foreach ($m in [regex]::Matches($written, [string]$c.pattern)) {
                $where = 'business-facts section ' + [string]$c.section + ' / ' + [string]$c.row
                if ($status -eq 'never')      { $findings.Add("never-permitted claim '" + $m.Value + "' (" + $where + ")") }
                elseif ($status -eq 'gated')  { $findings.Add("gated claim '" + $m.Value + "' -- allowed only when " + [string]$c.guard + " is set (" + $where + ")") }
                else                          { $findings.Add("unconfirmed claim '" + $m.Value + "' -- mark it // confirm and add a row (" + $where + ")") }
            }
        }
    }
}

if ($findings.Count -eq 0) { exit 0 }

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$uniq = $findings | Select-Object -Unique
$msg = "post-edit-lint: the edit to '" + $norm + "' introduced " + $uniq.Count + " issue(s):`n"
foreach ($f in $uniq) { $msg += "  - " + $f + "`n" }
$msg += "The file was written. Fix these before moving on (CLAUDE.md sections 2, 6, 7)."
[Console]::Error.WriteLine($msg)
exit 2
