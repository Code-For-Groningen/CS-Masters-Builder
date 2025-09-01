import { DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { exportToJson, downloadJsonFile, downloadLegibleText } from "@/data/exportImportUtils";
import { BuiltProgramme } from "@/types/types";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, Code, FileText } from "lucide-react";
import { useState } from "react";

function ExportDialog(props: { currentProgramme: BuiltProgramme }) {
    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const { currentProgramme } = props

    return <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" className="text-slate-700 bg-transparent">
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
                        onClick={() => {
                            navigator.clipboard.writeText(exportToJson(currentProgramme))
                            setExportDialogOpen(false)
                        }}
                        variant="outline"
                        className="justify-start"
                    >
                        <Code className="w-4 h-4 mr-2" />
                        Copy JSON to Clipboard
                    </Button>

                    <Button
                        onClick={() => {
                            downloadJsonFile(currentProgramme)
                            setExportDialogOpen(false)
                        }}
                        variant="outline"
                        className="justify-start"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download JSON File
                    </Button>

                    <Button
                        onClick={() => {
                            downloadLegibleText(currentProgramme)
                            setExportDialogOpen(false)
                        }}
                        variant="outline"
                        className="justify-start"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Download Legible Text
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label>JSON Preview</Label>
                    <Textarea value={exportToJson(currentProgramme)} readOnly className="min-h-32 font-mono text-sm bg-slate-50" />
                </div>
            </div>
        </DialogContent>
    </Dialog>
}

export default ExportDialog;