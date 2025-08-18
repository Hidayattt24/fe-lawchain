"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FloatingDock,
  ThemeToggle,
  AnimatedCardsContainer,
  HyperSpeed,
} from "@/components";
import { IconHome, IconApps, IconQuestionMark } from "@tabler/icons-react";
import { useTheme } from "@/contexts/ThemeContext";

const HomeContent = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const handleNavigateToChatbot = () => {
    router.push("/chatbot");
  };

  const dockItems = [
    {
      title: "Beranda",
      icon: (
        <IconHome
          className={`h-full w-full ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        />
      ),
      href: "#beranda",
    },
    {
      title: "Fitur",
      icon: (
        <IconApps
          className={`h-full w-full ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        />
      ),
      href: "#fitur",
    },
    {
      title: "Mengapa Kami",
      icon: (
        <IconQuestionMark
          className={`h-full w-full ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        />
      ),
      href: "#mengapa-kami",
    },
  ];

  return (
    <div
      className={`relative font-sans min-h-screen scroll-smooth transition-colors duration-300 ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      {/* HyperSpeed Background - Full Screen */}
      <div className="fixed inset-0 z-0" style={{ opacity: 0.4 }}>
        <HyperSpeed
          effectOptions={{
            speedUp: 1.5,
            fov: 85,
            fovSpeedUp: 120,
          }}
          colors={{
            roadColor: theme === "dark" ? 0x1a1a2e : 0xf0f0f0,
            islandColor: theme === "dark" ? 0x16213e : 0xe0e0e0,
            background: theme === "dark" ? 0x0f0f23 : 0xffffff,
            shoulderLines: theme === "dark" ? 0x4f1787 : 0x6366f1,
            brokenLines: theme === "dark" ? 0x4f1787 : 0x6366f1,
            leftCars:
              theme === "dark"
                ? [0x4f1787, 0x6750a2, 0xc247ac]
                : [0x8b5cf6, 0xa855f7, 0xc084fc],
            rightCars:
              theme === "dark"
                ? [0x03b3c3, 0x0e5ea5, 0x324555]
                : [0x06b6d4, 0x0284c7, 0x0369a1],
            sticks: theme === "dark" ? 0x4f1787 : 0x8b5cf6,
          }}
        />
      </div>
      {/* Theme Toggle */}
      <div className="relative z-20">
        <ThemeToggle />
      </div>

      {/* Floating Dock */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <FloatingDock
          items={dockItems}
          desktopClassName={`${
            theme === "dark"
              ? "bg-[#4F1787]/20 backdrop-blur-md border border-[#4F1787]/30 shadow-lg shadow-[#4F1787]/20"
              : "bg-white/20 backdrop-blur-md border border-gray-300 shadow-lg"
          }`}
          mobileClassName={`${
            theme === "dark"
              ? "bg-[#4F1787]/20 backdrop-blur-md border border-[#4F1787]/30"
              : "bg-white/20 backdrop-blur-md border border-gray-300"
          }`}
        />
      </div>

      {/* Main content - Beranda Section */}
      <section
        id="beranda"
        className="relative z-10 flex items-center justify-center min-h-screen px-8"
      >
        <div className="text-center max-w-6xl relative z-10">
          {/* Logo Above Title */}
          <div className="mb-12 flex justify-center">
            <Image
              src={theme === "dark" ? "/logo/logo.svg" : "/logo/logo-2.svg"}
              alt="LawChain Logo"
              width={150}
              height={60}
              priority
              className="h-auto w-auto filter drop-shadow-lg"
            />
          </div>

          {/* Main Title */}
          <div className="mb-8 text-center">
            <div className="justify-center">
              <h1
                className={`${
                  theme === "dark" ? "text-white" : "text-black"
                } poppins-semibold text-6xl leading-normal justify-center`}
              >
                Satu Klik,
              </h1>
            </div>
            <div className="flex justify-center">
              <h1
                className={`${
                  theme === "dark" ? "text-white" : "text-black"
                } poppins-semibold text-6xl leading-normal`}
              >
                Pahami Hukum.
              </h1>
            </div>
          </div>

          {/* Description */}
          <div className="mb-12 max-w-5xl mx-auto text-center">
            <p
              className={`${
                theme === "dark" ? "text-white" : "text-black"
              } poppins-medium text-2xl leading-normal justify-center`}
            >
              Tanya apa saja seputar UUD 1945 dan dapatkan jawaban yang akurat.
              LawChain memanfaatkan RAG, LLaMA3, dan Ollama untuk memberikan
              informasi hukum yang cepat, jelas, dan dapat dipercaya.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={handleNavigateToChatbot}
              className="w-64 h-14 bg-[#4F1787] text-white poppins-medium rounded-full hover:bg-[#3e125c] transition-colors duration-300"
            >
              Mulai Sekarang
            </button>
            <button
              onClick={handleNavigateToChatbot}
              className="w-24 h-14 bg-[#4F1787] rounded-full flex items-center justify-center hover:bg-[#3e125c] transition-colors duration-300"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Fitur Section */}
      <section id="fitur" className="relative z-10 py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Fitur Image */}
          <div className="flex justify-center">
            <Image
              src="/landing-page/fitur.svg"
              alt="Fitur LawChain"
              width={800}
              height={600}
              className="h-auto w-auto max-w-full filter drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Mengapa Kami Section */}
      <section id="mengapa-kami" className="relative z-10 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Animated Cards */}
          <div className="w-full max-w-6xl mx-auto">
            <AnimatedCardsContainer />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;
