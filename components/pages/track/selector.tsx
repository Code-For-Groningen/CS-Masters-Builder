import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { trackInfo } from "@/data/data";
import { BuiltProgramme, Step, Track } from "@/types/types";
import { ArrowRight } from "lucide-react";

function TrackSelector(props: { currentProgramme: BuiltProgramme, setProgramme: (programme: BuiltProgramme) => void, setCurrentStep: (step: Step) => void }) {
    const { currentProgramme, setCurrentStep, setProgramme } = props;

    const setSelectedTrack = (track: Track) => {
        const newProgramme = { ...currentProgramme, track };
        setProgramme(newProgramme);
    }

    const selectedTrack = currentProgramme.track;


    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-3xl font-bold text-slate-900">Choose Your Track</h1>
                <p className="text-lg text-slate-600">Select the specialization that matches your academic interests</p>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                {(Object.keys(trackInfo) as Track[]).map((track) => (
                    <Card
                        key={track}
                        className={`cursor-pointer transition-all hover:shadow-lg ${selectedTrack === track ? trackInfo[track].color : "bg-white hover:bg-slate-50"
                            }`}
                        onClick={() => setSelectedTrack(track)}
                    >
                        <CardHeader>
                            <CardTitle className="text-lg">{track}</CardTitle>
                            <CardDescription className="font-medium text-slate-900">{trackInfo[track].name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600">{trackInfo[track].description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedTrack && (
                <div className="mt-12 text-center">
                    <Button
                        onClick={() => setCurrentStep("course-planning")}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    >
                        Continue to Course Planning
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            )}
        </div>
    </div>
}

export { TrackSelector }