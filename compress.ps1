Add-Type -AssemblyName System.Drawing

$files = @("project1.png", "project2.png", "dummy1.png", "dummy2.png", "dummy3.png", "dummy4.png")

foreach ($file in $files) {
    if (Test-Path $file) {
        $img = [System.Drawing.Image]::FromFile((Convert-Path $file))
        $newWidth = 800
        $newHeight = 800
        $newImg = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graph = [System.Drawing.Graphics]::FromImage($newImg)
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.DrawImage($img, 0, 0, $newWidth, $newHeight)

        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]60)

        $newName = $file.Replace(".png", ".jpg")
        $newImg.Save((Join-Path (Get-Location) $newName), $codec, $encoderParams)
        
        $graph.Dispose()
        $newImg.Dispose()
        $img.Dispose()
        
        Write-Host "Compressed $file -> $newName"
    }
}
