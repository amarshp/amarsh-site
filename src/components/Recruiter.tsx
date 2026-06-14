"use client";

import { Section } from "./ui/section";
import { Button } from "./ui/button";
import { FaDownload, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Recruiter() {
    return (
        <Section className="bg-white text-black dark:bg-black dark:text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-zinc-100 dark:bg-zinc-900 p-12 rounded-3xl">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2 className="text-3xl font-light">For Recruiters</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        I bring a blend of strategic thinking, technical depth in AI/LLMs, and the discipline of an endurance athlete.
                        <br /><br />
                        Open to opportunities where I can build agentic systems that matter.
                    </p>
                    <div className="flex gap-4">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-2xl text-zinc-500 hover:text-[#0077b5] transition-colors"><FaLinkedin /></a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-2xl text-zinc-500 hover:text-black dark:hover:text-white transition-colors"><FaGithub /></a>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <a href="/resume.pdf" download="Amarsh_Resume.pdf">
                        <Button size="lg" className="rounded-full px-8 py-6 text-lg gap-3">
                            <FaDownload /> Download Resume
                        </Button>
                    </a>
                    <p className="text-xs text-zinc-500">Updated Jan 2026</p>
                </div>
            </div>
        </Section>
    );
}
