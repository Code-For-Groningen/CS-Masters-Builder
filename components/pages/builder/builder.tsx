import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { canPlaceCourse, getBlockOrder, getPackagesForTrack } from "@/data/courseUtils";
import { BlockId, BuiltProgramme, Course, Step, Track } from "@/types/types";
import { AlertCircleIcon, BookOpen, ExternalLink } from "lucide-react";
import { useState } from "react";
import ExportDialog from "./export";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseData } from "@/data/data";
import useDraggableCourses from "@/hooks/use-draggable-courses";
import PackageList from "./package-list";
import BlockList from "./block-list";
import ProgrammeSummary from "./summary";


function ProgrammeBuilder(props: {
    currentProgramme: BuiltProgramme,
    setBuiltProgramme: (programme: BuiltProgramme) => void,
    setCurrentStep: (step: Step) => void
}) {
    // Destructure props
    const { currentProgramme, setBuiltProgramme, setCurrentStep } = props;

    // Builder programme state
    const [selectedYear, setSelectedYear] = useState<number>(1)

    function getCurrentCourses(): Record<BlockId, Course[]> {
        // Check if the year exists, if so give the object
        if (currentProgramme.courses[selectedYear]) {
            return currentProgramme.courses[selectedYear];
        }

        return {
            "1a": [],
            "1b": [],
            "2a": [],
            "2b": [],
        };
    }

    const dragState = useDraggableCourses(
        currentProgramme,
        setBuiltProgramme,
        getCurrentCourses,
        selectedYear
    );

    const { impossiblePlacement, handleDragStart } = dragState;

    if (currentProgramme.track === undefined) {
        // Return an error message since somehow no track was defined
        return <Alert>
            <AlertCircleIcon />
            <AlertTitle>Something went wrong while building your programme!</AlertTitle>
            <AlertDescription>
                Somehow you ended up here without a track defined. Try reloading the page!
            </AlertDescription>
        </Alert>
    }

    const selectedTrack: Track = currentProgramme.track;

    return <div>
        {impossiblePlacement.show && (
            <div
                className="fixed z-50 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg pointer-events-none"
                style={{
                    left: impossiblePlacement.x,
                    top: impossiblePlacement.y,
                    transform: "translateX(-50%)",
                }}
            >
                {impossiblePlacement.message}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
            </div>
        )}

        <div className="max-w-7xl mx-auto py-6">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={() => setCurrentStep("track-selection")} className="text-slate-600">
                            ← Back to Track Selection
                        </Button>
                        <Badge variant="secondary" className="text-sm">
                            {selectedTrack}
                        </Badge>
                    </div>

                    <ExportDialog currentProgramme={currentProgramme!} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Course Planning</h1>
                <p className="text-slate-600">Drag courses from the packages below into your academic blocks</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <PackageList selectedTrack={selectedTrack} handleDragStart={handleDragStart} />
                </div>

                <div className="lg:col-span-2">
                    <BlockList
                        getCurrentCourses={getCurrentCourses}
                        setBuiltProgramme={setBuiltProgramme}
                        currentProgramme={currentProgramme}
                        selectedYear={selectedYear}
                        dragState={dragState}
                    />

                    <ProgrammeSummary getCurrentCourses={getCurrentCourses} />
                </div>
            </div>
        </div>
    </div>

}

export default ProgrammeBuilder;