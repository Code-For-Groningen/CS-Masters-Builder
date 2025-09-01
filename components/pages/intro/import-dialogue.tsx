import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BuiltProgramme } from "@/types/types";
import { Upload } from "lucide-react";
import { useState } from "react";

function ImportDialogue(props: { setProgramme: (programme: BuiltProgramme) => void }) {
    const [importDialogOpen, setImportDialogOpen] = useState(false)
    const [importJson, setImportJson] = useState("")
    const [importError, setImportError] = useState("")

    const { setProgramme } = props;

    const handleImportJson = () => {
        try {
            const data = JSON.parse(importJson)
            if (!data.track || !data.courses) {
                throw new Error("Invalid JSON format")
            }

            let newProgramme = data as BuiltProgramme;

            setProgramme(newProgramme)
            setImportDialogOpen(false)
            setImportJson("")
            setImportError("")
        } catch (error) {
            setImportError("There was an issue parsing your file! Please ensure it is valid JSON or contact a site administrator.")
        }
    }


    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target?.result as string
                setImportJson(content)
            }
            reader.readAsText(file)
        }
    }


    return (
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 text-lg border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                >
                    <Upload className="w-5 h-5 mr-2" />
                    Import
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Import Programme</DialogTitle>
                    <DialogDescription>
                        Import your programme configuration from a JSON file or paste JSON directly.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="json" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="json">Import JSON</TabsTrigger>
                        <TabsTrigger value="file">Import File</TabsTrigger>
                    </TabsList>

                    <TabsContent value="json" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="json-input">Paste JSON Configuration</Label>
                            <Textarea
                                id="json-input"
                                placeholder='{"track": "SEDS", "courses": {"block1a": ["CS501"], "block1b": [], "block2a": [], "block2b": []}}'
                                value={importJson}
                                onChange={(e) => setImportJson(e.target.value)}
                                className="min-h-32 font-mono text-sm"
                            />
                            {importError && <p className="text-sm text-red-600">{importError}</p>}
                        </div>
                        <Button onClick={handleImportJson} className="w-full">
                            Import Configuration
                        </Button>
                    </TabsContent>

                    <TabsContent value="file" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="file-input">Select JSON File</Label>
                            <Input
                                id="file-input"
                                type="file"
                                accept=".json"
                                onChange={handleFileImport}
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
                                <Button onClick={handleImportJson} className="w-full">
                                    Import Configuration
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

export default ImportDialogue;