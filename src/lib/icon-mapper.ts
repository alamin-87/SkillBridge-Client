import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, keyof typeof Icons> = {
    // Subject Specific Mappings
    "ict": "Computer",
    "ict-category": "Terminal",
    "biology": "Dna",
    "chemistry": "FlaskConical",
    "cemistry": "FlaskConical", // Case handling for typos from backend/user
    "physics": "Atom",
    "math": "Calculator",
    "high-math": "Sigma",
    "accounting": "TableProperties",
    "business": "Briefcase",
    "economics": "TrendingUp",
    "english": "Languages",
    "history": "BookOpen",
    "geography": "Globe",
    "social": "Users",
    "art": "Palette",
    "design": "Figma",
    "music": "Music",
    "programming": "Code2",
    "development": "Layout",
    "science": "Microscope",
    "health": "HeartPulse",
    "finance": "Coins",
};

export const getIconComponent = (iconName: string): LucideIcon => {
    if (!iconName) {
        return Icons.HelpCircle;
    }

    const lower = iconName.toLowerCase();
    
    // Check manual map first
    if (ICON_MAP[lower]) {
        return Icons[ICON_MAP[lower]] as LucideIcon;
    }

    // Try direct Lucide match (e.g. 'Code' -> 'Code', 'code' -> 'Code')
    const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const IconComponent = Icons[formattedName as keyof typeof Icons] || Icons[iconName as keyof typeof Icons];

    if (!IconComponent) {
        // More fuzzy matching
        if (lower.includes("code")) return Icons.Code2;
        if (lower.includes("book")) return Icons.BookOpen;
        if (lower.includes("math")) return Icons.Calculator;
        if (lower.includes("edit")) return Icons.Edit3;
        if (lower.includes("trash")) return Icons.Trash2;
        if (lower.includes("clock")) return Icons.Clock;
        if (lower.includes("check")) return Icons.CheckCircle2;

        return Icons.HelpCircle;
    }

    return IconComponent as LucideIcon;
};

// Gradient generator remains based on strings to maintain high-end aesthetic
export const getGradientForString = (str: string): string => {
    if (!str) return "from-[#7c3aed] to-[#6366f1]";
    const lower = str.toLowerCase();
    
    if (lower.includes("math") || lower.includes("high") || lower.includes("algebra")) return "from-[#ef4444] to-[#f97316]";
    if (lower.includes("code") || lower.includes("web") || lower.includes("tech") || lower.includes("ict")) return "from-[#3b82f6] to-[#06b6d4]";
    if (lower.includes("language") || lower.includes("english") || lower.includes("social")) return "from-[#10b981] to-[#34d399]";
    if (lower.includes("business") || lower.includes("finance") || lower.includes("accounting")) return "from-[#f59e0b] to-[#fbbf24]";
    if (lower.includes("science") || lower.includes("physics") || lower.includes("biology") || lower.includes("chemistry") || lower.includes("cemistry")) return "from-[#8b5cf6] to-[#c084fc]";
    if (lower.includes("art") || lower.includes("design")) return "from-[#ec4899] to-[#f472b6]";
    if (lower.includes("data") || lower.includes("analytics")) return "from-[#6366f1] to-[#818cf8]";
    if (lower.includes("health") || lower.includes("medical")) return "from-[#f43f5e] to-[#fb7185]";
    
    return "from-[#7c3aed] to-[#6366f1]";
};
