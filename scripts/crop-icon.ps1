$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$src = Join-Path $PSScriptRoot '..\public\habibar-wordmark.png'
$out = Join-Path $PSScriptRoot '..\public\habibar-icon.png'
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$w = [Math]::Min(220, $bmp.Width)
$rect = New-Object System.Drawing.Rectangle 0, 0, $w, $bmp.Height
$icon = $bmp.Clone($rect, $bmp.PixelFormat)
$icon.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Icon $w x $($bmp.Height)"
$bmp.Dispose(); $icon.Dispose()
