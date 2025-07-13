import { cn } from "@/lib/utils";
import { themeClasses } from "@/lib/theme";
import { forwardRef, HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: `border-transparent ${themeClasses.bg.primary} ${themeClasses.text.inverse} ${themeClasses.hover.primary}`,
      secondary: `border-transparent ${themeClasses.bg.secondary} ${themeClasses.text.primary} ${themeClasses.hover.secondary}`,
      destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
      outline: `${themeClasses.text.primary} ${themeClasses.border.default} ${themeClasses.hover.ghost}`,
    };

    return (
      <div
        ref={ref}
        className={cn(
          `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none cursor-pointer ${themeClasses.focus.ring}`,
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
