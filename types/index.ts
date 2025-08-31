export type BlockId = "1a" | "1b" | "2a" | "2b"

export interface Course {
  id: string
  name: string
  credits: number
  code: string
  availableBlocks: readonly BlockId[]
  duration?: number
  link?: string
}

export interface CoursePackage {
  id: string
  name: string
  icon: string
  courses: string[]
}

export type Track = "Computing Science" | "Human-Computer Interaction" | "Software Engineering and Green IT"

export type Step = "intro" | "track-selection" | "course-planning"

export interface TrackInfo {
  title: string
  description: string
  color: string
}

export interface BlocksState {
  year1: { "1a": Course[]; "1b": Course[]; "2a": Course[]; "2b": Course[] }
  year2: { "1a": Course[]; "1b": Course[]; "2a": Course[]; "2b": Course[] }
}

export interface ImpossiblePlacement {
  show: boolean
  message: string
  x: number
  y: number
}

export interface CanPlaceResult {
  canPlace: boolean
  reason?: string
}
