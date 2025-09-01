import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPackagesForTrack } from "@/data/courseUtils";
import { courseData } from "@/data/data";
import { Course, Track } from "@/types/types";
import { BookOpen, ExternalLink } from "lucide-react";
import { useState } from "react";
import FuzzySearch from 'fuzzy-search';


function PackageList(props: {
    selectedTrack: Track;
    handleDragStart: (course: Course) => void;
}) {
    const { selectedTrack, handleDragStart } = props;
    const [currentSearch, setCurrentSearch] = useState<string>("");

    const flattenedCourses = Object.values(courseData.courses);

    // Filtered courses
    const searcher = new FuzzySearch(flattenedCourses, ["name", "code"], { caseSensitive: false });
    const filteredCourses = currentSearch ? searcher.search(currentSearch) : flattenedCourses;

    return <>
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Packages
        </h2>

        <Input value={currentSearch} onChange={(e) => setCurrentSearch(e.target.value)} placeholder="Search packages..." />

        <div className="h-[50vh] overflow-y-scroll">
            {getPackagesForTrack(selectedTrack)
                // Only include packages with courses that match the search
                .filter((pkg) => pkg.courses.some((courseCode) => filteredCourses.some((course) => course.code === courseCode)))
                .map((pkg) => (
                    <Card key={pkg.name} className="bg-white transition-all duration-500 my-3">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                {pkg.icon}
                                {pkg.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {filteredCourses.filter((course) => pkg.courses.includes(course.code)).map((course) => {
                                if (!course) return null

                                return (
                                    <div
                                        key={course.code}
                                        draggable
                                        onDragStart={() => handleDragStart(course)}
                                        className="p-3 bg-slate-50 rounded-lg cursor-move hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:rotate-2 active:rotate-3 active:scale-105 transition-all duration-500"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="text-xs text-slate-500 font-mono">{course.code}</div>
                                                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                                        Block {course.availableBlocks.join(", ").toUpperCase()}
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
    </>
}

export default PackageList;
