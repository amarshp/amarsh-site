"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/section";

export default function Hero() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">
            {/* Abstract Chess Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full"
                />
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="absolute bottom-1/3 right-1/4 text-9xl font-serif opacity-10 select-none"
                >
                    ♔
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
                    className="absolute top-1/3 left-1/6 text-8xl font-serif opacity-10 select-none"
                >
                    ♞
                </motion.div>
            </div>

            <Section className="z-10 text-center flex flex-col items-center gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-sm md:text-base tracking-[0.2em] text-neutral-400 uppercase mb-4">
                        Amarsh
                    </h2>
                </motion.div>

                <motion.blockquote
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="max-w-4xl text-2xl md:text-4xl lg:text-5xl font-light leading-tight md:leading-snug"
                >
                    "My unmatched perspicacity coupled with my sheer indefatigability makes me a feared opponent in any realm of human endeavor."
                </motion.blockquote>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-12 flex flex-col items-center gap-2"
                >
                    <span className="text-sm text-neutral-500 uppercase tracking-widest">Scroll to Explore</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-px h-16 bg-gradient-to-b from-white to-transparent"
                    />
                </motion.div>
            </Section>
        </div>
    );
}
