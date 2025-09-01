import { Course, CoursePackage, Track, TrackInfo } from '@/types/types';
import { BarChart, Blocks, Bot, BrainCircuit, BrainIcon, Briefcase, Camera, Code, CodeIcon, Cpu, FlaskConical, GraduationCap, HeartIcon, Lock, Server } from 'lucide-react';


interface CourseData {
    courses: { [key: string]: Course },
    packages: CoursePackage[]
}

const courseData: CourseData = {
    courses: {
        "WMCS042-05": { "name": "Intelligent Mobile Perception in Practice", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS042-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS042-05" },
        "WMAI027-05": { "name": "Human-Robot Interaction for Social Robots", "credits": 5, "availableBlocks": ["2b"], "code": "WMAI027-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMAI027-05" },
        "WMAI037-05": { "name": "Control Methods for Robotics", "credits": 5, "availableBlocks": ["1a"], "code": "WMAI037-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMAI037-05" },
        "WMCS041-05": { "name": "Multimodal Mobile Sensing", "credits": 5, "availableBlocks": ["2a"], "code": "WMCS041-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS041-05" },
        "WMCS002-05": { "name": "Introduction to Data Science", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS002-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS002-05" },
        "WMCS040-05": { "name": "Robotic State Estimation", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS040-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS040-05" },
        "WMAI011-05": { "name": "Robotics for AI", "credits": 5, "availableBlocks": ["2a"], "code": "WMAI011-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMAI011-05" },
        "WMAI003-05": { "name": "Cognitive Robotics", "credits": 5, "availableBlocks": ["1b"], "code": "WMAI003-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMAI003-05" },
        "WMAI030-05": { "name": "Advanced Machine Learning", "credits": 5, "availableBlocks": ["1a"], "code": "WMAI030-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMAI030-05" },
        "WMCS010-05": { "name": "Neural Networks and Computational Intelligence", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS010-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS010-05" },
        "WMCS038-05": { "name": "Theory of Machine Learning", "credits": 5, "availableBlocks": ["2a"], "code": "WMCS038-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS038-05" },
        "WMCS039-05": { "name": "Machine Learning Systems Deployment and Operations", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS039-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS039-05" },
        "WMCS017-05": { "name": "Scalable Computing", "credits": 5, "availableBlocks": ["2a"], "code": "WMCS017-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS017-05" },
        "WMCS032-05": { "name": "Cloud Computing and Cloud-based Applications ", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS032-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS032-05" },
        "WMCC023-05": { "name": "Human-Centred Artificial Intelligence", "credits": 5, "availableBlocks": ["1a"], "code": "WMCC023-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCC023-05" },
        "WMAI017-05": { "name": "Deep Learning", "credits": 5, "availableBlocks": ["1b"], "code": "WMAI017-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMAI017-05" },
        "WMCS048-05": { "name": "Data Challenges in AI Systems", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS048-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS048-05" },
        "WMCS018-05": { "name": "Scientific Visualization", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS018-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS018-05" },
        "WMAI032-05": { "name": "Trustworthy and Explainable AI", "credits": 5, "availableBlocks": ["2a"], "code": "WMAI032-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMAI032-05" },
        "WMCS045-05": { "name": "Performance Engineering", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS045-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS045-05" },
        "WMCS044-05": { "name": "Advanced Distributed Systems", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS044-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS044-05" },
        "WMCS009-05": { "name": "Information Systems", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS009-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS009-05" },
        "WMCS007-05": { "name": "Enterprise Application Integration", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS007-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS007-05" },
        "WMCS015-05": { "name": "Computer Vision", "credits": 5, "availableBlocks": ["2a"], "code": "WMCS015-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS015-05" },
        "WMCS006-05": { "name": "Advanced Computer Graphics", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS006-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS006-05" },
        "WMCS035-05": { "name": "Geo-Visualization", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS035-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS035-05" },
        "WMCS029-05": { "name": "Perception for Visual Computing", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS029-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS029-05" },
        "WMCS033-05": { "name": "Programs and Interactive Proofs", "credits": 5, "availableBlocks": ["2a"], "code": "WMCS033-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS033-05" },
        "WMCS049-05": { "name": "Algorithms for Computationally Challenging Problems", "credits": 5, "availableBlocks": ["2a"], "code": "WMCS049-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS049-05" },
        "WMAI020-05": { "name": "Logical Aspects of Multi-agent Systems", "credits": 5, "availableBlocks": ["1b"], "code": "WMAI020-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMAI020-05" },
        "WMCS027-05": { "name": "Modal Logic and Proof Theory", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS027-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS027-05" },
        "WMCS026-05": { "name": "Models and Semantics of Computation", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS026-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS026-05" },
        "WMCS037-05": { "name": "Software Language Engineering", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS037-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS037-05" },
        "WMCS003-05": { "name": "Modelling and Simulation", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS003-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS003-05" },
        "WMCS011-05": { "name": "Pattern Recognition (for CS)", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS011-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS011-05" },
        "WMCS028-05": { "name": "Social Network Analysis", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS028-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS028-05" },
        "WMCS004-05": { "name": "Software Architecture", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS004-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS004-05" },
        "WMCS013-05": { "name": "Software Maintenance and Evolution", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS013-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS013-05" },
        "WMCS025-05": { "name": "Advanced Software Architecture", "credits": 5, "availableBlocks": ["2a"], "code": "WMCS025-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS025-05" },
        "WMCS024-05": { "name": "Evidence-Based Software Engineering", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS024-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS024-05" },
        "WMCS031-05": { "name": "Software Analytics", "credits": 5, "availableBlocks": ["2a"], "code": "WMCS031-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS031-05" },
        "WMCS030-05": { "name": "Ethical Hacking", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS030-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS030-05" },
        "WMCS051-05": { "name": " Kernel Engineering and Security", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS051-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS051-05" },
        "WMCS034-05": { "name": "Software and System Security", "credits": 5, "availableBlocks": ["2a"], "code": "WMCS034-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS034-05" },
        "WMCS001-05": { "name": "Advanced Topics in Security and Privacy", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS001-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS001-05" },
        "WMCS036-05": { "name": "Network Security Analytics\t", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS036-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS036-05" },
        "WMCS043-05": { "name": "Hardware Security", "credits": 5, "availableBlocks": ["1b"], "code": "WMCS043-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS043-05" },
        "WMCS050-05": { "name": "Embedded Systems", "credits": 5, "availableBlocks": ["1a"], "code": "WMCS050-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS050-05" },
        "WMCS046-05": { "name": "Emerging Computer Architectures", "credits": 5, "availableBlocks": ["2a"], "code": "WMCS046-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS046-05" },
        "WMCS021-15": { "name": "In-company or Research Internship (CS)", "credits": 15, "availableBlocks": ["2b"], "code": "WMCS021-15", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS021-15" },
        "WMCS019-05": { "name": "Student Colloquium (Computing Science)", "credits": 5, "availableBlocks": ["2a"], "code": "WMCS019-05", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS019-05" },
        "WMCS901-30": { "name": "Master Thesis", "credits": 30, "availableBlocks": ["2a"], "code": "WMCS901-30", "link": "https://ocasys.rug.nl/current/catalog/course/WMCS901-30", duration: 2 }
    },
    packages: [
        {
            "courses": ["WMCS042-05", "WMAI027-05", "WMAI037-05", "WMCS041-05", "WMCS002-05", "WMCS040-05", "WMAI011-05", "WMAI003-05"],
            "name": "Robotics",
            "tracks": ["AI Engineering"],
            "icon": <Bot />
        },
        {
            "courses": ["WMCS002-05", "WMAI030-05", "WMCS041-05", "WMCS040-05", "WMCS042-05", "WMCS010-05", "WMCS038-05"],
            "name": "Machine Learning Theory",
            "tracks": ["MLVC"],
            "icon": <BrainCircuit />
        },
        {
            "courses": ["WMCS039-05", "WMCS017-05", "WMCS032-05", "WMCC023-05", "WMAI017-05", "WMCS048-05", "WMCS002-05", "WMCS018-05", "WMAI032-05", "WMAI030-05"],
            "name": "Engineering of AI Systems",
            "tracks": ["AI Engineering"],
            "icon": <Blocks />
        },
        {
            "courses": ["WMCS017-05", "WMCS032-05", "WMCS045-05", "WMCS044-05", "WMCS009-05", "WMCS007-05"],
            "name": "Large-Scale Software Systems",
            "tracks": ["SEDS"],
            "icon": <Server />
        },
        {
            "courses": ["WMCS018-05", "WMCS015-05", "WMCS006-05", "WMCS035-05", "WMCS029-05"],
            "name": "Visual Computing",
            "tracks": ["MLVC"],
            "icon": <Camera />
        },
        {
            "courses": ["WMCS033-05", "WMCS049-05", "WMAI020-05", "WMCS027-05", "WMCS026-05", "WMCS037-05"],
            "name": "Theoretical Computing Science",
            "tracks": ["SEDS"],
            "icon": <FlaskConical />
        },
        {
            "courses": ["WMCS002-05", "WMCS003-05", "WMCS011-05", "WMCS028-05", "WMCS018-05"],
            "name": "Applied Data Science",
            "tracks": ["MLVC"],
            "icon": <BarChart />
        },
        {
            "courses": ["WMCS004-05", "WMCS013-05", "WMCS025-05", "WMCS024-05", "WMCS031-05", "WMCS032-05"],
            "name": "Software Engineering",
            "tracks": ["SEDS"],
            "icon": <Code />
        },
        {
            "courses": ["WMCS030-05", "WMCS051-05", "WMCS034-05", "WMCS001-05", "WMCS036-05", "WMCS043-05"],
            "name": "Cybersecurity",
            "tracks": ["SEDS"],
            "icon": <Lock />
        },
        {
            "courses": ["WMCS050-05", "WMCS043-05", "WMCS045-05", "WMCS051-05", "WMCS046-05"],
            "name": "Advanced Computer Architecture",
            "tracks": ["SEDS"],
            "icon": <Cpu />
        },
        {
            "courses": ["WMCS021-15", "WMCS019-05"],
            "name": "Internships",
            "tracks": ["SEDS", "MLVC", "AI Engineering"],
            "icon": <Briefcase />
        },
        {
            "courses": ["WMCS901-30"],
            "name": "Master Thesis",
            "tracks": ["SEDS", "MLVC", "AI Engineering"],
            "icon": <GraduationCap />
        }
    ],
};

const trackInfo = {
    SEDS: {
        name: "Software Engineering and Distributed Systems",
        description:
            "Focus on large-scale software systems, distributed computing, and modern software engineering practices.",
        color: "bg-blue-50 border-blue-200 text-blue-900",
    },
    MLVC: {
        name: "Machine Learning and Visual Computing",
        description: "Explore machine learning algorithms, computer vision, and visual computing technologies.",
        color: "bg-purple-50 border-purple-200 text-purple-900",
    },
    "AI Engineering": {
        name: "AI Engineering",
        description: "Build practical AI systems with focus on engineering robust, scalable AI applications.",
        color: "bg-red-50 border-red-200 text-red-900",
    },
} as { [key in Track]: TrackInfo };


function getTrackIcon(track: Track) {
    const trackIcons = {
        SEDS: <CodeIcon />,
        MLVC: <BrainIcon />,
        "AI Engineering": <HeartIcon />,
    };

    return trackIcons[track];
}




export { courseData, getTrackIcon, trackInfo };
