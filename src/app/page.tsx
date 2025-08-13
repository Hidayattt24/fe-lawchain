import Image from "next/image";
import { Aurora } from "@/components";

export default function Home() {
  return (
    <div className="relative font-sans min-h-screen">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#4F1787", "#4F1787", "#4F1787"]}
        amplitude={1.0}
        blend={0.5}
        speed={1.0}
        intensity={1.0}
        className="z-0"
      />

      {/* Logo positioned at top left */}
      <div className="absolute top-8 left-8 z-20">
        <Image
          src="/logo-1.svg"
          alt="LawChain Logo"
          width={211}
          height={40}
          priority
          className="h-auto w-auto"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Welcome to LawChain
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Revolutionary blockchain technology for legal solutions
          </p>
          <div className="space-x-4">
            <button className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300">
              Get Started
            </button>
            <button className="px-8 py-3 border border-white/30 rounded-full text-white font-medium hover:bg-white/10 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
