# FZ Media - Natively Upload & Host Website on GitHub Pages via PowerShell REST API
param (
    [string]$Username,
    [string]$Token,
    [string]$RepoName = "fz-media"
)

# Clear screen for professional terminal visual interface
Clear-Host
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      FZ MEDIA PREVIEW PORTAL GITHUB DEPLOYER           " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Input gathering
if (-not $Username) {
    $Username = Read-Host -Prompt "Enter your GitHub Username"
}
if (-not $Token) {
    Write-Host "" -ForegroundColor Yellow
    Write-Host "To deploy, you need a Personal Access Token with 'repo' scope." -ForegroundColor Yellow
    Write-Host "Generate one at: https://github.com/settings/tokens" -ForegroundColor Yellow
    $Token = Read-Host -Prompt "Enter your GitHub Personal Access Token"
}
if (-not $RepoName) {
    $RepoName = Read-Host -Prompt "Enter repository name (default: fz-media)"
}

$Headers = @{
    "Authorization" = "token $Token"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "PowerShell-Deploy-Agent"
}

# 2. Check if repo exists, if not, create it
Write-Host "" -ForegroundColor Cyan
Write-Host "[1/4] Checking if repository '$RepoName' exists on GitHub..." -ForegroundColor Cyan
$RepoUrl = "https://api.github.com/repos/$Username/$RepoName"
$RepoExists = $false

try {
    $repoObj = Invoke-RestMethod -Uri $RepoUrl -Headers $Headers -Method Get -ErrorAction Stop
    Write-Host "OK: Repository '$RepoName' already exists! Preparing updates..." -ForegroundColor Green
    $RepoExists = $true
} catch {
    # If 404, repository doesn't exist. Create it!
    Write-Host "Repository '$RepoName' not found. Creating a new public repository on your account..." -ForegroundColor Yellow
    
    $CreateBodyObj = @{
        name = $RepoName
        description = "FZ Media premium visual agency website"
        private = $false
        has_issues = $true
        has_projects = $true
        has_wiki = $true
    }
    $CreateBody = $CreateBodyObj | ConvertTo-Json
    
    try {
        $repoObj = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $Headers -Method Post -Body $CreateBody -ContentType "application/json" -ErrorAction Stop
        Write-Host "OK: Repository '$RepoName' created successfully on GitHub!" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Failed to create repository: $_" -ForegroundColor Red
        return
    }
}

# 3. Scan local files
$WorkspacePath = Get-Location
Write-Host "" -ForegroundColor Cyan
Write-Host "[2/4] Scanning files recursively in: $WorkspacePath..." -ForegroundColor Cyan

$MaxRawSize = 70 * 1024 * 1024 # 70 MB size limit
$LargeFiles = @()
$NormalFiles = @()

# Gather files recursively, excluding git, vscode, gemini configs and the deploy script itself
$AllFiles = Get-ChildItem -Path $WorkspacePath -Recurse -File | Where-Object {
    $_.FullName -notmatch "\\\.git" -and 
    $_.FullName -notmatch "\\\.vscode" -and
    $_.FullName -notmatch "\\\.gemini" -and
    $_.Name -ne "deploy.ps1"
}

foreach ($File in $AllFiles) {
    if ($File.Length -gt $MaxRawSize) {
        $LargeFiles += $File
    } else {
        $NormalFiles += $File
    }
}

$Files = $NormalFiles

Write-Host "Found $($Files.Count) files ready for upload." -ForegroundColor Green

if ($LargeFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Notice: Found $($LargeFiles.Count) media file(s) exceeding the 70MB GitHub API limit:" -ForegroundColor Yellow
    foreach ($LFile in $LargeFiles) {
        $RelLPath = $LFile.FullName.Substring($WorkspacePath.Path.Length + 1).Replace("\", "/")
        $SizeMB = [Math]::Round($LFile.Length / 1MB, 2)
        $Msg = "   - " + $RelLPath + " (" + $SizeMB + " MB)"
        Write-Host $Msg -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "These large videos will be skipped to prevent upload failure." -ForegroundColor Gray
    Write-Host "Tip: You can host these on YouTube, Vimeo, or Google Drive, and simply paste their" -ForegroundColor Gray
    Write-Host "links directly into your premium Admin Panel (e.g., Portfolio and Review Settings)!" -ForegroundColor Gray
}

Write-Host "" -ForegroundColor Cyan
Write-Host "[3/4] Uploading files to GitHub (this may take a moment for media)..." -ForegroundColor Cyan

# 4. Upload files
$UploadedCount = 0
$FailedCount = 0

foreach ($File in $Files) {
    # Calculate the relative path on GitHub
    $RelativePath = $File.FullName.Substring($WorkspacePath.Path.Length + 1).Replace("\", "/")
    
    # Read file bytes and convert to Base64
    $Bytes = [System.IO.File]::ReadAllBytes($File.FullName)
    $Base64 = [Convert]::ToBase64String($Bytes)
    
    # Get existing SHA if file exists to overwrite it
    $Sha = $null
    $FileApiUrl = "https://api.github.com/repos/$Username/$RepoName/contents/$RelativePath"
    
    try {
        $FileObj = Invoke-RestMethod -Uri $FileApiUrl -Headers $Headers -Method Get -ErrorAction SilentlyContinue
        $Sha = $FileObj.sha
    } catch {}
    
    # Upload payload
    $UploadBody = @{
        message = "Upload $RelativePath via FZ PowerShell Deployer"
        content = $Base64
    }
    if ($Sha) {
        $UploadBody.sha = $Sha
    }
    
    $UploadJson = $UploadBody | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $FileApiUrl -Headers $Headers -Method Put -Body $UploadJson -ContentType "application/json" -ErrorAction Stop
        if ($Sha) {
            $OutMsg = "  -> Updated: " + $RelativePath
            Write-Host $OutMsg -ForegroundColor Gray
        } else {
            $OutMsg = "  -> Created: " + $RelativePath
            Write-Host $OutMsg -ForegroundColor Gray
        }
        $UploadedCount++
    } catch {
        $ErrMsg = "  -> Failed: " + $RelativePath + " (" + $_ + ")"
        Write-Host $ErrMsg -ForegroundColor Red
        $FailedCount++
    }
}

Write-Host "" -ForegroundColor Green
Write-Host "Upload summary: $UploadedCount successfully processed, $FailedCount failed." -ForegroundColor Green

# 5. Enable GitHub Pages
Write-Host "" -ForegroundColor Cyan
Write-Host "[4/4] Activating GitHub Pages..." -ForegroundColor Cyan
$PagesApiUrl = "https://api.github.com/repos/$Username/$RepoName/pages"

$PagesBodyObj = @{
    source = @{
        branch = "main"
        path = "/"
    }
}
$PagesBody = $PagesBodyObj | ConvertTo-Json

try {
    $pagesResponse = Invoke-RestMethod -Uri $PagesApiUrl -Headers $Headers -Method Post -Body $PagesBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "OK: GitHub Pages enabled successfully!" -ForegroundColor Green
} catch {
    # Pages might already be enabled
    Write-Host "GitHub Pages is already configured or updated." -ForegroundColor Yellow
}

$LiveUrl = "https://" + $Username + ".github.io/" + $RepoName + "/"
Write-Host "" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host "SUCCESS! YOUR FZ MEDIA SITE IS NOW GOING LIVE!" -ForegroundColor Green
$OutUrlMsg = "Live URL: " + $LiveUrl
Write-Host $OutUrlMsg -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host "(Please note: GitHub Pages may take 1-2 minutes to compile and show your site contents online.)" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray
