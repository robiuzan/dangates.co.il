# session-context.ps1 -- SessionStart hook for dangates.co.il (startup / resume / compact).
#
# Prints a short orientation block to stdout, which Claude Code injects as context: where the
# backlog stands, the newest audit report, working-tree state, and the two entry points. This is
# the mechanical half of "read docs/optimization-backlog.md first" -- the file is 700 lines; the
# session gets the 30 that matter.
#
# Reads the hook JSON on stdin (ignored except for cwd). ASCII-only source; the files it prints
# are UTF-8 Hebrew, so the console encoding is switched before output. Always exits 0.

$ErrorActionPreference = 'SilentlyContinue'
$raw = [Console]::In.ReadToEnd()
$cwd = $null
try { if ($raw) { $cwd = ($raw | ConvertFrom-Json).cwd } } catch { }
if (-not $cwd) { $cwd = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path }

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$out = New-Object System.Collections.Generic.List[string]

try {
    Push-Location $cwd

    $out.Add('## dangates.co.il -- session orientation (from .claude/hooks/session-context.ps1)')
    $out.Add('')

    # 1. Backlog: the "Suggested order of work" block, verbatim.
    $backlog = 'docs/optimization-backlog.md'
    if (Test-Path $backlog) {
        $text = Get-Content -Path $backlog -Encoding UTF8
        $start = -1
        for ($i = 0; $i -lt $text.Count; $i++) {
            if ($text[$i] -match '^## Suggested order of work') { $start = $i; break }
        }
        if ($start -ge 0) {
            $out.Add('### Backlog -- suggested order of work (docs/optimization-backlog.md)')
            $taken = 0
            for ($i = $start + 1; $i -lt $text.Count -and $taken -lt 16; $i++) {
                $line = $text[$i]
                if ($line -match '^## ') { break }
                if ($line.Trim()) { $out.Add($line); $taken++ }
            }
            $out.Add('')
        }
    } else {
        $out.Add('(docs/optimization-backlog.md missing -- run /audit full to rebuild the baseline)')
    }

    # 2. Newest audit report and its verdict line.
    $reports = @()
    if (Test-Path 'docs/audits') {
        $reports = Get-ChildItem -Path 'docs/audits' -Filter '*.md' |
            Where-Object { $_.Name -notmatch '^(_template|README)' } |
            Sort-Object Name -Descending
    }
    if ($reports.Count -gt 0) {
        $latest = $reports[0]
        $verdict = (Get-Content -Path $latest.FullName -Encoding UTF8 | Where-Object { $_ -match '^\*\*Verdict' } | Select-Object -First 1)
        $out.Add('### Latest audit: docs/audits/' + $latest.Name)
        if ($verdict) { $out.Add($verdict) }
        $out.Add('')
    } else {
        $out.Add('### No audit report yet -- docs/audits/ is empty. Run /audit full to create the baseline.')
        $out.Add('')
    }

    # 3. Working tree.
    $status = @(git status --porcelain 2>$null)
    $modified = @($status | Where-Object { $_ -and -not $_.StartsWith('??') }).Count
    $untracked = @($status | Where-Object { $_ -and $_.StartsWith('??') }).Count
    $out.Add('### Working tree: ' + $modified + ' modified, ' + $untracked + ' untracked')
    $envUntracked = @($status | Where-Object { $_ -match '^\?\? (\.claude/|docs/|CLAUDE\.md)' })
    if ($envUntracked.Count -gt 0) {
        $out.Add('WARNING: the agent environment (.claude/, docs/, CLAUDE.md) is untracked -- commit it.')
    }
    $out.Add('')

    # 4. Entry points.
    $out.Add('### Entry points')
    $out.Add('- /audit [full|seo|schema|content|cro|security|perf|a11y]  -> dated report in docs/audits/, backlog statuses refreshed')
    $out.Add('- /improve <backlog-id>  (e.g. /improve 3.1)  -> routed via docs/agent-roster.md, gated by npm run gate')
    $out.Add('- npm run audit | npm run audit:env | npm run gate  -> deterministic checks (scripts/audit/)')
    $out.Add('- Business facts: docs/business-facts.md is the only file an agent may not fill in.')
} catch { }
finally { try { Pop-Location } catch { } }

foreach ($l in $out) { [Console]::Out.WriteLine($l) }
exit 0
