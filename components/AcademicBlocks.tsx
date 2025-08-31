import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { Course, BlockId, BlocksState } from "@/types"
import { formatAvailableBlocks, isCourseInCorrectBlock } from "@/utils/courseUtils"

interface AcademicBlocksProps {
  currentBlocks: BlocksState["year1"]
  currentGhostCourses: BlocksState["year1"]
  dragOverBlock: string | null
  dropIndicatorIndex: number | null
  onDragStart: (course: Course, blockId: BlockId, index: number) => void
  onDragOver: (e: React.DragEvent, blockId: BlockId, index?: number) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, blockId: BlockId, dropIndex?: number) => void
  onRemoveCourse: (courseId: string, blockId: BlockId) => void
}

export function AcademicBlocks({
  currentBlocks,
  currentGhostCourses,
  dragOverBlock,
  dropIndicatorIndex,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveCourse
}: AcademicBlocksProps) {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Academic Blocks</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(["1a", "1b", "2a", "2b"] as const).map((blockId) => (
          <Card key={blockId} className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Block {blockId.toUpperCase()}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {currentBlocks[blockId].reduce((sum, course) => sum + course.credits, 0)} ECTS
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={(e) => onDragOver(e, blockId)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, blockId)}
                className={`min-h-32 p-4 border-2 border-dashed rounded-lg bg-slate-50/50 space-y-2 transition-colors ${dragOverBlock === blockId ? "border-blue-400 bg-blue-50/50" : "border-slate-200"
                  }`}
              >
                {currentBlocks[blockId].length === 0 && currentGhostCourses[blockId].length === 0 ? (
                  <div className="text-center text-slate-400 text-sm py-8">Drop courses here</div>
                ) : (
                  <>
                    {currentBlocks[blockId].map((course, index) => (
                      <div key={`${course.id}-${index}`}>
                        {dragOverBlock === blockId && dropIndicatorIndex === index && (
                          <div className="h-0.5 bg-blue-400 rounded-full mb-2 opacity-75" />
                        )}
                        <div
                          draggable
                          onDragStart={() => onDragStart(course, blockId, index)}
                          onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onDragOver(e, blockId, index)
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onDrop(e, blockId, index)
                          }}
                          className={`p-3 bg-white rounded-lg border-2 border-dashed group hover:border-red-300 cursor-move hover:rotate-1 active:rotate-2 active:scale-105 transition-all ${!isCourseInCorrectBlock(course, blockId)
                              ? "border-red-300 bg-red-50"
                              : "border-slate-300"
                            }`}
                        >
                          <div className="flex justify-between items-start">
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
                                  Block {formatAvailableBlocks(course.availableBlocks)}
                                </Badge>
                                {course.duration && course.duration > 1 && (
                                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                                    {course.duration} blocks
                                  </Badge>
                                )}
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
                              <div className="text-sm font-medium text-slate-900">{course.name}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {course.credits} ECTS
                              </Badge>
                              <button
                                onClick={() => onRemoveCourse(course.id, blockId)}
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-all"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                        {dragOverBlock === blockId && dropIndicatorIndex === index + 1 && (
                          <div className="h-0.5 bg-blue-400 rounded-full mt-2 opacity-75" />
                        )}
                      </div>
                    ))}

                    {currentGhostCourses[blockId].map((ghostCourse) => (
                      <div
                        key={ghostCourse.id}
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
    </div>
  )
}
