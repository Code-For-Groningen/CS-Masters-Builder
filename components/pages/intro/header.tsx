
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BuiltProgramme, Step } from "@/types/types"
import {
    ArrowRight,
    GraduationCap
} from "lucide-react"
import ImportDialogue from "./import-dialogue"


function IntroductionHeader(
    props: {
        setCurrentStep: (step: Step) => void,
        setProgramme: (programme: BuiltProgramme) => void,
    }
) {
    const { setCurrentStep, setProgramme } = props;

    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
                <div className="flex justify-center">
                    <div className="p-4 bg-blue-600 rounded-full">
                        <GraduationCap className="w-12 h-12 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 text-balance">Build your own MSc website</h1>
                <p className="text-xl text-slate-600 text-pretty max-w-lg mx-auto">
                    Plan and validate your Master's programme by selecting your track and organizing your courses into
                    academic blocks.
                </p>
            </div>

            <Card className="bg-white/80 backdrop-blur border-slate-200">
                <CardContent className="p-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-slate-700">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                                1
                            </div>
                            <span>Choose your specialization track</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-700">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                                2
                            </div>
                            <span>Drag and drop courses into academic blocks</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-700">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                                3
                            </div>
                            <span>Validate your programme structure</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
                <Button
                    onClick={() => {
                        setProgramme({
                            courses: {
                                1: {
                                    "1a": [],
                                    "1b": [],
                                    "2a": [],
                                    "2b": [],
                                }
                            }
                        });
                        setCurrentStep("track-selection");
                    }}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <ImportDialogue setProgramme={setProgramme} />
            </div>
        </div>
    </div>
}

export default IntroductionHeader;