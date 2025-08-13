import Image from "next/image";
import { Aurora } from "@/components";

export default function Home() {
  return (
    <div className="relative font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#4F1787", "#4F1787", "#4F1787"]}
        amplitude={1.0}
        blend={0.5}
        speed={1.0}
        intensity={1.0}
        className="z-0"
      />
    </div>
  );
}
