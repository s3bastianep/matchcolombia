# Favicon HABIBAR — casa blanca sobre gradiente violeta/magenta (legible en 16px)
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

function Draw-HabibarHouse($g, $size) {
  $s = $size / 512.0
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), ([single](40 * $s))
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

  try {
    $g.DrawLine($pen, 124 * $s, 396 * $s, 124 * $s, 216 * $s)
    $g.DrawLine($pen, 124 * $s, 216 * $s, 256 * $s, 108 * $s)
    $g.DrawLine($pen, 256 * $s, 108 * $s, 388 * $s, 216 * $s)
    $g.DrawLine($pen, 388 * $s, 216 * $s, 388 * $s, 396 * $s)
    $g.DrawLine($pen, 124 * $s, 396 * $s, 388 * $s, 396 * $s)
    $g.DrawLine($pen, 164 * $s, 396 * $s, 164 * $s, 276 * $s)
    $g.DrawLine($pen, 164 * $s, 276 * $s, 236 * $s, 276 * $s)
    $g.DrawLine($pen, 236 * $s, 276 * $s, 236 * $s, 396 * $s)
  } finally {
    $pen.Dispose()
  }
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

    Draw-HabibarHouse $g $size

    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Favicon OK: ${size}x${size} -> $path"
  } finally {
    $g.Dispose()
    $bmp.Dispose()
  }
}

New-HabibarFavicon 512 $out512
New-HabibarFavicon 192 $out192
