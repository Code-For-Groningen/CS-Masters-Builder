"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  Cpu,
  Brain,
  Code,
  ExternalLink,
  Upload,
  Download,
  FileText,
} from "lucide-react"

type Track = "SEDS" | "MLVC" | "AI Engineering"
type Step = "intro" | "track-selection" | "course-planning"
type BlockId = "1a" | "1b" | "2a" | "2b"

interface Course {
  id: string
  name: string
  credits: number
  code: string
  availableBlocks: BlockId[]
  link?: string
  duration?: number // Duration in blocks, defaults to 1
}

interface CoursePackage {
  id: string
  name: string
  courses: string[] // Course IDs
  icon: string
  tracks: Track[]
}

const courseData = {
  courses: {
    cs501: {
      id: "cs501",
      name: "Advanced Algorithms",
      credits: 6,
      code: "CS501",
      availableBlocks: ["1a", "1b"] as BlockId[],
      link: "https://example.com/cs501",
    },
    cs502: {
      id: "cs502",
      name: "Software Architecture",
      credits: 6,
      code: "CS502",
      availableBlocks: ["1b"] as BlockId[],
    },
    cs503: {
      id: "cs503",
      name: "Database Systems",
      credits: 6,
      code: "CS503",
      availableBlocks: ["2a", "2b"] as BlockId[],
      link: "https://example.com/cs503",
    },
    thesis: {
      id: "thesis",
      name: "Master's Thesis",
      credits: 30,
      code: "THESIS",
      availableBlocks: ["1a", "2a"] as BlockId[],
      duration: 4, // Spans all 4 blocks
    },
    capstone: {
      id: "capstone",
      name: "Capstone Project",
      credits: 12,
      code: "CAP500",
      availableBlocks: ["2a"] as BlockId[],
      duration: 2, // Spans 2 blocks
    },
    ai601: { id: "ai601", name: "Machine Learning", credits: 6, code: "AI601", availableBlocks: ["1a"] as BlockId[] },
    ai602: {
      id: "ai602",
      name: "Deep Learning",
      credits: 6,
      code: "AI602",
      availableBlocks: ["1b", "2a"] as BlockId[],
      link: "https://example.com/ai602",
    },
    ai603: { id: "ai603", name: "Computer Vision", credits: 6, code: "AI603", availableBlocks: ["2a"] as BlockId[] },
    ai604: {
      id: "ai604",
      name: "Natural Language Processing",
      credits: 6,
      code: "AI604",
      availableBlocks: ["2b"] as BlockId[],
    },
    sys701: {
      id: "sys701",
      name: "Distributed Computing",
      credits: 6,
      code: "SYS701",
      availableBlocks: ["1a", "2a"] as BlockId[],
    },
    sys702: { id: "sys702", name: "Cloud Computing", credits: 6, code: "SYS702", availableBlocks: ["1b"] as BlockId[] },
    sys703: {
      id: "sys703",
      name: "Microservices",
      credits: 6,
      code: "SYS703",
      availableBlocks: ["2a", "2b"] as BlockId[],
      link: "https://example.com/sys703",
    },
  },
  packages: [
    {
      id: "core-cs",
      name: "Core Computer Science",
      icon: "Code",
      tracks: ["SEDS" as Track, "MLVC" as Track, "AI Engineering" as Track],
      courses: ["cs501", "cs502", "cs503"],
    },
    {
      id: "ai-ml",
      name: "AI & Machine Learning",
      icon: "Brain",
      tracks: ["MLVC" as Track, "AI Engineering" as Track],
      courses: ["ai601", "ai602", "ai603", "ai604"],
    },
    {
      id: "systems",
      name: "Distributed Systems",
      icon: "Cpu",
      tracks: ["SEDS" as Track],
      courses: ["sys701", "sys702", "sys703", "cs502"], // cs502 appears in multiple packages
    },
    {
      id: "thesis-capstone",
      name: "Thesis & Capstone",
      icon: "GraduationCap",
      tracks: ["SEDS" as Track, "MLVC" as Track, "AI Engineering" as Track],
      courses: ["thesis", "capstone"],
    },
  ],
}

const getIconComponent = (iconName: string) => {
  const icons = {
    Code: <Code className="w-5 h-5" />,
    Brain: <Brain className="w-5 h-5" />,
    Cpu: <Cpu className="w-5 h-5" />,
    GraduationCap: <GraduationCap className="w-5 h-5" />,
  }
  return icons[iconName as keyof typeof icons] || <BookOpen className="w-5 h-5" />
}

