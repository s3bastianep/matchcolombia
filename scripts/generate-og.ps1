# OG image 1200x630 — marca HABIBAR para redes sociales
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$wordmark = Join-Path $PSScriptRoot '..\public\habibar-wordmark.png'
$out = Join-Path $PSScriptRoot '..\public\og-habibar.jpg'

$w = 1200
$h = 630
$canvas = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($canvas)
try {
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    (New-Object System.Drawing.Rectangle 0, 0, $w, $h),
    [System.Drawing.Color]::FromArgb(255, 225, 45, 120),
    [System.Drawing.Color]::FromArgb(255, 120, 80, 220),
    35
  )
  $g.FillRectangle($brush, 0, 0, $w, $h)
  $brush.Dispose()

  $logo = [System.Drawing.Bitmap]::FromFile($wordmark)
  try {
    $targetW = 520
    $scale = $targetW / $logo.Width
    $targetH = [int]($logo.Height * $scale)
    $x = [int](($w - $targetW) / 2)
    $y = [int](($h - $targetH) / 2 - 20)
    $dest = New-Object System.Drawing.Rectangle $x, $y, $targetW, $targetH
    $g.DrawImage($logo, $dest)
  } finally {
    $logo.Dispose()
  }

  $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $params = New-Object System.Drawing.Imaging.EncoderParameters 1
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, 90L)
  $canvas.Save($out, $encoder, $params)
  Write-Host "Saved $out"
} finally {
  $g.Dispose()
  $canvas.Dispose()
}
