import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, BookOpen } from "lucide-react"
import { Course, Track, BlockId } from "@/types"
import { courseData } from "@/data/courseData"
import { getIconComponent } from "@/utils/iconUtils"
import { getPackagesForTrack, formatAvailableBlocks } from "@/utils/courseUtils"

interface CoursePackagesProps {
  selectedTrack: Track | null
  onDragStart: (course: Course) => void
}

export function CoursePackages({ selectedTrack, onDragStart }: CoursePackagesProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Course Packages
      </h2>

      {getPackagesForTrack(selectedTrack).map((pkg) => (
        <Card key={pkg.id} className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {getIconComponent(pkg.icon)}
              {pkg.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pkg.courses.map((courseId) => {
              const course = courseData.courses[courseId as keyof typeof courseData.courses]
              if (!course) return null

              return (
                <div
                  key={course.id}
                  draggable
                  onDragStart={() => onDragStart(course as Course)}
                  className="p-3 bg-slate-50 rounded-lg cursor-move hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:rotate-2 active:rotate-3 active:scale-105 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xs text-slate-500 font-mono">{course.code}</div>
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          Block {formatAvailableBlocks(course.availableBlocks as readonly BlockId[])}
                        </Badge>
                        {(course as any).duration && (course as any).duration > 1 && (
                          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                            {(course as any).duration} blocks
                          </Badge>
                        )}
                        {(course as any).link && (
                          <a
                            href={(course as any).link}
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
                    <Badge variant="outline" className="text-xs ml-2">
                      {course.credits} ECTS
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
