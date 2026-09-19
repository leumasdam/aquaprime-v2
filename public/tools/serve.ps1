<#
  Staticky server pre editor layoutov.

  Editor potrebuje server z dvoch dovodov:
    1) cez file:// nevie citat obsah iframu (rovnaky povod)
    2) uklada subory cez POST /upload  ->  css\overrides.css, css\overrides.json,
       obrazky do assets\

  Spustenie (z priecinka webu):   powershell -ExecutionPolicy Bypass -File tools\serve.ps1
  Iny port / iny koren:           ... -File tools\serve.ps1 -Port 8140 -Root C:\weby\klient

  TIP: kazdemu projektu daj iny port. Editor si nastavenia (breakpointy, zamky
  vrstiev, poslednu stranku) drzi v localStorage, a ten je viazany na port —
  takze projekty sa navzajom neprepisu.
#>
param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot),
  [int]$Port = 8139
)

if (-not (Test-Path $Root)) { throw "Priecinok neexistuje: $Root" }
$Root = (Resolve-Path $Root).Path
foreach ($d in @("css", "assets")) {
  $p = Join-Path $Root $d
  if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p | Out-Null }
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Output "Koren:  $Root"
Write-Output "Web:    http://localhost:$Port/"
Write-Output "Editor: http://localhost:$Port/tools/editor.html"
Write-Output "(ukoncis Ctrl+C)"

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"
  ".js"="application/javascript; charset=utf-8"; ".json"="application/json; charset=utf-8"
  ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".webp"="image/webp"
  ".gif"="image/gif"; ".svg"="image/svg+xml"; ".ico"="image/x-icon"
  ".woff"="font/woff"; ".woff2"="font/woff2"; ".ttf"="font/ttf"; ".otf"="font/otf"
  ".mp4"="video/mp4"; ".webm"="video/webm"; ".txt"="text/plain; charset=utf-8"
  ".md"="text/plain; charset=utf-8"
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
  try {
    if ($req.HttpMethod -eq "POST" -and $path -eq "/upload") {
      # ukladame len znamé pripony a len holy nazov suboru — ziadne ..\ von z korena
      $safe = [System.IO.Path]::GetFileName($req.QueryString["name"])
      if ($safe -and ($safe -match '\.(png|jpg|jpeg|webp|svg|css|json)$')) {
        $ms = New-Object System.IO.MemoryStream
        $req.InputStream.CopyTo($ms)
        $sub = if ($safe -match '\.(css|json)$') { "css" } else { "assets" }
        $dest = Join-Path (Join-Path $Root $sub) $safe
        [System.IO.File]::WriteAllBytes($dest, $ms.ToArray())
        Write-Output ("ulozene {0}\{1}  ({2} B)" -f $sub, $safe, $ms.Length)
        $msg = [System.Text.Encoding]::UTF8.GetBytes("saved $safe " + $ms.Length + " bytes")
        $ctx.Response.StatusCode = 200
        $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
      } else { $ctx.Response.StatusCode = 400 }
    }
    else {
      if ($path -eq "/") { $path = "/index.html" }
      $file = Join-Path $Root ($path -replace "/", "\")
      if (Test-Path $file -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
        # bez cache, inak prehliadac podava stare overrides.css
        $ctx.Response.Headers.Add("Cache-Control", "no-store")
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      } else { $ctx.Response.StatusCode = 404 }
    }
  } catch { try { $ctx.Response.StatusCode = 500 } catch {} }
  try { $ctx.Response.OutputStream.Close() } catch {}
}
