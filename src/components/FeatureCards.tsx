"use client";
import {
  Card,
  CardTitle,
  CardDescription,
  CardSkeletonContainer,
} from "./Card";
import React from "react";
import Image from "next/image";

// AI Technology Card
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

// Easy Language Card
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

// Comfortable UI Card
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

// AI Technology Skeleton
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

// Easy Language Skeleton
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

// Comfortable UI Skeleton
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
