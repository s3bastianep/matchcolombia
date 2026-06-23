# Favicon HABIBAR — casa sólida blanca (nítida en 16px, sin trazos borrosos)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$public = Join-Path $root 'public'

function Add-RoundedRectPath($path, $x, $y, $width, $height, $radius) {
  $d = $radius * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $width - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $width - $d, $y + $height - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $height - $d, $d, $d, 90, 90)
  $path.CloseFigure()
}

function Scale-Coord([double]$value, [int]$size, [switch]$SnapPixel) {
  $scaled = $value * ($size / 512.0)
  if ($SnapPixel) { return [single][math]::Round($scaled) }
  return [single]$scaled
}

function Draw-HabibarHouseFilled($g, [int]$size) {
  $snap = $size -le 48
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.FillMode = [System.Drawing.Drawing2D.FillMode]::Alternate

  $outer = @(
    (New-Object System.Drawing.PointF (Scale-Coord 124 $size -SnapPixel:$snap), (Scale-Coord 216 $size -SnapPixel:$snap)),
    (New-Object System.Drawing.PointF (Scale-Coord 256 $size -SnapPixel:$snap), (Scale-Coord 108 $size -SnapPixel:$snap)),
    (New-Object System.Drawing.PointF (Scale-Coord 388 $size -SnapPixel:$snap), (Scale-Coord 216 $size -SnapPixel:$snap)),
    (New-Object System.Drawing.PointF (Scale-Coord 388 $size -SnapPixel:$snap), (Scale-Coord 396 $size -SnapPixel:$snap)),
    (New-Object System.Drawing.PointF (Scale-Coord 124 $size -SnapPixel:$snap), (Scale-Coord 396 $size -SnapPixel:$snap))
  )

  try {
    $path.AddPolygon($outer)
    if ($size -ge 192) {
      $door = @(
        (New-Object System.Drawing.PointF (Scale-Coord 164 $size -SnapPixel:$snap), (Scale-Coord 396 $size -SnapPixel:$snap)),
        (New-Object System.Drawing.PointF (Scale-Coord 164 $size -SnapPixel:$snap), (Scale-Coord 276 $size -SnapPixel:$snap)),
        (New-Object System.Drawing.PointF (Scale-Coord 236 $size -SnapPixel:$snap), (Scale-Coord 276 $size -SnapPixel:$snap)),
        (New-Object System.Drawing.PointF (Scale-Coord 236 $size -SnapPixel:$snap), (Scale-Coord 396 $size -SnapPixel:$snap))
      )
      $path.AddPolygon($door)
    }
    $g.FillPath([System.Drawing.Brushes]::White, $path)
  } finally {
    $path.Dispose()
  }
}

function New-HabibarFavicon([int]$size, [string]$path) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  try {
    if ($size -le 48) {
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::None
    } else {
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    }
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $radius = if ($size -le 48) { [math]::Round($size * 0.21875) } else { [int]($size * 0.21875) }
    $bgPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundedRectPath $bgPath 0 0 $size $size $radius

    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
      (New-Object System.Drawing.Point ([int](72 * $size / 512), [int](440 * $size / 512))),
      (New-Object System.Drawing.Point ([int](440 * $size / 512), [int](72 * $size / 512))),
      [System.Drawing.Color]::FromArgb(255, 124, 58, 237),
      [System.Drawing.Color]::FromArgb(255, 236, 72, 153)
    )
    try {
      $g.FillPath($brush, $bgPath)
    } finally {
      $brush.Dispose()
      $bgPath.Dispose()
    }

    Draw-HabibarHouseFilled $g $size

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Favicon OK: ${size}x${size} -> $path"
  } finally {
    $g.Dispose()
    $bmp.Dispose()
  }
}

@(
  @{ Size = 16; File = 'habibar-icon-16.png' },
  @{ Size = 32; File = 'habibar-icon-32.png' },
  @{ Size = 48; File = 'habibar-icon-48.png' },
  @{ Size = 192; File = 'habibar-icon-192.png' },
  @{ Size = 512; File = 'habibar-icon.png' }
) | ForEach-Object {
  New-HabibarFavicon $_.Size (Join-Path $public $_.File)
}
