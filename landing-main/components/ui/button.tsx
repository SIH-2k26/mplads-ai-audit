import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E0E0E] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#9FE870] text-[#0E0E0E] hover:bg-[#8EE05C] active:bg-[#82cc52] shadow-subtle border border-[#8EE05C]/20",
        secondary:
          "bg-[#EAE8E2] text-[#0E0E0E] hover:bg-[#DDDCD5] active:bg-[#CFCEC7]",
        dark:
          "bg-[#0E0E0E] text-white hover:bg-[#262626] active:bg-[#1a1a1a] shadow-subtle",
        outline:
          "border border-[#E5E3DC] bg-white text-[#0E0E0E] hover:bg-[#EAE8E2]",
        critical:
          "bg-[#B44343] text-white hover:bg-[#993939] active:bg-[#803030] shadow-subtle border border-[#993939]/20",
        saffron:
          "bg-[#9FE870] text-[#0E0E0E] hover:bg-[#8EE05C] active:bg-[#82cc52] shadow-subtle border border-[#8EE05C]/20",
        ghost:
          "text-[#0E0E0E] hover:bg-[#EAE8E2]/60",
        link:
          "text-[#6B6B6B] hover:text-[#0E0E0E] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
