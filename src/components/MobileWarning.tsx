"use client";
import React from "react";
import Image from "next/image";

const MobileWarning = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 md:hidden"
      style={{ backgroundColor: "#212344" }}
    >


      {/* Content */}
      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo/logo.svg"
            alt="LawChain Logo"
            width={120}
            height={48}
            priority
            className="h-auto w-auto mx-auto drop-shadow-lg"
          />
        </div>

        {/* Warning Message */}
        <div className="mb-8">
          <h1
            className="text-white text-2xl font-bold mb-4 poppins-semibold"
            style={{
              fontFamily: "Poppins",
              fontSize: "28px",
              fontWeight: 600,
              lineHeight: "1.3",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            Mohon Maaf
          </h1>
          <p
            className="text-white text-lg poppins-medium"
            style={{
              fontFamily: "Poppins",
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "1.5",
              textShadow: "0 1px 5px rgba(0,0,0,0.5)",
            }}
          >
            LawChain hanya tersedia di desktop
          </p>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p
            className="text-gray-300 text-sm poppins-light"
            style={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 300,
              lineHeight: "1.4",
              opacity: 0.8,
            }}
          >
            Silakan buka aplikasi ini menggunakan desktop atau laptop untuk
            pengalaman terbaik.
          </p>
        </div>

      </div>
    </div>
  );
};

export default MobileWarning;
