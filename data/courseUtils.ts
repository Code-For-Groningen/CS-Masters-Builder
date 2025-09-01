import { BlockId, Course, Track } from "@/types/types"
import { courseData } from "./data"

function getBlockOrder(): BlockId[] {
    return ["1a", "1b", "2a", "2b"]
}

function getPackagesForTrack(track: Track) {
    return courseData.packages.filter((pkg) => pkg.tracks.includes(track))
}

interface PlacementResult {
    canPlace: boolean;
    reason?: string;
};

function canPlaceCourse(course: Course, blockId: BlockId): PlacementResult {
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


export { getBlockOrder, getPackagesForTrack, canPlaceCourse }
export type { PlacementResult }