import { canPlaceCourse, getBlockOrder } from "@/data/courseUtils"
import { BlockId, BuiltProgramme, Course } from "@/types/types"
import { useState } from "react"

interface ImpossiblePlacementResult {
    show: boolean
    message: string
    x: number
    y: number
}

interface DragState {
    handleDragStart: (course: Course, fromBlock?: BlockId, index?: number) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDragOver: (e: React.DragEvent, blockId: BlockId, index?: number) => void;
    handleDrop: (e: React.DragEvent, blockId: BlockId, dropIndex?: number) => void;

    // Dragging state
    dragOverBlock: BlockId | null;
    dropIndicatorIndex: number | null;
    impossiblePlacement: ImpossiblePlacementResult;
}


function useDraggableCourses(
    currentProgramme: BuiltProgramme,
    setBuiltProgramme: (programme: BuiltProgramme) => void,
    getCurrentCourses: () => { [key in BlockId]: Course[] },
    selectedYear: number,
): DragState {
    const [draggedCourse, setDraggedCourse] = useState<Course | null>(null)
    const [dragOverBlock, setDragOverBlock] = useState<BlockId | null>(null)
    const [draggedFromBlock, setDraggedFromBlock] = useState<BlockId | null>(null)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null)

    const [impossiblePlacement, setImpossiblePlacement] = useState<ImpossiblePlacementResult>({
        show: false, message: "", x: 0, y: 0,
    });


    const handleDragStart = (course: Course, fromBlock?: BlockId, index?: number) => {
        setDraggedCourse(course)
        setDraggedFromBlock(fromBlock || null)
        setDraggedIndex(index || null)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDragOverBlock(null)
            setDropIndicatorIndex(null)
            setImpossiblePlacement((prev) => ({ ...prev, show: false }))
        }
    }

    const handleDragOver = (e: React.DragEvent, blockId: BlockId, index?: number) => {
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

    const handleDragEnd = () => {
        setDraggedCourse(null)
        setDraggedFromBlock(null)
        setDraggedIndex(null)
        setImpossiblePlacement(prev => ({ ...prev, show: false }))
    }

    const handleDrop = (e: React.DragEvent, blockId: BlockId, dropIndex?: number) => {
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
            const blockOrder = getBlockOrder()
            const startIndex = blockOrder.indexOf(blockId)
            if (startIndex + duration > blockOrder.length) {
                handleDragEnd()
                return
            }
        }

        const currentCourses = currentProgramme.courses;
        const currentBlocks = getCurrentCourses();

        if (draggedFromBlock) {
            // Handle reordering within the same block
            if (draggedFromBlock === blockId && dropIndex !== undefined && draggedIndex !== null) {
                const currentBlock = [...currentBlocks[blockId]];
                const [movedCourse] = currentBlock.splice(draggedIndex, 1);
                currentBlock.splice(dropIndex, 0, movedCourse);

                const newCourses = {
                    ...currentCourses,
                    [selectedYear]: {
                        ...currentCourses[selectedYear],
                        [blockId]: currentBlock,
                    },
                };

                setBuiltProgramme({
                    ...currentProgramme,
                    courses: newCourses,
                });
            } else if (draggedFromBlock !== blockId) {
                const sourceBlock = currentBlocks[draggedFromBlock];
                const targetBlock = currentBlocks[blockId];

                // Remove course from source block
                const updatedSourceBlock = sourceBlock.filter((c) => c.code !== draggedCourse.code);

                // Add course to target block
                const updatedTargetBlock = [...targetBlock];
                if (dropIndex !== undefined) {
                    updatedTargetBlock.splice(dropIndex, 0, draggedCourse);
                } else {
                    updatedTargetBlock.push(draggedCourse);
                }

                const newCourses = {
                    ...currentCourses,
                    [selectedYear]: {
                        ...currentCourses[selectedYear],
                        [draggedFromBlock]: updatedSourceBlock,
                        [blockId]: updatedTargetBlock,
                    },
                };

                setBuiltProgramme({
                    ...currentProgramme,
                    courses: newCourses,
                });
            }
        } else {
            if (!currentBlocks[blockId].find((c) => c.code === draggedCourse.code)) {
                // Introduce a new course from the stack
                const newBlock = [...currentBlocks[blockId]]

                if (dropIndex !== undefined) {
                    newBlock.splice(dropIndex, 0, draggedCourse)
                } else {
                    newBlock.push(draggedCourse)
                }

                const newCourses = {
                    ...currentCourses,
                    [selectedYear]: {
                        ...currentCourses[selectedYear],
                        [blockId]: newBlock,
                    },
                };

                setBuiltProgramme({
                    ...currentProgramme,
                    courses: newCourses,
                });
            }
        }

        handleDragEnd()
    }

    return {
        // Functions
        handleDragStart,
        handleDragLeave,
        handleDragOver,
        handleDrop,

        // Dragging state
        dragOverBlock,
        dropIndicatorIndex,
        impossiblePlacement,
    }
}



export default useDraggableCourses;

export { type DragState }