import { cn } from "@/lib/utils";
import { themeClasses } from "@/lib/theme";
import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref
  ) => {
    const baseStyles = `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none ${themeClasses.focus.ring} disabled:opacity-50`;

    const variants = {
      default: `${themeClasses.bg.primary} ${themeClasses.text.inverse} ${themeClasses.hover.primary}`,
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: `border ${themeClasses.border.strong} ${themeClasses.hover.ghost} ${themeClasses.text.primary}`,
      secondary: `${themeClasses.bg.secondary} ${themeClasses.text.primary} ${themeClasses.hover.secondary}`,
      ghost: `${themeClasses.hover.ghost} ${themeClasses.text.primary}`,
      link: `${themeClasses.text.primary} hover:underline`,
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
