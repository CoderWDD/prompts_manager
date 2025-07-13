import { cn } from "@/lib/utils";
import { themeClasses } from "@/lib/theme";
import { forwardRef, TextareaHTMLAttributes } from "react";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        `w-full min-h-20 px-3 py-2 border rounded-md text-sm focus:outline-none disabled:opacity-50 ${themeClasses.border.default} ${themeClasses.bg.primaryForeground} ${themeClasses.text.primary} placeholder:${themeClasses.text.muted} ${themeClasses.focus.ring} ${themeClasses.focus.border}`,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
