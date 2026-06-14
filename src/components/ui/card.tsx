import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "bg-card text-card-foreground shadow-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black rounded-lg p-6",
                className
            )}
            {...props}
        />
    )
);
Card.displayName = "Card";

export { Card };
