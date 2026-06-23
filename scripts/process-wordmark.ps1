# PNG → transparente preservando colores originales (magenta + texto negro)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$src = if ($args[0]) { $args[0] } else { Join-Path $root 'public\habibar-wordmark-new.png' }
$out = if ($args[1]) { $args[1] } else { Join-Path $root 'public\habibar-wordmark.png' }

function Test-IsBackground([System.Drawing.Color]$c) {
  if ($c.A -lt 16) { return $true }
  # Blanco del export + halos anti-alias
  if ($c.R -ge 240 -and $c.G -ge 240 -and $c.B -ge 240) { return $true }
  if ($c.R -le 5 -and $c.G -le 5 -and $c.B -le 5) { return $true }
  return $false
}

$bmp = [System.Drawing.Bitmap]::FromFile($src)
try {
  $w = $bmp.Width
  $h = $bmp.Height
  $rgba = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($rgba)
  try { $g.Clear([System.Drawing.Color]::Transparent) } finally { $g.Dispose() }

  $minX = $w; $minY = $h; $maxX = 0; $maxY = 0

  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      $c = $bmp.GetPixel($x, $y)
      if (Test-IsBackground $c) { continue }

      $rgba.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
      if ($x -lt $minX) { $minX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }

  $pad = 16
  $left = [Math]::Max(0, $minX - $pad)
  $top = [Math]::Max(0, $minY - $pad)
  $cropW = [Math]::Min($w - $left, $maxX - $minX + 1 + ($pad * 2))
  $cropH = [Math]::Min($h - $top, $maxY - $minY + 1 + ($pad * 2))

  $cropRect = New-Object System.Drawing.Rectangle $left, $top, $cropW, $cropH
  $final = $rgba.Clone($cropRect, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb))
  $final.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Host "Wordmark OK: ${cropW}x${cropH} -> $out"

  $out2x = $out -replace '\.png$', '@2x.png'
  $w2 = $cropW * 2
  $h2 = $cropH * 2
  $scaled = New-Object System.Drawing.Bitmap $w2, $h2, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $sg = [System.Drawing.Graphics]::FromImage($scaled)
  try {
    $sg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $sg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $sg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $sg.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $sg.Clear([System.Drawing.Color]::Transparent)
    $sg.DrawImage($final, 0, 0, $w2, $h2)
  } finally {
    $sg.Dispose()
  }
  $scaled.Save($out2x, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Host "Wordmark @2x OK: ${w2}x${h2} -> $out2x"
  $scaled.Dispose()
} finally {
  $bmp.Dispose()
  if ($rgba) { $rgba.Dispose() }
  if ($final) { $final.Dispose() }
}
