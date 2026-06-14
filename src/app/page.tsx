import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Work from "@/components/Work";
import BeyondCode from "@/components/BeyondCode";
import Content from "@/components/Content";
import Recruiter from "@/components/Recruiter";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white">
      <Hero />
      <Story />
      <Work />
      <BeyondCode />
      <Content />
      <Recruiter />
      <Contact />
    </main>
  );
}
