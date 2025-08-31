import { Course, CoursePackage, TrackInfo, Track } from "@/types"

export const trackInfo: Record<Track, TrackInfo> = {
  "Computing Science": {
    title: "Core Computer Science",
    description: "Algorithms, systems, and theoretical foundations",
    color: "bg-blue-100 text-blue-900 border-blue-200"
  },
  "Human-Computer Interaction": {
    title: "User Experience & Design",
    description: "Psychology, design, and human-centered computing",
    color: "bg-green-100 text-green-900 border-green-200"
  },
  "Software Engineering and Green IT": {
    title: "Sustainable Software Systems",
    description: "Engineering practices and environmental computing",
    color: "bg-purple-100 text-purple-900 border-purple-200"
  }
}

export const courseData = {
  courses: {
    cs501: {
      id: "cs501",
      name: "Advanced Algorithms",
      credits: 5,
      code: "CS501",
      availableBlocks: ["1a", "2a"] as const,
      link: "https://ocasys.rug.nl/current/catalog/course/WBCS001-05"
    },
    cs502: {
      id: "cs502",
      name: "Machine Learning",
      credits: 5,
      code: "CS502",
      availableBlocks: ["1b", "2b"] as const
    },
    cs503: {
      id: "cs503",
      name: "Distributed Systems",
      credits: 5,
      code: "CS503",
      availableBlocks: ["2a"] as const
    },
    hci401: {
      id: "hci401",
      name: "User Experience Design",
      credits: 5,
      code: "HCI401",
      availableBlocks: ["1a", "1b"] as const
    },
    hci402: {
      id: "hci402",
      name: "Human-Computer Interaction",
      credits: 5,
      code: "HCI402",
      availableBlocks: ["2a", "2b"] as const
    },
    se601: {
      id: "se601",
      name: "Software Architecture",
      credits: 5,
      code: "SE601",
      availableBlocks: ["1a"] as const
    },
    se602: {
      id: "se602",
      name: "Green Computing",
      credits: 5,
      code: "SE602",
      availableBlocks: ["1b", "2a"] as const
    },
    se603: {
      id: "se603",
      name: "DevOps and Automation",
      credits: 5,
      code: "SE603",
      availableBlocks: ["2b"] as const
    },
    math701: {
      id: "math701",
      name: "Advanced Statistics",
      credits: 5,
      code: "MATH701",
      availableBlocks: ["1a", "2a"] as const
    },
    proj801: {
      id: "proj801",
      name: "Master's Thesis Preparation",
      credits: 10,
      code: "PROJ801",
      availableBlocks: ["1a", "1b"] as const,
      duration: 2
    },
    sys703: {
      id: "sys703",
      name: "System Security",
      credits: 5,
      code: "SYS703",
      availableBlocks: ["2a", "2b"] as const
    }
  }
} as const

export const coursePackages: CoursePackage[] = [
  {
    id: "core-cs",
    name: "Core Computer Science",
    icon: "code",
    courses: ["cs501", "cs502", "cs503"]
  },
  {
    id: "hci",
    name: "Human-Computer Interaction",
    icon: "users",
    courses: ["hci401", "hci402"]
  },
  {
    id: "software-eng",
    name: "Software Engineering",
    icon: "settings",
    courses: ["se601", "se602", "se603"]
  },
  {
    id: "support",
    name: "Supporting Courses",
    icon: "book-open",
    courses: ["math701", "sys703"]
  },
  {
    id: "projects",
    name: "Projects & Thesis",
    icon: "graduation-cap",
    courses: ["proj801"]
  }
]

export const trackPackageMapping: Record<Track, string[]> = {
  "Computing Science": ["core-cs", "support", "projects"],
  "Human-Computer Interaction": ["hci", "core-cs", "support", "projects"],
  "Software Engineering and Green IT": ["software-eng", "core-cs", "support", "projects"]
}
