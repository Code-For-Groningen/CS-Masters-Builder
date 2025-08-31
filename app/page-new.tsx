"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Course, BlockId, Track, Step, BlocksState, ImpossiblePlacement, CanPlaceResult } from "@/types"
import { courseData } from "@/data/courseData"
import { getSubsequentBlocks, getBlockOrder, isCourseInCorrectBlock } from "@/utils/courseUtils"
import { CoursePackages } from "@/components/CoursePackages"
import { AcademicBlocks } from "@/components/AcademicBlocks"
import { TrackSelection } from "@/components/TrackSelection"
import { ImportDialog, ExportDialog } from "@/components/ImportExportDialogs"

export default function MSCValidationPage() {
  const [currentStep, setCurrentStep] = useState<Step>("intro")
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [selectedYear, setSelectedYear] = useState<1 | 2>(1)

  const [blocks, setBlocks] = useState<BlocksState>({
    year1: { "1a": [], "1b": [], "2a": [], "2b": [] },
    year2: { "1a": [], "1b": [], "2a": [], "2b": [] },
  })

  const [ghostCourses, setGhostCourses] = useState<BlocksState>({
    year1: { "1a": [], "1b": [], "2a": [], "2b": [] },
    year2: { "1a": [], "1b": [], "2a": [], "2b": [] },
  })

  // Drag and drop state
  const [draggedCourse, setDraggedCourse] = useState<Course | null>(null)
  const [dragOverBlock, setDragOverBlock] = useState<string | null>(null)
  const [draggedFromBlock, setDraggedFromBlock] = useState<keyof typeof blocks.year1 | null>(null)
  const [draggedFromYear, setDraggedFromYear] = useState<1 | 2 | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null)
  
  // Dialog state
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importJson, setImportJson] = useState("")
  const [importError, setImportError] = useState("")
  
  // UI feedback state
  const [impossiblePlacement, setImpossiblePlacement] = useState<ImpossiblePlacement>({
    show: false,
    message: "",
    x: 0,
    y: 0
  })

  // Helper functions
  const getCurrentBlocks = () => blocks[`year${selectedYear}` as keyof typeof blocks]
  const getCurrentGhostCourses = () => ghostCourses[`year${selectedYear}` as keyof typeof ghostCourses]

  const updateGhostCourses = (newBlocks: typeof blocks) => {
    const newGhostCourses = { ...ghostCourses }

    // Clear all ghost courses first
    Object.keys(newGhostCourses).forEach(year => {
      Object.keys(newGhostCourses[year as keyof typeof newGhostCourses]).forEach(blockId => {
        newGhostCourses[year as keyof typeof newGhostCourses][blockId as BlockId] = []
      })
    })

    // Add ghost courses for multi-block courses
    Object.entries(newBlocks).forEach(([year, yearBlocks]) => {
      Object.entries(yearBlocks).forEach(([blockId, blockCourses]) => {
        (blockCourses as Course[]).forEach(course => {
          if (course.duration && course.duration > 1) {
            const subsequentBlocks = getSubsequentBlocks(blockId as BlockId, course.duration)
            subsequentBlocks.forEach(ghostBlockId => {
              if (newGhostCourses[year as keyof typeof newGhostCourses][ghostBlockId]) {
                newGhostCourses[year as keyof typeof newGhostCourses][ghostBlockId].push(course)
              }
            })
          }
        })
      })
    })

    setGhostCourses(newGhostCourses)
  }

  const canPlaceCourse = (course: Course, blockId: BlockId): CanPlaceResult => {
    if (!course.availableBlocks.includes(blockId)) {
      return {
        canPlace: false,
        reason: `${course.name} is not available in block ${blockId.toUpperCase()}. Available in: ${course.availableBlocks.join(", ").toUpperCase()}`
      }
    }

    const duration = course.duration || 1
    if (duration > 1) {
      const subsequentBlocks = getSubsequentBlocks(blockId, duration)
      const blockOrder = getBlockOrder()
      const startIndex = blockOrder.indexOf(blockId)

      if (startIndex + duration > blockOrder.length) {
        const blocksNeeded = duration
        const blocksAvailable = blockOrder.length - startIndex
        return {
          canPlace: false,
          reason: `Cannot place ${blocksNeeded}-block course here. Only ${blocksAvailable} block${blocksAvailable === 1 ? "" : "s"} remaining.`,
        }
      }
    }

    return { canPlace: true }
  }

  // Drag and drop handlers
  const handleDragStart = (course: Course, fromBlock?: keyof typeof blocks["year1"], index?: number) => {
    setDraggedCourse(course)
    setDraggedFromBlock(fromBlock || null)
    setDraggedFromYear(selectedYear)
    setDraggedIndex(index || null)
  }

  const handleDragOver = (e: React.DragEvent, blockId?: keyof typeof blocks["year1"], index?: number) => {
    e.preventDefault()
    if (blockId) {
      setDragOverBlock(blockId)
      if (index !== undefined) {
        setDropIndicatorIndex(index)
      }

      if (draggedCourse) {
        const { canPlace, reason } = canPlaceCourse(draggedCourse, blockId)
        if (!canPlace && reason) {
          setImpossiblePlacement({
            show: true,
            message: reason,
            x: e.clientX,
            y: e.clientY - 50
          })
        } else {
          setImpossiblePlacement(prev => ({ ...prev, show: false }))
        }
      }
    }
  }

  const handleDragLeave = () => {
    setDragOverBlock(null)
    setDropIndicatorIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedCourse(null)
    setDraggedFromBlock(null)
    setDraggedFromYear(null)
    setDraggedIndex(null)
    setImpossiblePlacement(prev => ({ ...prev, show: false }))
  }

  const handleDrop = (e: React.DragEvent, blockId: keyof typeof blocks.year1, dropIndex?: number) => {
    e.preventDefault()
    setDragOverBlock(null)
    setDropIndicatorIndex(null)
    setImpossiblePlacement((prev) => ({ ...prev, show: false }))

    if (!draggedCourse) return

    const { canPlace } = canPlaceCourse(draggedCourse, blockId)
    if (!canPlace) {
      handleDragEnd()
      return
    }

    const duration = draggedCourse.duration || 1
    if (duration > 1) {
      const subsequentBlocks = getSubsequentBlocks(blockId, duration)
      const blockOrder = getBlockOrder()
      const startIndex = blockOrder.indexOf(blockId)

      if (startIndex + duration > blockOrder.length) {
        handleDragEnd()
        return
      }
    }

    const currentBlocks = getCurrentBlocks()
    const yearKey = `year${selectedYear}` as keyof typeof blocks

    if (draggedFromBlock) {
      if (draggedFromBlock === blockId && dropIndex !== undefined && draggedIndex !== null && draggedFromYear === selectedYear) {
        setBlocks((prev) => {
          const newCourses = [...currentBlocks[blockId]]
          const [movedCourse] = newCourses.splice(draggedIndex, 1)
          newCourses.splice(dropIndex, 0, movedCourse)
          const newBlocks = {
            ...prev,
            [yearKey]: {
              ...prev[yearKey],
              [blockId]: newCourses,
            }
          }
          updateGhostCourses(newBlocks)
          return newBlocks
        })
      } else if (draggedFromBlock !== blockId || draggedFromYear !== selectedYear) {
        setBlocks((prev) => {
          const sourceYearKey = `year${draggedFromYear}` as keyof typeof blocks
          const sourceBlock = prev[sourceYearKey][draggedFromBlock]
          if (!sourceBlock) {
            console.error(`Source block ${draggedFromBlock} not found in ${sourceYearKey}`)
            return prev
          }

          const newBlocks = {
            ...prev,
            [sourceYearKey]: {
              ...prev[sourceYearKey],
              [draggedFromBlock]: sourceBlock.filter((c) => c.id !== draggedCourse.id),
            },
            [yearKey]: {
              ...prev[yearKey],
              [blockId]: dropIndex !== undefined
                ? [...prev[yearKey][blockId].slice(0, dropIndex), draggedCourse, ...prev[yearKey][blockId].slice(dropIndex)]
                : [...prev[yearKey][blockId], draggedCourse]
            }
          }
          updateGhostCourses(newBlocks)
          return newBlocks
        })
      }
    } else {
      if (!currentBlocks[blockId].find((c) => c.id === draggedCourse.id)) {
        setBlocks((prev) => {
          const newBlocks = {
            ...prev,
            [yearKey]: {
              ...prev[yearKey],
              [blockId]: dropIndex !== undefined
                ? [...prev[yearKey][blockId].slice(0, dropIndex), draggedCourse, ...prev[yearKey][blockId].slice(dropIndex)]
                : [...prev[yearKey][blockId], draggedCourse],
            }
          }
          updateGhostCourses(newBlocks)
          return newBlocks
        })
      }
    }

    handleDragEnd()
  }

  const removeCourseFromBlock = (courseId: string, blockId: keyof typeof blocks.year1) => {
    const yearKey = `year${selectedYear}` as keyof typeof blocks
    setBlocks((prev) => {
      const newBlocks = {
        ...prev,
        [yearKey]: {
          ...prev[yearKey],
          [blockId]: prev[yearKey][blockId].filter((c) => c.id !== courseId),
        }
      }
      updateGhostCourses(newBlocks)
      return newBlocks
    })
  }

  // Import/Export functions
  const handleImportJson = () => {
    try {
      const data = JSON.parse(importJson)
      if (!data.track || !data.courses) {
        throw new Error("Invalid JSON format")
      }

      setSelectedTrack(data.track)

      const newBlocks = {
        year1: { "1a": [] as Course[], "1b": [] as Course[], "2a": [] as Course[], "2b": [] as Course[] },
        year2: { "1a": [] as Course[], "1b": [] as Course[], "2a": [] as Course[], "2b": [] as Course[] },
      }

      Object.entries(data.courses).forEach(([blockId, courseCodes]) => {
        if (blockId in newBlocks.year1 && Array.isArray(courseCodes)) {
          newBlocks.year1[blockId as keyof typeof newBlocks.year1] = courseCodes
            .map((code) => Object.values(courseData.courses).find((course) => course.code === code))
            .filter(Boolean) as Course[]
        }
      })

      setBlocks(newBlocks)
      setCurrentStep("course-planning")
      setImportDialogOpen(false)
      setImportJson("")
      setImportError("")
    } catch (error) {
      setImportError("Invalid JSON format. Please check your input.")
    }
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImportJson(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const exportToJson = () => {
    const exportData = {
      track: selectedTrack,
      courses: {
        year1: {
          block1a: blocks.year1["1a"].map(c => c.code),
          block1b: blocks.year1["1b"].map(c => c.code),
          block2a: blocks.year1["2a"].map(c => c.code),
          block2b: blocks.year1["2b"].map(c => c.code),
        },
        year2: {
          block1a: blocks.year2["1a"].map(c => c.code),
          block1b: blocks.year2["1b"].map(c => c.code),
          block2a: blocks.year2["2a"].map(c => c.code),
          block2b: blocks.year2["2b"].map(c => c.code),
        }
      }
    }
    return JSON.stringify(exportData, null, 2)
  }

  const exportToLegibleText = () => {
    let text = `MSc Programme Plan - ${selectedTrack}\n\n`

    text += "YEAR 1\n"
    text += "======\n\n"

    ;(["1a", "1b", "2a", "2b"] as const).forEach(blockId => {
      text += `Block ${blockId.toUpperCase()}:\n`
      if (blocks.year1[blockId].length === 0) {
        text += "  • No courses selected\n"
      } else {
        blocks.year1[blockId].forEach(course => {
          text += `  • ${course.code} - ${course.name} (${course.credits} ECTS)\n`
        })
      }
      text += "\n"
    })

    text += "YEAR 2\n"
    text += "======\n\n"

    ;(["1a", "1b", "2a", "2b"] as const).forEach(blockId => {
      text += `Block ${blockId.toUpperCase()}:\n`
      if (blocks.year2[blockId].length === 0) {
        text += "  • No courses selected\n"
      } else {
        blocks.year2[blockId].forEach(course => {
          text += `  • ${course.code} - ${course.name} (${course.credits} ECTS)\n`
        })
      }
      text += "\n"
    })

    const totalCredits = Object.values(blocks.year1).flat().reduce((sum, course) => sum + course.credits, 0) +
      Object.values(blocks.year2).flat().reduce((sum, course) => sum + course.credits, 0)

    text += `Total Credits: ${totalCredits} ECTS\n`

    return text
  }

  const downloadJsonFile = () => {
    const dataStr = exportToJson()
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `msc-programme-${selectedTrack?.replace(/\s+/g, '-').toLowerCase()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const downloadLegibleText = () => {
    const text = exportToLegibleText()
    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    const exportFileDefaultName = `msc-programme-${selectedTrack?.replace(/\s+/g, '-').toLowerCase()}.txt`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Intro step
  if (currentStep === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">MSc Programme Validator</h1>
            <p className="text-xl text-slate-600">
              Plan and validate your Master of Science programme structure
            </p>
          </div>

          <div className="space-y-4">
            <Button onClick={() => setCurrentStep("track-selection")} className="bg-blue-600 hover:bg-blue-700">
              Start Planning
            </Button>

            <ImportDialog
              open={importDialogOpen}
              onOpenChange={setImportDialogOpen}
              importJson={importJson}
              setImportJson={setImportJson}
              importError={importError}
              onFileImport={handleFileImport}
              onImportJson={handleImportJson}
            />
          </div>
        </div>
      </div>
    )
  }

  // Track selection step
  if (currentStep === "track-selection") {
    return (
      <TrackSelection
        selectedTrack={selectedTrack}
        onSelectTrack={setSelectedTrack}
        onContinue={() => setCurrentStep("course-planning")}
      />
    )
  }

  // Course planning step
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {impossiblePlacement.show && (
        <div
          className="absolute z-50 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg pointer-events-none"
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

            <div className="flex items-center gap-2">
              <ImportDialog
                open={importDialogOpen}
                onOpenChange={setImportDialogOpen}
                importJson={importJson}
                setImportJson={setImportJson}
                importError={importError}
                onFileImport={handleFileImport}
                onImportJson={handleImportJson}
              />

              <ExportDialog
                open={exportDialogOpen}
                onOpenChange={setExportDialogOpen}
                onCopyJson={() => {
                  navigator.clipboard.writeText(exportToJson())
                  setExportDialogOpen(false)
                }}
                onDownloadJson={() => {
                  downloadJsonFile()
                  setExportDialogOpen(false)
                }}
                onDownloadText={() => {
                  downloadLegibleText()
                  setExportDialogOpen(false)
                }}
                exportToJson={exportToJson}
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Course Planning</h1>
          <p className="text-slate-600">Drag courses from the packages below into your academic blocks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CoursePackages
            selectedTrack={selectedTrack}
            onDragStart={handleDragStart}
          />

          <AcademicBlocks
            currentBlocks={getCurrentBlocks()}
            currentGhostCourses={getCurrentGhostCourses()}
            dragOverBlock={dragOverBlock}
            dropIndicatorIndex={dropIndicatorIndex}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onRemoveCourse={removeCourseFromBlock}
          />
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-blue-900">Programme Summary</h3>
              <p className="text-sm text-blue-700">
                Total Credits:{" "}
                {Object.values(getCurrentBlocks())
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
      </div>
    </div>
  )
}
