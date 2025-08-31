import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Download, FileText, Upload } from "lucide-react"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  importJson: string
  setImportJson: (value: string) => void
  importError: string
  onFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void
  onImportJson: () => void
}

export function ImportDialog({
  open,
  onOpenChange,
  importJson,
  setImportJson,
  importError,
  onFileImport,
  onImportJson
}: ImportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-slate-600">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Programme</DialogTitle>
          <DialogDescription>Import a previously exported programme configuration.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="paste" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste JSON</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <Label>JSON Configuration</Label>
              <Textarea
                placeholder="Paste your exported JSON here..."
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                className="min-h-32 font-mono text-sm"
              />
              {importError && <p className="text-sm text-red-600">{importError}</p>}
              <Button onClick={onImportJson} className="w-full" disabled={!importJson.trim()}>
                Import Configuration
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-input">Select JSON File</Label>
              <input
                id="file-input"
                type="file"
                accept=".json"
                onChange={onFileImport}
                className="cursor-pointer"
              />
            </div>
            {importJson && (
              <div className="space-y-2">
                <Label>File Contents Preview</Label>
                <Textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  className="min-h-32 font-mono text-sm"
                />
                {importError && <p className="text-sm text-red-600">{importError}</p>}
                <Button onClick={onImportJson} className="w-full">
                  Import Configuration
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCopyJson: () => void
  onDownloadJson: () => void
  onDownloadText: () => void
  exportToJson: () => string
}

export function ExportDialog({
  open,
  onOpenChange,
  onCopyJson,
  onDownloadJson,
  onDownloadText,
  exportToJson
}: ExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-slate-600">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Programme</DialogTitle>
          <DialogDescription>Export your programme configuration in different formats.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3">
            <Button
              onClick={onCopyJson}
              variant="outline"
              className="justify-start"
            >
              <Code className="w-4 h-4 mr-2" />
              Copy JSON to Clipboard
            </Button>

            <Button
              onClick={onDownloadJson}
              variant="outline"
              className="justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Download JSON File
            </Button>

            <Button
              onClick={onDownloadText}
              variant="outline"
              className="justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download Legible Text
            </Button>
          </div>

          <div className="space-y-2">
            <Label>JSON Preview</Label>
            <Textarea value={exportToJson()} readOnly className="min-h-32 font-mono text-sm bg-slate-50" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
