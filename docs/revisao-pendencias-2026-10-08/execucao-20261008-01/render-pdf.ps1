$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime]
$null = [Windows.Storage.StorageFolder, Windows.Storage, ContentType=WindowsRuntime]
$null = [Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType=WindowsRuntime]
$awaitMethod = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 } | Select-Object -First 1
$awaitAction = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and -not $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 } | Select-Object -First 1
function AwaitPdf($operation, $resultType) {
    $task = $awaitMethod.MakeGenericMethod($resultType).Invoke($null, @($operation))
    $task.GetAwaiter().GetResult()
}
$pdfPath = (Resolve-Path (Join-Path $PSScriptRoot 'pdf-longo.pdf')).Path
$pdfFile = AwaitPdf ([Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)) ([Windows.Storage.StorageFile])
$pdfDocument = AwaitPdf ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($pdfFile)) ([Windows.Data.Pdf.PdfDocument])
$outputFolder = AwaitPdf ([Windows.Storage.StorageFolder]::GetFolderFromPathAsync((Split-Path $pdfPath))) ([Windows.Storage.StorageFolder])
foreach ($pageIndex in @(0..($pdfDocument.PageCount - 1))) {
    $pdfPage = $pdfDocument.GetPage($pageIndex)
    $pngFile = AwaitPdf ($outputFolder.CreateFileAsync("pdf-pagina-$($pageIndex+1).png", [Windows.Storage.CreationCollisionOption]::ReplaceExisting)) ([Windows.Storage.StorageFile])
    $pngStream = AwaitPdf ($pngFile.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)) ([Windows.Storage.Streams.IRandomAccessStream])
    try {
        $task = $awaitAction.Invoke($null, @($pdfPage.RenderToStreamAsync($pngStream)))
        $null = $task.GetAwaiter().GetResult()
    } finally { $pngStream.Dispose(); $pdfPage.Dispose() }
    $pngFile.Path
}
"Pages: $($pdfDocument.PageCount)"
