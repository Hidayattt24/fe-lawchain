"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { IconUser, IconSend, IconRobot } from "@tabler/icons-react";
import BlurText from "@/components/BlurText";

interface ChatMessage {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("LLaMA3");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const models = ["LLaMA3", "GPT-4", "Claude", "Gemini"];

  const recommendedQuestions = [
    "Cari pasal UUD 1945 tentang kekuasaan kehakiman",
    "Apa tugas seorang Presiden menurut UUD?",
    "Sebutkan tugas wakil presiden?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = (userMessage: string): string => {
    // Simulasi respons bot berdasarkan pertanyaan
    const responses = {
      presiden:
        "Menurut UUD 1945, Presiden adalah kepala negara sekaligus kepala pemerintahan yang memegang kekuasaan eksekutif. Tugas utama Presiden meliputi menjalankan undang-undang, menetapkan peraturan pemerintah, mengangkat dan memberhentikan menteri, serta memimpin penyelenggaraan pemerintahan negara.",
      "wakil presiden":
        "Wakil Presiden membantu Presiden dalam menjalankan tugasnya. Menurut UUD 1945, Wakil Presiden dapat menggantikan Presiden apabila Presiden mangkat, berhenti, diberhentikan, atau tidak dapat melaksanakan kewajibannya dalam masa jabatannya.",
      kehakiman:
        "Kekuasaan kehakiman menurut UUD 1945 Pasal 24 dilakukan oleh Mahkamah Agung dan badan peradilan yang berada di bawahnya dalam lingkungan peradilan umum, lingkungan peradilan agama, lingkungan peradilan militer, lingkungan peradilan tata usaha negara, dan oleh sebuah Mahkamah Konstitusi.",
      pasal:
        "UUD 1945 terdiri dari Pembukaan, Pasal-pasal (Bab I sampai dengan Bab XVI), dan Aturan Peralihan serta Aturan Tambahan. Silakan sebutkan pasal spesifik yang ingin Anda ketahui.",
      default:
        "Terima kasih atas pertanyaan Anda tentang hukum Indonesia. Saya siap membantu menjelaskan berbagai aspek UUD 1945 dan sistem hukum Indonesia. Bisa Anda perjelas pertanyaan Anda?",
    };

    const lowerMessage = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(responses)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        return response;
      }
    }

    return responses.default;
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: simulateBotResponse(message),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleRecommendedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleRefreshChat = () => {
    setMessages([]);
    setInputMessage("");
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(179deg, #000 11.52%, #6339D7 128.95%)",
      }}
    >
      {/* Header Section */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 px-8 py-12">
          {/* Logo */}
          <div className="mb-12 transition-transform duration-300 hover:scale-105">
            <Image
              src="/logo/logo.svg"
              alt="LawChain Logo"
              width={140}
              height={56}
              priority
              className="h-auto w-auto drop-shadow-2xl"
            />
          </div>

          {/* Main Heading with Animation */}
          <div className="mb-8 text-center">
            <h1
              className="text-white font-medium text-3xl md:text-4xl mb-4 poppins-medium animate-text-reveal"
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "32px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "normal",
                animation:
                  "textReveal 2s ease-out forwards, textGlow 3s ease-in-out infinite 2s",
              }}
            >
              Hallo, Warga LawChain!
            </h1>
            <p
              className="text-white text-lg md:text-xl poppins-light animate-text-blur"
              style={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 300,
                lineHeight: "normal",
                animation:
                  "textBlurIn 2.5s ease-out 0.5s forwards, textPulse 4s ease-in-out infinite 3s",
                opacity: 0,
              }}
            >
              Siap membantu Anda memahami hukum hari ini?
            </p>
          </div>

          {/* Subtitle with Animation */}
          <div
            className="mb-12 opacity-0 animate-fade-in"
            style={{ animation: "fadeIn 1s ease-in-out 0.8s forwards" }}
          >
            <p
              className="text-center max-w-2xl text-gray-200"
              style={{
                fontFamily: "Poppins",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: "1.6",
              }}
            >
              Pilih pertanyaan di bawah atau ketik langsung untuk mulai
              berbicara dengan LawChain.
            </p>
          </div>

          {/* Recommended Questions with Enhanced Styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-6xl">
            {recommendedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleRecommendedQuestion(question)}
                className="group relative px-6 py-6 text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl transform hover:-translate-y-2"
                style={{
                  minHeight: "120px",
                  borderRadius: "20px",
                  background: "rgba(34, 34, 34, 0.8)",
                  fontFamily: "Poppins",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#6339D7";
                  e.currentTarget.style.borderColor = "#6339D7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(34, 34, 34, 0.8)";
                  e.currentTarget.style.borderColor =
                    "rgba(255, 255, 255, 0.1)";
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/20 group-hover:to-blue-600/20 rounded-20 transition-all duration-300"></div>
                <span className="relative z-10 block text-center leading-relaxed">
                  {question}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          {/* Header for Chat Mode */}
          <div className="max-w-4xl mx-auto mb-8 text-center">
            <div className="mb-4 transition-transform duration-300 hover:scale-105">
              <Image
                src="/logo/logo.svg"
                alt="LawChain Logo"
                width={80}
                height={32}
                priority
                className="h-auto w-auto mx-auto drop-shadow-lg"
              />
            </div>
            <h2 className="text-white text-xl font-medium poppins-medium mb-2">
              LawChain
            </h2>
            <p className="text-gray-300 text-sm poppins-light">
              Asisten hukum AI untuk UUD 1945
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 group ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-fade-in-up`}
              >
                {message.sender === "bot" && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <IconRobot size={20} className="text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[75%] p-6 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                    message.sender === "user"
                      ? "text-white"
                      : "bg-white/95 backdrop-blur-sm text-gray-800 border border-white/20"
                  }`}
                  style={
                    message.sender === "user"
                      ? { backgroundColor: "#212344" }
                      : {}
                  }
                >
                  <p className="text-sm leading-relaxed font-['Poppins'] whitespace-pre-wrap">
                    {message.message}
                  </p>
                  <span
                    className={`text-xs mt-3 block ${
                      message.sender === "user"
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {message.sender === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <IconUser size={20} className="text-[#6339D7]" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-4 justify-start animate-fade-in-up">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <IconRobot size={20} className="text-white" />
                  </div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Form - Fixed Position */}
      <div className="sticky bottom-0 px-4 py-6 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div
            className="flex items-center gap-4 p-6 group transition-all duration-300 hover:shadow-2xl"
            style={{
              width: "100%",
              borderRadius: "24px",
              background: "rgba(34, 34, 34, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(99, 57, 215, 0.5)";
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(99, 57, 215, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Model Selector */}
            <div className="flex-shrink-0">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-white border border-white/20 rounded-lg px-3 py-2 text-xs font-['Poppins'] focus:outline-none focus:border-[#6339D7] transition-all duration-200"
                style={{ minWidth: "80px" }}
              >
                {models.map((model) => (
                  <option
                    key={model}
                    value={model}
                    className="bg-gray-800 text-white"
                  >
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefreshChat}
              className="flex-shrink-0 p-2 rounded-lg border border-white/20 hover:bg-[#6339D7] hover:border-[#6339D7] transition-all duration-200 group"
              title="Refresh Chat"
            >
              <svg
                className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pertanyaan Anda tentang UUD 1945..."
                className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none font-['Poppins'] text-sm leading-relaxed"
                style={{
                  minHeight: "24px",
                  maxHeight: "120px",
                }}
                rows={1}
                disabled={isLoading}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "24px";
                  target.style.height = target.scrollHeight + "px";
                }}
              />
              {inputMessage.length > 0 && (
                <div className="absolute bottom-1 right-2 text-xs text-gray-500">
                  {inputMessage.length}/1000
                </div>
              )}
            </div>

            <button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={isLoading || !inputMessage.trim()}
              className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              style={{ backgroundColor: "#212344" }}
            >
              <IconSend
                size={20}
                className={`text-white transition-transform duration-200 ${
                  isLoading ? "animate-pulse" : "group-hover:translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
