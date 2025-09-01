import { Button } from "@/components/ui/button";
import { BlockId, Course } from "@/types/types"

function ProgrammeSummary(props: {
    getCurrentCourses: () => Record<BlockId, Course[]>
}) {
    const { getCurrentCourses } = props;

    return <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center">
            <div>
                <h3 className="font-semibold text-blue-900">Programme Summary</h3>
                <p className="text-sm text-blue-700">
                    Total Credits:{" "}
                    {Object.values(getCurrentCourses())
                        .flat()
                        .reduce((sum, course) => sum + course.credits, 0)}{" "}
                    ECTS
                </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => alert("Programme validated!")}>
                Validate Programme
            </Button>
        </div>
    </div>
}

export default ProgrammeSummary;