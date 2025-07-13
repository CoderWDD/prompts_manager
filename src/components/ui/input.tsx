import { cn } from "@/lib/utils";
import { themeClasses } from "@/lib/theme";
import { forwardRef, InputHTMLAttributes } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `w-full h-10 px-3 py-2 border rounded-md text-sm focus:outline-none disabled:opacity-50 ${themeClasses.border.default} ${themeClasses.bg.primaryForeground} ${themeClasses.text.primary} placeholder:${themeClasses.text.muted} ${themeClasses.focus.ring} ${themeClasses.focus.border}`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };