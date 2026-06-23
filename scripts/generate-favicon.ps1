# Favicon HABIBAR — solo H con degradado marca, fondo transparente
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$public = Join-Path $root 'public'

$MAGENTA = [System.Drawing.Color]::FromArgb(255, 233, 30, 122)
$VIOLET = [System.Drawing.Color]::FromArgb(255, 139, 92, 246)

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

function Draw-HabibarHFilled($g, [int]$size, $brush) {
  $snap = $size -le 48
  $bars = @(
    @{ X = 108; Y = 104; W = 84; H = 304; R = 42 },
    @{ X = 320; Y = 104; W = 84; H = 304; R = 42 },
    @{ X = 108; Y = 208; W = 296; H = 88; R = 44 }
  )

  foreach ($bar in $bars) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    try {
      $x = Scale-Coord $bar.X $size -SnapPixel:$snap
      $y = Scale-Coord $bar.Y $size -SnapPixel:$snap
      $w = Scale-Coord $bar.W $size -SnapPixel:$snap
      $h = Scale-Coord $bar.H $size -SnapPixel:$snap
      $r = Scale-Coord $bar.R $size -SnapPixel:$snap
      if ($r * 2 -gt $w) { $r = $w / 2 }
      if ($r * 2 -gt $h) { $r = $h / 2 }
      Add-RoundedRectPath $path $x $y $w $h $r
      $g.FillPath($brush, $path)
    } finally {
      $path.Dispose()
    }
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

    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
      (New-Object System.Drawing.Point ([int](108 * $size / 512), [int](408 * $size / 512))),
      (New-Object System.Drawing.Point ([int](404 * $size / 512), [int](104 * $size / 512))),
      $MAGENTA,
      $VIOLET
    )
    try {
      Draw-HabibarHFilled $g $size $brush
    } finally {
      $brush.Dispose()
    }

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
