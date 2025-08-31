import { Code, Users, Settings, BookOpen, GraduationCap } from "lucide-react"

export const getIconComponent = (iconName: string) => {
  const icons = {
    code: Code,
    users: Users,
    settings: Settings,
    "book-open": BookOpen,
    "graduation-cap": GraduationCap,
  }
  
  const IconComponent = icons[iconName as keyof typeof icons]
  return IconComponent ? <IconComponent className="w-4 h-4" /> : null
}
