import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
}

export function Section({ children, className, id }: SectionProps) {
    return (
        <section id={id} className={cn("py-20 md:py-32 px-6 w-full flex justify-center", className)}>
            <div className="w-full max-w-[1200px] relative">
                {children}
            </div>
        </section>
    );
}
