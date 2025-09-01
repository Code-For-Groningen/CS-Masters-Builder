import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBlockOrder } from "@/data/courseUtils";
import { DragState } from "@/hooks/use-draggable-courses";
import { BlockId, BuiltProgramme, Course } from "@/types/types";
import { ExternalLink, XIcon } from "lucide-react";


// Drag and drop state
const getSubsequentBlocks = (startBlock: BlockId, duration: number): BlockId[] => {
    const blockOrder = getBlockOrder()
    const startIndex = blockOrder.indexOf(startBlock)
    const subsequentBlocks: BlockId[] = []

    for (let i = 1; i < duration && startIndex + i < blockOrder.length; i++) {
        subsequentBlocks.push(blockOrder[startIndex + i])
    }

    return subsequentBlocks
}

const isCourseInCorrectBlock = (course: Course, currentBlock: BlockId) => {
    return course.availableBlocks.includes(currentBlock)
}


function computeGhostCourses(currentProgramme: BuiltProgramme) {
    let newGhostCourses: Record<number, Record<BlockId, Course[]>> = {}

    for (const year in currentProgramme.courses) {
        const parsedYear = parseInt(year, 10)
        const courses = currentProgramme.courses[parsedYear]

        // Populate the ghost courses with empty arrays
        newGhostCourses[parsedYear] = {
            "1a": [],
            "1b": [],
            "2a": [],
            "2b": [],
        };

        getBlockOrder().forEach(block =>
            courses[block].forEach(course => {
                if (course.duration && course.duration > 1) {
                    const subsequentBlocks = getSubsequentBlocks(block, course.duration)
                    subsequentBlocks.forEach(ghostBlockId => {
                        newGhostCourses[parsedYear][ghostBlockId].push(course)
                    })
                }
            })
        );
    }

    return newGhostCourses;
};

function BlockList(props: {
    getCurrentCourses: () => Record<BlockId, Course[]>;
    setBuiltProgramme: (programme: BuiltProgramme) => void;
    currentProgramme: BuiltProgramme;
    selectedYear: number;

    dragState: DragState;
}) {
    const { getCurrentCourses, setBuiltProgramme, currentProgramme, selectedYear, dragState } = props;

    const { dragOverBlock, dropIndicatorIndex, handleDragOver, handleDragLeave, handleDrop, handleDragStart } = dragState;

    const removeCourseFromBlock = (courseCode: string, blockId: BlockId) => {
        setBuiltProgramme({
            ...currentProgramme,
            courses: {
                ...currentProgramme.courses,
                [selectedYear]: {
                    ...getCurrentCourses(),
                    [blockId]: getCurrentCourses()[blockId].filter((c) => c.code !== courseCode),
                }
            }
        });
    }

    return <>
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Academic Blocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getBlockOrder().map((blockId) => (
                <Card key={blockId} className="bg-white">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-base">Block {blockId.toUpperCase()}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                                {getCurrentCourses()[blockId].reduce((sum, course) => sum + course.credits, 0)} ECTS
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div
                            onDragOver={(e) => handleDragOver(e, blockId)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, blockId)}
                            className={`min-h-32 p-4 border-2 border-dashed rounded-lg bg-slate-50/50 space-y-2 transition-colors ${dragOverBlock === blockId ? "border-blue-400 bg-blue-50/50" : "border-slate-200"
                                }`}
                        >
                            {getCurrentCourses()[blockId].length === 0 && computeGhostCourses(currentProgramme)[selectedYear][blockId].length === 0 ? (
                                <div className="text-center text-slate-400 text-sm py-8">Drop courses here</div>
                            ) : (
                                <>
                                    {getCurrentCourses()[blockId].map((course, index) => (
                                        <div key={`${course.code}-${index}`}>
                                            {dragOverBlock === blockId && dropIndicatorIndex === index && (
                                                <div className="h-0.5 bg-blue-400 rounded-full mb-2 opacity-75" />
                                            )}
                                            <div
                                                draggable
                                                onDragStart={() => handleDragStart(course, blockId, index)}
                                                onDragOver={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    handleDragOver(e, blockId, index)
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    handleDrop(e, blockId, index)
                                                }}
                                                className={`p-3 bg-white rounded-lg border-2 border-dashed group hover:border-red-300 cursor-move hover:rotate-1 active:rotate-2 active:scale-105 transition-all ${!isCourseInCorrectBlock(course, blockId)
                                                    ? "border-red-300 bg-red-50"
                                                    : "border-slate-300"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start ">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="text-xs text-slate-500 font-mono">{course.code}</div>
                                                            <Badge
                                                                variant="secondary"
                                                                className={`text-xs ${!isCourseInCorrectBlock(course, blockId)
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-green-100 text-green-700"
                                                                    }`}
                                                            >
                                                                {course.duration && course.duration > 1 ? course.availableBlocks.join(", ").toUpperCase() : <>Block {course.availableBlocks.join(", ")}</>}

                                                            </Badge>
                                                            {course.duration && course.duration > 1 && (
                                                                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                                                                    {course.duration} blocks
                                                                </Badge>
                                                            )}
                                                            <Badge variant="outline" className="text-xs">
                                                                {course.credits} ECTS
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                                            {course.name}
                                                            {course.link && (
                                                                <a
                                                                    href={course.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => removeCourseFromBlock(course.code, blockId)}
                                                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-all"
                                                        >
                                                            <XIcon />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {dragOverBlock === blockId && dropIndicatorIndex === index + 1 && (
                                                <div className="h-0.5 bg-blue-400 rounded-full mt-2 opacity-75" />
                                            )}
                                        </div>
                                    ))}

                                    {computeGhostCourses(currentProgramme)[selectedYear][blockId].map((ghostCourse) => (
                                        <div
                                            key={ghostCourse.code}
                                            className="p-3 bg-slate-100 rounded-lg border-2 border-dashed border-slate-400 opacity-60 cursor-not-allowed"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="text-xs text-slate-500 font-mono">{ghostCourse.code}</div>
                                                        <Badge variant="secondary" className="text-xs bg-slate-200 text-slate-600">
                                                            Continuation
                                                        </Badge>
                                                    </div>
                                                    <div className="text-sm font-medium text-slate-600">{ghostCourse.name}</div>
                                                </div>
                                                <Badge variant="outline" className="text-xs text-slate-500 border-slate-400">
                                                    Ghost
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </>
}

export default BlockList;