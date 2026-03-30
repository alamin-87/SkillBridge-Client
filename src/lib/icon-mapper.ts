import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

export const getIconComponent = (iconName: string): LucideIcon => {
    if (!iconName) {
        return Icons.HelpCircle;
    }

    // Capitalize the first letter just in case the backend sends lowercase like 'code' -> 'Code'
    const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    
    // Some icons might be pascal case, so we do our best match
    const IconComponent = Icons[formattedName as keyof typeof Icons] || Icons[iconName as keyof typeof Icons];

    if (!IconComponent) {
        return Icons.HelpCircle;
    }

    return IconComponent as LucideIcon;
};

// We will keep a small gradient generator based on string to preserve the premium UI
export const getGradientForString = (str: string): string => {
    if (!str) return "from-[#7c3aed] to-[#ec4899]";
    const lower = str.toLowerCase();
    
    if (lower.includes("math") || lower.includes("algebra")) return "from-[#ef4444] to-[#f97316]";
    if (lower.includes("code") || lower.includes("web") || lower.includes("tech")) return "from-[#3b82f6] to-[#06b6d4]";
    if (lower.includes("language") || lower.includes("english")) return "from-[#10b981] to-[#34d399]";
    if (lower.includes("business") || lower.includes("finance")) return "from-[#f59e0b] to-[#fbbf24]";
    if (lower.includes("science") || lower.includes("physics")) return "from-[#8b5cf6] to-[#c084fc]";
    if (lower.includes("art") || lower.includes("design")) return "from-[#ec4899] to-[#f472b6]";
    if (lower.includes("data") || lower.includes("analytics")) return "from-[#6366f1] to-[#818cf8]";
    if (lower.includes("health") || lower.includes("medical")) return "from-[#f43f5e] to-[#fb7185]";
    
    return "from-[#7c3aed] to-[#ec4899]";
};
