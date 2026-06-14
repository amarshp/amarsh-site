"use client";

import { motion } from "framer-motion";
import { Section } from "./ui/section";
import { Card } from "./ui/card";
import { FaPython, FaAws, FaBrain, FaCogs } from "react-icons/fa";
import { SiPytorch, SiOpenai, SiLangchain, SiCplusplus, SiNextdotjs } from "react-icons/si";

export default function Work() {
    const skills = [
        { name: "Python", icon: FaPython },
        { name: "C++", icon: SiCplusplus },
        { name: "PyTorch", icon: SiPytorch },
        { name: "LangChain", icon: SiLangchain },
        { name: "OpenAI", icon: SiOpenai },
        { name: "AWS", icon: FaAws },
        { name: "Next.js", icon: SiNextdotjs },
    ];

    return (
        <Section id="work" className="bg-zinc-50 dark:bg-black">
            <div className="flex flex-col gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center md:text-left"
                >
                    <h2 className="text-3xl md:text-4xl font-light mb-4 text-black dark:text-white">What I Build</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
                        From enterprise-scale agentic systems to high-performance ML pipelines.
                        I bridge the gap between research and production.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-8 border-l-4 border-l-rubik-blue relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FaCogs className="text-8xl" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">Enterprise AI Agents</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            Architecting global AI agent systems at <span className="font-semibold text-black dark:text-white">OpenText</span>.
                            Integrating LLMs into ALM, UFT, and BPM tools to automate complex enterprise workflows.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded text-xs font-medium text-zinc-600 dark:text-zinc-400">LangGraph</span>
                            <span className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded text-xs font-medium text-zinc-600 dark:text-zinc-400">AutoGen</span>
                        </div>
                    </Card>

                    <Card className="p-8 border-l-4 border-l-rubik-red relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FaBrain className="text-8xl" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">Intelligent Systems</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            Building scalable LLM-powered applications using proprietary and open-source models.
                            Focusing on RAG, function calling, and multi-agent orchestration.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded text-xs font-medium text-zinc-600 dark:text-zinc-400">RAG</span>
                            <span className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded text-xs font-medium text-zinc-600 dark:text-zinc-400">VectorDB</span>
                        </div>
                    </Card>
                </div>

                <div className="mt-12">
                    <h3 className="text-lg uppercase tracking-widest text-zinc-500 mb-8 text-center md:text-left">Tech Stack</h3>
                    <div className="flex flex-wrap md:justify-start justify-center gap-8">
                        {skills.map((skill) => (
                            <motion.div
                                key={skill.name}
                                whileHover={{ scale: 1.1, color: "#0045AD" }}
                                className="flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-600 hover:text-rubik-blue transition-colors cursor-pointer"
                            >
                                <skill.icon className="text-4xl" />
                                <span className="text-xs font-medium">{skill.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}
