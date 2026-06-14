"use client";

import { Section } from "./ui/section";
import { Card } from "./ui/card";
import { FaMedium, FaYoutube, FaInstagram, FaMicrophone } from "react-icons/fa";

export default function Content() {
    const platforms = [
        { name: "Medium", icon: FaMedium, desc: "Deep dives into LLMs", link: "#" },
        { name: "YouTube", icon: FaYoutube, desc: "Tech tutorials & vlogs", link: "#" },
        { name: "Instagram", icon: FaInstagram, desc: "Visual storytelling", link: "#" },
        { name: "Podcast", icon: FaMicrophone, desc: "Coming soon", link: "#" },
    ];

    return (
        <Section className="bg-zinc-50 dark:bg-zinc-950">
            <div className="flex flex-col gap-12">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-light mb-4 text-black dark:text-white">Content & Ideas</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">Where I share my mental models.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {platforms.map((p) => (
                        <Card key={p.name} className="flex flex-col items-center justify-center p-6 gap-4 hover:border-black dark:hover:border-white transition-colors cursor-pointer group">
                            <p.icon className="text-4xl text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                            <div className="text-center">
                                <h3 className="font-medium">{p.name}</h3>
                                <p className="text-xs text-zinc-500">{p.desc}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </Section>
    );
}
