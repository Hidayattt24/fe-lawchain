"use client";
import {
  Card,
  CardTitle,
  CardDescription,
  CardSkeletonContainer,
} from "./Card";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";

// Card Data
const cardData = [
  {
    id: 1,
    title: "Berbasis Teknologi AI Terbaru",
    description:
      "Menggunakan LLaMA 3 + Retrieval Augmented Generation (RAG) untuk hasil paling relevan.",
    image: "/mengapa-kami/cube-1.svg",
    alt: "AI Technology",
  },
  {
    id: 2,
    title: "Bahasa yang Mudah Dipahami",
    description:
      "Penjelasan hukum dalam bahasa sederhana tanpa mengurangi makna.",
    image: "/mengapa-kami/cube-2.svg",
    alt: "Easy Language",
  },
  {
    id: 3,
    title: "Tampilan & Interaksi Nyaman",
    description: "Desain ramah pengguna, seperti ngobrol dengan pakar.",
    image: "/mengapa-kami/cube-3.svg",
    alt: "Comfortable UI",
  },
];

// Animated Cards Container
export const AnimatedCardsContainer = () => {
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIndex((prev) => {
        const nextIndex = (prev + 1) % cardData.length;
        console.log(
          `🔄 Card rotation: ${cardData[prev].title} → ${cardData[nextIndex].title}`
        );
        return nextIndex;
      });
    }, 4000); // Increased to 4 seconds for better visibility

    return () => clearInterval(interval);
  }, []);

  const getCardPosition = (index: number) => {
    const diff = index - centerIndex;
    if (diff === 0) return "center";
    if (diff === 1 || diff === -(cardData.length - 1)) return "right";
    return "left";
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Center Indicator */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-2 mb-4">
          {cardData.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === centerIndex
                  ? "bg-[#4F1787] scale-125 shadow-lg"
                  : "bg-gray-400 scale-100"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sedang menampilkan:{" "}
          <span className="font-semibold text-[#4F1787]">
            {cardData[centerIndex].title}
          </span>
          <br />
          <span className="text-xs opacity-60">
            Urutan rotasi:{" "}
            {cardData
              .map((card, idx) =>
                idx === centerIndex
                  ? `[${card.title.split(" ")[0]}]`
                  : card.title.split(" ")[0]
              )
              .join(" → ")}
          </span>
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex items-center justify-center gap-4 md:gap-8 h-[400px] md:h-[500px] relative px-4">
        {cardData.map((card, index) => {
          const position = getCardPosition(index);
          const isCenter = position === "center";

          return (
            <motion.div
              key={card.id}
              className={`${isCenter ? "z-20" : "z-10"} relative`}
              animate={{
                scale: isCenter ? 1.15 : 0.8,
                y: isCenter ? -30 : 20,
                x: position === "left" ? -30 : position === "right" ? 30 : 0,
                opacity: isCenter ? 1 : 0.6,
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
            >
              <Card
                className={`${
                  isCenter
                    ? "shadow-2xl shadow-purple-500/30 border-purple-400/20"
                    : "shadow-md"
                } transition-all duration-1000`}
              >
                <CardSkeletonContainer>
                  <div className="p-4 md:p-8 overflow-hidden h-full relative flex items-center justify-center">
                    <motion.div
                      animate={{
                        rotate: isCenter ? [0, 360] : [0, 180, 0],
                        scale: isCenter ? [1, 1.1, 1] : [1, 0.9, 1],
                      }}
                      transition={{
                        duration: isCenter ? 4 : 6,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Image
                        src={card.image}
                        alt={card.alt}
                        width={isCenter ? 220 : 180}
                        height={isCenter ? 220 : 180}
                        className="h-auto w-auto max-w-full"
                      />
                    </motion.div>
                  </div>
                </CardSkeletonContainer>
                <CardTitle
                  className={`${
                    isCenter ? "text-lg md:text-xl" : "text-sm md:text-lg"
                  } transition-all duration-1000`}
                >
                  {card.title}
                </CardTitle>
                <CardDescription
                  className={`${
                    isCenter ? "text-sm md:text-base" : "text-xs md:text-sm"
                  } transition-all duration-1000`}
                >
                  {card.description}
                </CardDescription>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Legacy individual card components (keeping for backward compatibility)
export const AITechCard = () => {
  return (
    <Card>
      <CardSkeletonContainer>
        <AITechSkeleton />
      </CardSkeletonContainer>
      <CardTitle>Berbasis Teknologi AI Terbaru</CardTitle>
      <CardDescription>
        Menggunakan LLaMA 3 + Retrieval Augmented Generation (RAG) untuk hasil
        paling relevan.
      </CardDescription>
    </Card>
  );
};

export const EasyLanguageCard = () => {
  return (
    <Card>
      <CardSkeletonContainer>
        <EasyLanguageSkeleton />
      </CardSkeletonContainer>
      <CardTitle>Bahasa yang Mudah Dipahami</CardTitle>
      <CardDescription>
        Penjelasan hukum dalam bahasa sederhana tanpa mengurangi makna.
      </CardDescription>
    </Card>
  );
};

export const ComfortableUICard = () => {
  return (
    <Card>
      <CardSkeletonContainer>
        <ComfortableUISkeleton />
      </CardSkeletonContainer>
      <CardTitle>Tampilan & Interaksi Nyaman</CardTitle>
      <CardDescription>
        Desain ramah pengguna, seperti ngobrol dengan pakar.
      </CardDescription>
    </Card>
  );
};

// Skeleton components
const AITechSkeleton = () => {
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <Image
        src="/mengapa-kami/cube-1.svg"
        alt="AI Technology"
        width={200}
        height={200}
        className="h-auto w-auto max-w-full"
      />
    </div>
  );
};

const EasyLanguageSkeleton = () => {
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <Image
        src="/mengapa-kami/cube-2.svg"
        alt="Easy Language"
        width={200}
        height={200}
        className="h-auto w-auto max-w-full"
      />
    </div>
  );
};

const ComfortableUISkeleton = () => {
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      <Image
        src="/mengapa-kami/cube-3.svg"
        alt="Comfortable UI"
        width={200}
        height={200}
        className="h-auto w-auto max-w-full"
      />
    </div>
  );
};
