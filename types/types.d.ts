// Course type

type Track = "SEDS" | "MLVC" | "AI Engineering";
type Step = "intro" | "track-selection" | "course-planning";

type BlockId = "1a" | "1b" | "2a" | "2b";

interface TrackInfo {
    name: string;
    description: string;
    color: string;
}

interface Course {
    name: string
    credits: number
    code: string
    availableBlocks: BlockId[]
    link: string
    duration?: number; // Duration in blocks, defaults to 1.
}

interface CoursePackage {
    name: string;
    courses: string[]; // Array of course codes
    icon: React.ReactNode;
    tracks: Track[];
}

interface CourseData {
    courses: { [key: string]: Course };
    packages: { [key: string]: CoursePackage };
}

interface BuiltProgramme {
    track?: Track;
    courses: {
        [year: number]: {
            [block in BlockId]: Course[];
        };
    };
}

export type { Track, Step, BlockId, Course, CoursePackage, CourseData, BuiltProgramme, TrackInfo };
