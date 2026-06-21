$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$src = Join-Path $PSScriptRoot '..\public\habibar-wordmark-src.png'
$out = Join-Path $PSScriptRoot '..\public\habibar-wordmark.png'
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$minX = $bmp.Width; $minY = $bmp.Height; $maxX = 0; $maxY = 0
for ($x = 0; $x -lt $bmp.Width; $x++) {
  for ($y = 0; $y -lt $bmp.Height; $y++) {
    $c = $bmp.GetPixel($x, $y)
    if ($c.R -lt 245 -or $c.G -lt 245 -or $c.B -lt 245) {
      if ($x -lt $minX) { $minX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }
}
$pad = 20
$left = [Math]::Max(0, $minX - $pad)
$top = [Math]::Max(0, $minY - $pad)
$width = [Math]::Min($bmp.Width - $left, $maxX - $minX + 1 + 2 * $pad)
$height = [Math]::Min($bmp.Height - $top, $maxY - $minY + 1 + 2 * $pad)
$rect = New-Object System.Drawing.Rectangle $left, $top, $width, $height
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$cropped.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose(); $cropped.Dispose()
Write-Host "Saved $width x $height"
