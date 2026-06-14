"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/section";
import { FaRunning, FaGuitar, FaCube, FaPalette } from "react-icons/fa";

export default function BeyondCode() {
    return (
        <Section className="bg-white text-black dark:bg-black dark:text-white py-32">
            <div className="flex flex-col gap-20">
                <div className="text-center">
                    <h2 className="text-3xl md:text-5xl font-light mb-6">Beyond Code</h2>
                    <p className="max-w-xl mx-auto text-zinc-600 dark:text-zinc-400">
                        Discipline in one domain fuels excellence in another.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Running Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 flex flex-col items-center text-center gap-6 group"
                    >
                        <div className="text-6xl text-rubik-green opacity-80 group-hover:scale-110 transition-transform">
                            <FaRunning />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Endurance</h3>
                            <div className="text-4xl font-mono font-bold text-black dark:text-white mb-1">
                                42.2<span className="text-base text-zinc-500 font-sans font-normal ml-1">km</span>
                            </div>
                            <p className="text-sm text-zinc-500">Marathon Finisher</p>
                        </div>
                    </motion.div>

                    {/* Rubik's Cube Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 flex flex-col items-center text-center gap-6 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rubik-red via-rubik-yellow to-rubik-blue" />
                        <div className="text-6xl text-rubik-orange opacity-80 group-hover:rotate-90 transition-transform duration-700">
                            <FaCube />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Speedcubing</h3>
                            <div className="text-4xl font-mono font-bold text-black dark:text-white mb-1">
                                14.8<span className="text-base text-zinc-500 font-sans font-normal ml-1">s</span>
                            </div>
                            <p className="text-sm text-zinc-500">Personal Best</p>
                        </div>
                    </motion.div>

                    {/* Creative Arts Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 flex flex-col items-center text-center gap-6 group"
                    >
                        <div className="text-6xl text-rubik-red opacity-80 group-hover:scale-110 transition-transform">
                            <FaGuitar />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Expression</h3>
                            <div className="text-base text-zinc-600 dark:text-zinc-400 mb-1">
                                Guitar & Sketching
                            </div>
                            <p className="text-sm text-zinc-500">Creative Outlet</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
}
