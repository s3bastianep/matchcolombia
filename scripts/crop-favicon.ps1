# Genera favicon cuadrado 512x512 con padding — legible en pestañas y PWA
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$src = Join-Path $PSScriptRoot '..\public\habibar-wordmark.png'
$out512 = Join-Path $PSScriptRoot '..\public\habibar-icon.png'
$out192 = Join-Path $PSScriptRoot '..\public\habibar-icon-192.png'

$bmp = [System.Drawing.Bitmap]::FromFile($src)
try {
  # Recorte del ícono casa (porción izquierda del wordmark)
  $cropW = [Math]::Min(200, $bmp.Width)
  $cropRect = New-Object System.Drawing.Rectangle 0, 0, $cropW, $bmp.Height
  $house = $bmp.Clone($cropRect, $bmp.PixelFormat)

  function Save-SquareIcon($size, $path) {
    $canvas = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    try {
      $g.Clear([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

      $pad = [int]($size * 0.14)
      $maxDim = $size - ($pad * 2)
      $scale = [Math]::Min($maxDim / $house.Width, $maxDim / $house.Height)
      $w = [int]($house.Width * $scale)
      $h = [int]($house.Height * $scale)
      $x = [int](($size - $w) / 2)
      $y = [int](($size - $h) / 2)

      $dest = New-Object System.Drawing.Rectangle $x, $y, $w, $h
      $g.DrawImage($house, $dest)
      $canvas.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Host "Saved $path ($size x $size)"
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