const trackInfo = {
  SEDS: {
    title: "Software Engineering and Distributed Systems",
    description:
      "Focus on large-scale software systems, distributed computing, and modern software engineering practices.",
    color: "bg-blue-50 border-blue-200 text-blue-900",
  },
  MLVC: {
    title: "Machine Learning and Visual Computing",
    description: "Explore machine learning algorithms, computer vision, and visual computing technologies.",
    color: "bg-emerald-50 border-emerald-200 text-emerald-900",
  },
  "AI Engineering": {
    title: "AI Engineering",
    description: "Build practical AI systems with focus on engineering robust, scalable AI applications.",
    color: "bg-purple-50 border-purple-200 text-purple-900",
  },
}

export default function MSCValidationPage() {
  const [currentStep, setCurrentStep] = useState<Step>("intro")
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)

  const [selectedYear, setSelectedYear] = useState<1 | 2>(1)


  const [blocks, setBlocks] = useState<{
    year1: { "1a": Course[]; "1b": Course[]; "2a": Course[]; "2b": Course[] }
    year2: { "1a": Course[]; "1b": Course[]; "2a": Course[]; "2b": Course[] }
  }>({
    year1: { "1a": [], "1b": [], "2a": [], "2b": [] },
    year2: { "1a": [], "1b": [], "2a": [], "2b": [] },
  })

  const [ghostCourses, setGhostCourses] = useState<{
    year1: { "1a": Course[]; "1b": Course[]; "2a": Course[]; "2b": Course[] }
    year2: { "1a": Course[]; "1b": Course[]; "2a": Course[]; "2b": Course[] }
  }>({
    year1: { "1a": [], "1b": [], "2a": [], "2b": [] },
    year2: { "1a": [], "1b": [], "2a": [], "2b": [] },
  })


  const [draggedCourse, setDraggedCourse] = useState<Course | null>(null)
  const [dragOverBlock, setDragOverBlock] = useState<string | null>(null)
  const [draggedFromBlock, setDraggedFromBlock] = useState<keyof typeof blocks.year1 | null>(null)
  const [draggedFromYear, setDraggedFromYear] = useState<1 | 2 | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importJson, setImportJson] = useState("")
  const [importError, setImportError] = useState("")
  const [impossiblePlacement, setImpossiblePlacement] = useState<{
    show: boolean
    message: string
    x: number
    y: number
  }>({
    show: false,
    message: "",
    x: 0,
    y: 0,
  })

  const getPackagesForTrack = (track: Track | null) => {
    if (!track) return []
    return courseData.packages.filter((pkg) => pkg.tracks.includes(track))
  }

  const canPlaceCourse = (course: Course, blockId: BlockId): { canPlace: boolean; reason?: string } => {
    const duration = course.duration || 1
    if (duration === 1) return { canPlace: true }

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

    return { canPlace: true }
  }

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
            y: e.clientY - 80,
          })
        } else {
          setImpossiblePlacement((prev) => ({ ...prev, show: false }))
        }
      }
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverBlock(null)
      setDropIndicatorIndex(null)
      setImpossiblePlacement((prev) => ({ ...prev, show: false }))
    }
  }

  const getBlockOrder = (): BlockId[] => ["1a", "1b", "2a", "2b"]

  const getSubsequentBlocks = (startBlock: BlockId, duration: number): BlockId[] => {
    const blockOrder = getBlockOrder()
    const startIndex = blockOrder.indexOf(startBlock)
    const subsequentBlocks: BlockId[] = []

    for (let i = 1; i < duration && startIndex + i < blockOrder.length; i++) {
      subsequentBlocks.push(blockOrder[startIndex + i])
    }

    return subsequentBlocks
  }

  const getCurrentBlocks = () => blocks[`year${selectedYear}`]
  const getCurrentGhostCourses = () => ghostCourses[`year${selectedYear}`]

  const updateGhostCourses = (newBlocks: typeof blocks) => {
    const newGhostCourses = { ...ghostCourses }

    // Clear all ghost courses first
    Object.keys(newGhostCourses).forEach(year => {
      Object.keys(newGhostCourses[year as keyof typeof newGhostCourses]).forEach(blockId => {
        newGhostCourses[year as keyof typeof newGhostCourses][blockId as BlockId] = []
      })
    })

    // Add ghost courses for multi-block courses
    Object.keys(newBlocks).forEach(year => {
      Object.entries(newBlocks[year as keyof typeof newBlocks]).forEach(([blockId, courses]) => {
        courses.forEach(course => {
          if (course.duration && course.duration > 1) {
            const subsequentBlocks = getSubsequentBlocks(blockId as BlockId, course.duration)
            subsequentBlocks.forEach(ghostBlockId => {
              const ghostCourse = { ...course, isGhost: true, originalBlock: blockId as BlockId }
              newGhostCourses[year as keyof typeof newGhostCourses][ghostBlockId].push(ghostCourse)
            })
          }
        })
      })
    })

    setGhostCourses(newGhostCourses)
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
        const content = e.target?.result as string
        setImportJson(content)
      }
      reader.readAsText(file)
    }
  }

  const exportToJson = () => {
    const exportData = {
      track: selectedTrack,
      year1: {
        courses: {
          block1a: blocks.year1["1a"].map(c => c.code),
          block1b: blocks.year1["1b"].map(c => c.code),
          block2a: blocks.year1["2a"].map(c => c.code),
          block2b: blocks.year1["2b"].map(c => c.code),
        }
      },
      year2: {
        courses: {
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

      ; (["1a", "1b", "2a", "2b"] as const).forEach(blockId => {
        text += `Block ${blockId.toUpperCase()}:\n`
        if (blocks.year1[blockId].length === 0) {
          text += "  • No courses selected\n"
        } else {
          blocks.year1[blockId].forEach(course => {
            text += `  • ${course.code} - ${course.name} (${course.credits} ECTS)\n`
          })
        }
        text += `  Total: ${getCurrentBlocks()[blockId].reduce((sum, course) => sum + course.credits, 0)} ECTS\n\n`
      })

    text += "YEAR 2\n"
    text += "======\n\n"

      ; (["1a", "1b", "2a", "2b"] as const).forEach(blockId => {
        text += `Block ${blockId.toUpperCase()}:\n`
        if (blocks.year2[blockId].length === 0) {
          text += "  • No courses selected\n"
        } else {
          blocks.year2[blockId].forEach(course => {
            text += `  • ${course.code} - ${course.name} (${course.credits} ECTS)\n`
          })
        }
        const year2Credits = blocks.year2[blockId].reduce((sum, course) => sum + course.credits, 0)
        text += `  Total: ${year2Credits} ECTS\n\n`
      })

    return text
  }

  const downloadJsonFile = () => {
    const jsonData = exportToJson()
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `msc-programme-${selectedTrack?.toLowerCase().replace(/\s+/g, "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadLegibleText = () => {
    const textData = exportToLegibleText()
    const blob = new Blob([textData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `msc-programme-${selectedTrack?.toLowerCase().replace(/\s+/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const isCourseInCorrectBlock = (course: Course, currentBlock: BlockId) => {
    return course.availableBlocks.includes(currentBlock)
  }

  const formatAvailableBlocks = (blocks: BlockId[]) => {
    return blocks.map((block) => block.toUpperCase()).join(", ")
  }

  if (currentStep === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
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
              onClick={() => setCurrentStep("track-selection")}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

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
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "track-selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
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
                  <CardDescription className="font-medium text-slate-900">{trackInfo[track].title}</CardDescription>
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
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
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

            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-slate-700 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Export Programme</DialogTitle>
                  <DialogDescription>Export your programme configuration in different formats.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid gap-3">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(exportToJson())
                        setExportDialogOpen(false)
                      }}
                      variant="outline"
                      className="justify-start"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Copy JSON to Clipboard
                    </Button>

                    <Button
                      onClick={() => {
                        downloadJsonFile()
                        setExportDialogOpen(false)
                      }}
                      variant="outline"
                      className="justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download JSON File
                    </Button>

                    <Button
                      onClick={() => {
                        downloadLegibleText()
                        setExportDialogOpen(false)
                      }}
                      variant="outline"
                      className="justify-start"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Download Legible Text
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>JSON Preview</Label>
                    <Textarea value={exportToJson()} readOnly className="min-h-32 font-mono text-sm bg-slate-50" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Course Planning</h1>
          <p className="text-slate-600">Drag courses from the packages below into your academic blocks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Packages */}
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
                        onDragStart={() => handleDragStart(course)}
                        className="p-3 bg-slate-50 rounded-lg cursor-move hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:rotate-2 active:rotate-3 active:scale-105 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-xs text-slate-500 font-mono">{course.code}</div>
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                Block {formatAvailableBlocks(course.availableBlocks)}
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

          {/* Academic Blocks */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Academic Blocks</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(["1a", "1b", "2a", "2b"] as const).map((blockId) => (
                <Card key={blockId} className="bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Block {blockId.toUpperCase()}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {getCurrentBlocks()[blockId].reduce((sum, course) => sum + course.credits, 0)} ECTS
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
                      {getCurrentBlocks()[blockId].length === 0 && getCurrentGhostCourses()[blockId].length === 0 ? (
                        <div className="text-center text-slate-400 text-sm py-8">Drop courses here</div>
                      ) : (
                        <>
                          {getCurrentBlocks()[blockId].map((course, index) => (
                            <div key={`${course.id}-${index}`}>
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
                                      onClick={() => removeCourseFromBlock(course.id, blockId)}
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

                          {getCurrentGhostCourses()[blockId].map((ghostCourse) => (
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
      </div>
    </div>
  )
}

