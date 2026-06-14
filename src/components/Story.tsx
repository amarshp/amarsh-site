"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/section";

export default function Story() {
    return (
        <Section className="bg-white text-black dark:bg-zinc-950 dark:text-zinc-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="text-4xl md:text-5xl font-light mb-8">
                        Grandmaster Strategy. <br />
                        <span className="text-rubik-blue font-semibold">Engineer Precision.</span>
                    </h3>
                    <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 mb-6">
                        I'm <span className="font-semibold text-black dark:text-white">Amarsh</span>, a 24-year-old AI Engineer based in Hyderabad.
                        My journey began at <span className="font-semibold">IIT Hyderabad</span> (BTech AI), where I first realized that code isn't just syntax—it's the nearest thing we have to magic.
                    </p>
                    <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 mb-6">
                        Currently, I serve as a <span className="font-semibold">Senior AI Engineer at OpenText</span>, architecting agentic systems that scale.
                        But my world isn't limited to LLMs and neural networks.
                    </p>
                    <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                        I believe in the symmetry of mind and body. The same discipline that solves a Rubik's cube in 15 seconds or debugs a complex pipeline is what drives me through the last mile of a marathon.
                        I build systems. I run miles. I explore ideas.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative aspect-square flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden"
                >
                    {/* Placeholder for personal image or abstract graphic */}
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-50 dark:from-zinc-800 dark:to-zinc-950 opacity-50" />
                    <div className="relative z-10 p-8 text-center">
                        <div className="text-6xl mb-4">♟️</div>
                        <p className="text-sm uppercase tracking-widest font-semibold text-zinc-500">The Strategist</p>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}
