"use client";

import { Section } from "./ui/section";
import { Button } from "./ui/button";
import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        // Simulate submission
        setTimeout(() => {
            setStatus("success");
            setFormData({ name: "", email: "", message: "" });
        }, 1500);
    };

    return (
        <Section id="contact" className="bg-neutral-900 text-white dark:bg-black py-40">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-light mb-8">Let's build something together.</h2>
                <p className="text-neutral-400 mb-12">
                    Whether it's an enterprise agentic system or a deep conversation about AGI, I'm always open to connecting.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                required
                                className="w-full bg-neutral-800 border-none rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-rubik-blue"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="w-full bg-neutral-800 border-none rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-rubik-blue"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-neutral-400 mb-2">Message</label>
                        <textarea
                            id="message"
                            required
                            rows={4}
                            className="w-full bg-neutral-800 border-none rounded-md px-4 py-3 text-white focus:ring-2 focus:ring-rubik-blue"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={status !== "idle"}
                        className="self-center mt-4 w-full md:w-auto px-12 py-6 text-lg rounded-full"
                        variant="primary"
                    >
                        {status === "submitting" ? "Sending..." : status === "success" ? "Message Sent!" : <><FaPaperPlane className="mr-2" /> Send Message</>}
                    </Button>
                </form>

                <div className="mt-20 pt-10 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Amarsh. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </div>
        </Section>
    );
}
