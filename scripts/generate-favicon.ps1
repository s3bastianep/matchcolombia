# Favicon HABIBAR — H blanca sobre gradiente violeta/magenta
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$out512 = Join-Path $root 'public\habibar-icon.png'
$out192 = Join-Path $root 'public\habibar-icon-192.png'

function Add-RoundedRectPath($path, $x, $y, $width, $height, $radius) {
  $d = $radius * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $width - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $width - $d, $y + $height - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $height - $d, $d, $d, 90, 90)
  $path.CloseFigure()
}

function New-HabibarFavicon([int]$size, [string]$path) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  try {
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $radius = [int]($size * 0.21875)
    $bgPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundedRectPath $bgPath 0 0 $size $size $radius

    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
      (New-Object System.Drawing.Point 0, $size),
      (New-Object System.Drawing.Point $size, 0),
      [System.Drawing.Color]::FromArgb(255, 124, 58, 237),
      [System.Drawing.Color]::FromArgb(255, 236, 72, 153)
    )
    try {
      $g.FillPath($brush, $bgPath)
    } finally {
      $brush.Dispose()
      $bgPath.Dispose()
    }

    $pad = [int]($size * 0.21875)
    $barW = [int]($size * 0.15625)
    $innerH = $size - ($pad * 2)
    $crossH = [int]($size * 0.15625)
    $crossY = [int](($size - $crossH) / 2)
    $white = [System.Drawing.Brushes]::White

    # Brazo izquierdo
    $g.FillRectangle($white, $pad, $pad, $barW, $innerH)
    # Brazo derecho
    $g.FillRectangle($white, $size - $pad - $barW, $pad, $barW, $innerH)
    # Barra horizontal
    $g.FillRectangle($white, $pad, $crossY, $size - ($pad * 2), $crossH)
    # Recorte central (detalle marca H)
    $notchW = [int]($size * 0.1875)
    $notchH = [int]($size * 0.15625)
    $notchX = [int](($size - $notchW) / 2)
    $notchY = $crossY
    $g.FillRectangle(
      [System.Drawing.Brushes]::Transparent,
      $notchX,
      $notchY,
      $notchW,
      $notchH
    )

    # El recorte transparente no funciona sobre fill blanco; repintar gradiente en el notch
    $notchBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
      (New-Object System.Drawing.Point 0, $size),
      (New-Object System.Drawing.Point $size, 0),
      [System.Drawing.Color]::FromArgb(255, 124, 58, 237),
      [System.Drawing.Color]::FromArgb(255, 236, 72, 153)
    )
    try {
      $g.FillRectangle($notchBrush, $notchX, $notchY, $notchW, $notchH)
    } finally {
      $notchBrush.Dispose()
    }

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Favicon OK: ${size}x${size} -> $path"
  } finally {
    $g.Dispose()
    $bmp.Dispose()
  }
}

New-HabibarFavicon 512 $out512
New-HabibarFavicon 192 $out192
