import { BlockId, Course, Track } from "@/types"
import { coursePackages, trackPackageMapping } from "@/data/courseData"

export const getBlockOrder = (): BlockId[] => ["1a", "1b", "2a", "2b"]

export const formatAvailableBlocks = (blocks: readonly BlockId[]): string => {
  return blocks.join(", ").toUpperCase()
}

export const getSubsequentBlocks = (startBlock: BlockId, duration: number): BlockId[] => {
  const blockOrder = getBlockOrder()
  const startIndex = blockOrder.indexOf(startBlock)
  const subsequentBlocks: BlockId[] = []

  for (let i = 1; i < duration && startIndex + i < blockOrder.length; i++) {
    subsequentBlocks.push(blockOrder[startIndex + i])
  }

  return subsequentBlocks
}

export const getPackagesForTrack = (track: Track | null) => {
  if (!track) return []
  const packageIds = trackPackageMapping[track] || []
  return coursePackages.filter(pkg => packageIds.includes(pkg.id))
}

export const isCourseInCorrectBlock = (course: Course, blockId: BlockId): boolean => {
  return course.availableBlocks.includes(blockId)
}
