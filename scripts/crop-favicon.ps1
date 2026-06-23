# Favicon desde ícono casa (solo porción izquierda del wordmark, sin texto)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$src = Join-Path $PSScriptRoot '..\public\habibar-wordmark.png'
$out512 = Join-Path $PSScriptRoot '..\public\habibar-icon.png'
$out192 = Join-Path $PSScriptRoot '..\public\habibar-icon-192.png'

function Test-IsMagenta([System.Drawing.Color]$c) {
  return $c.R -gt 120 -and $c.G -lt 80 -and $c.B -lt 130
}

function Get-IconCropWidth($bmp) {
  $maxMagX = 0
  for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
      if (Test-IsMagenta $bmp.GetPixel($x, $y)) {
        if ($x -gt $maxMagX) { $maxMagX = $x }
      }
    }
  }
  if ($maxMagX -gt 40) {
    return [Math]::Min($maxMagX + 24, $bmp.Width)
  }
  return [Math]::Min([int]($bmp.Height * 1.05), [int]($bmp.Width * 0.35))
}

$bmp = [System.Drawing.Bitmap]::FromFile($src)
try {
  $cropW = Get-IconCropWidth $bmp
  $cropRect = New-Object System.Drawing.Rectangle 0, 0, $cropW, $bmp.Height
  $house = $bmp.Clone($cropRect, $bmp.PixelFormat)

  function Save-SquareIcon($size, $path) {
    $canvas = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    try {
      $g.Clear([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

      $pad = [int]($size * 0.12)
      $maxDim = $size - ($pad * 2)
      $scale = [Math]::Min($maxDim / $house.Width, $maxDim / $house.Height)
      $w = [int]($house.Width * $scale)
      $h = [int]($house.Height * $scale)
      $x = [int](($size - $w) / 2)
      $y = [int](($size - $h) / 2)

      $dest = New-Object System.Drawing.Rectangle $x, $y, $w, $h
      $g.DrawImage($house, $dest)
      $canvas.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Host "Saved $path ($size x $size) cropW=$cropW"
    } finally {
      $g.Dispose()
      $canvas.Dispose()
    }
  }

  Save-SquareIcon 512 $out512
  Save-SquareIcon 192 $out192
} finally {
  $house.Dispose()
  $bmp.Dispose()
}
