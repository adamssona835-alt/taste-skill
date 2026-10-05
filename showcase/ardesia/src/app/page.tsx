import { Intro } from "@/components/Intro";
import { Hero } from "@/sections/Hero";
import { Statement } from "@/sections/Statement";
import { Philosophy } from "@/sections/Philosophy";
import { Services } from "@/sections/Services";
import { Featured } from "@/sections/Featured";
import { Projects } from "@/sections/Projects";
import { LightStudy } from "@/sections/LightStudy";
import { Coast } from "@/sections/Coast";
import { Numbers } from "@/sections/Numbers";
import { Testimonials } from "@/sections/Testimonials";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <Intro />
      <main id="main">
        <Hero />
        <Statement />
        <Philosophy />
        <Services />
        <Featured />
        <Projects />
        <LightStudy />
        <Coast />
        <Numbers />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
