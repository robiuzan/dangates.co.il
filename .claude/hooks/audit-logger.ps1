# audit-logger.ps1 -- PostToolUse hook for dangates.co.il.
# Appends one row per action to logs/audit.csv (gitignored) -- a deterministic, token-free trail
# that does not depend on the model remembering to log. Adapted from the fleet's
# zappoacrepairdallas.com hook. Reads the tool-call JSON on stdin. Always exits 0.

$ErrorActionPreference = 'SilentlyContinue'
$raw = [Console]::In.ReadToEnd()
if (-not $raw) { exit 0 }
try { $data = $raw | ConvertFrom-Json } catch { exit 0 }

# logs/ sits two levels up from .claude/hooks/.
$logDir  = Join-Path $PSScriptRoot '..\..\logs'
try { if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null } } catch { exit 0 }
$logFile = Join-Path $logDir 'audit.csv'

$tool = [string]$data.tool_name
$relevant = ($tool -eq 'Bash') -or ($tool -eq 'PowerShell') -or ($tool -like 'mcp__*') `
            -or ($tool -eq 'Write') -or ($tool -eq 'Edit') -or ($tool -eq 'MultiEdit')
if (-not $relevant) { exit 0 }

$detail = ''
if ($data.tool_input.command)       { $detail = [string]$data.tool_input.command }
elseif ($data.tool_input.file_path) { $detail = 'file: ' + [string]$data.tool_input.file_path }
elseif ($tool -like 'mcp__*') {
    try { $detail = ($data.tool_input | ConvertTo-Json -Depth 8 -Compress) } catch { $detail = '(mcp input)' }
}

$status = 'ok'
if ($null -ne $data.tool_response) {
    if ($data.tool_response.exit_code) { $status = 'exit=' + [string]$data.tool_response.exit_code }
    elseif ($data.tool_response.success -eq $false) { $status = 'error' }
    elseif ($data.tool_response.is_error -eq $true)  { $status = 'error' }
}

$approved = ''
if ($detail -imatch '#\s*APPROVED:')     { $approved = 'APPROVED' }
elseif ($detail -imatch '-DryRun')       { $approved = 'dry-run' }
elseif ($detail -imatch '--dry-run')     { $approved = 'dry-run' }

function CsvCell([string]$s) {
    if ($null -eq $s) { $s = '' }
    $s = $s -replace "`r?`n", ' '
    '"' + ($s -replace '"', '""') + '"'
}

$ts = (Get-Date).ToString('o')
$row = @(
    CsvCell $ts
    CsvCell $tool
    CsvCell $approved
    CsvCell $status
    CsvCell $detail
) -join ','

$mtx = New-Object System.Threading.Mutex($false, 'DangatesAuditLog')
[void]$mtx.WaitOne(2000)
try {
    if (-not (Test-Path $logFile)) {
        Set-Content -Path $logFile -Value 'timestamp,tool,approval,status,detail' -Encoding UTF8
    }
    Add-Content -Path $logFile -Value $row -Encoding UTF8
} finally {
    $mtx.ReleaseMutex(); $mtx.Dispose()
}

exit 0
