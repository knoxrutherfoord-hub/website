import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Academics } from "@/components/sections/Academics";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Academics />
      </main>
      <Footer />
    </>
  );
}
