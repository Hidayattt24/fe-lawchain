"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  IconUser,
  IconSend,
  IconRobot,
  IconAlertCircle,
  IconExternalLink,
  IconStar,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import BlurText from "@/components/BlurText";
import {
  lawchainAPI,
  QuestionRequest,
  QuestionResponse,
  SourceDocument,
} from "@/lib/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ChatMessage {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: Date;
  sources?: SourceDocument[];
  metrics?: any;
  method?: string;
  error?: boolean;
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"langchain" | "native">(
    "langchain"
  );
  const [apiStatus, setApiStatus] = useState<
    "unknown" | "healthy" | "unhealthy"
  >("unknown");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<
    Record<string, boolean>
  >({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to copy text to clipboard
  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      toast.success("📋 Teks berhasil disalin ke clipboard!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("❌ Gagal menyalin teks ke clipboard.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Function to toggle source expansion
  const toggleSourceExpansion = (messageId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  // Function to render markdown-like text
  const renderMarkdownText = (text: string) => {
    if (!text) return null;

    // Process text line by line to handle lists and other formatting
    const lines = text.split("\n");

    return lines.map((line, lineIndex) => {
      // Handle numbered lists (1. 2. 3.)
      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (numberedListMatch) {
        const [, number, content] = numberedListMatch;
        return (
          <div key={lineIndex} className="flex items-start gap-2 mb-1">
            <span className="font-semibold text-[#6339D7] min-w-[20px]">
              {number}.
            </span>
            <span className="flex-1">{processInlineMarkdown(content)}</span>
          </div>
        );
      }

      // Handle bullet lists (- or *)
      const bulletListMatch = line.match(/^[-*]\s+(.+)$/);
      if (bulletListMatch) {
        const [, content] = bulletListMatch;
        return (
          <div key={lineIndex} className="flex items-start gap-2 mb-1">
            <span className="text-[#6339D7] min-w-[10px] mt-1">•</span>
            <span className="flex-1">{processInlineMarkdown(content)}</span>
          </div>
        );
      }

      // Handle headers (### text)
      const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (headerMatch) {
        const [, hashes, content] = headerMatch;
        const level = hashes.length;
        const headerClass =
          level === 1
            ? "text-lg font-bold text-gray-900 mb-2 mt-4"
            : level === 2
            ? "text-md font-bold text-gray-800 mb-1 mt-3"
            : "text-sm font-bold text-gray-700 mb-1 mt-2";

        return (
          <div key={lineIndex} className={headerClass}>
            {processInlineMarkdown(content)}
          </div>
        );
      }

      // Handle empty lines
      if (line.trim() === "") {
        return <div key={lineIndex} className="h-2"></div>;
      }

      // Regular paragraph with inline markdown
      return (
        <div key={lineIndex} className="mb-1">
          {processInlineMarkdown(line)}
        </div>
      );
    });
  };

  // Function to process inline markdown (bold, italic)
  const processInlineMarkdown = (text: string) => {
    if (!text) return null;

    // First handle bold text (**text**)
    let parts = text.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Bold text
        const boldText = part.slice(2, -2);
        return (
          <span key={index} className="font-bold text-gray-900">
            {processItalicText(boldText)}
          </span>
        );
      } else {
        return processItalicText(part, index);
      }
    });
  };

  // Function to process italic text (*text*)
  const processItalicText = (text: string, baseIndex: number = 0) => {
    if (!text) return null;

    const parts = text.split(/(\*[^*]+\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        // Italic text (but not ** which is handled above)
        const italicText = part.slice(1, -1);
        return (
          <span key={`${baseIndex}-${index}`} className="italic text-gray-800">
            {italicText}
          </span>
        );
      } else {
        return <span key={`${baseIndex}-${index}`}>{part}</span>;
      }
    });
  };

  // Mapping dokumen ke URL sumber yang sebenarnya
  const documentSources: Record<
    string,
    { judul: string; sumber: string; institusi: string; priority_score: number }
  > = {
    "UUD1945-BPHN.pdf": {
      judul: "UUD 1945 - Badan Pembinaan Hukum Nasional (BPHN)",
      sumber: "https://bphn.go.id/data/documents/uud_1945.pdf",
      institusi: "Badan Pembinaan Hukum Nasional",
      priority_score: 95,
    },
    "UUD1945-MKRI.pdf": {
      judul: "UUD 1945 Asli - Mahkamah Konstitusi RI (MKRI)",
      sumber:
        "https://www.mkri.id/public/content/infoumum/regulation/pdf/UUD45%20ASLI.pdf",
      institusi: "Mahkamah Konstitusi Republik Indonesia",
      priority_score: 100,
    },
    "UUD1945-MPR.pdf": {
      judul: "UUD 1945 - Majelis Permusyawaratan Rakyat (MPR)",
      sumber: "https://jdih.bapeten.go.id/unggah/dokumen/peraturan/4-full.pdf",
      institusi: "Majelis Permusyawaratan Rakyat",
      priority_score: 90,
    },
    "UUD1945.pdf": {
      judul: "UUD 1945 - Dewan Kehormatan Penyelenggara Pemilu (DKPP)",
      sumber:
        "https://dkpp.go.id/wp-content/uploads/2018/11/UUD-Nomor-Tahun-1945-UUD1945.pdf",
      institusi: "Dewan Kehormatan Penyelenggara Pemilu",
      priority_score: 85,
    },
    "UUD1945-BUKU.pdf": {
      judul: "UUD 1945 - Buku Panduan Lengkap MPR RI",
      sumber: "https://mpr.go.id/img/sosialisasi/file/1610334013_file_mpr.pdf",
      institusi: "Majelis Permusyawaratan Rakyat Republik Indonesia",
      priority_score: 110,
    },
  };

  const models: {
    value: "langchain" | "native";
    label: string;
    description: string;
  }[] = [
    {
      value: "langchain",
      label: "LangChain",
      description: "Menggunakan LangChain framework untuk RAG",
    },
    {
      value: "native",
      label: "Native",
      description: "Implementasi native untuk RAG",
    },
  ];

  const recommendedQuestions = [
    "Cari pasal UUD 1945 tentang kekuasaan kehakiman",
    "Apa tugas seorang Presiden menurut UUD?",
    "Sebutkan tugas wakil presiden?",
  ];

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await lawchainAPI.healthCheck();
        setApiStatus("healthy");
        toast.success(
          "🤖 Koneksi dengan backend AI berhasil! Siap untuk menjawab pertanyaan Anda.",
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } catch (error) {
        console.error("API health check failed:", error);
        setApiStatus("unhealthy");
        toast.error(
          "❌ Gagal terhubung dengan backend AI. Silakan periksa koneksi atau coba lagi nanti.",
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    };

    checkApiStatus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Show loading notification
    const loadingToastId = toast.info(
      "⏳ Maaf ini membutuhkan waktu lama karena model LLaMA yang digunakan menggunakan running dari local. Mohon tunggu sebentar...",
      {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      }
    );

    try {
      // Prepare request
      const request: QuestionRequest = {
        question: message.trim(),
        method: selectedModel,
        max_docs: 5,
      };

      // Call API
      const response: QuestionResponse = await lawchainAPI.askQuestion(request);

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      // Show success notification
      toast.success(
        "✅ Pertanyaan berhasil diproses! Jawaban telah diterima dari model LLaMA.",
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Create bot response message
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.jawaban,
        sender: "bot",
        timestamp: new Date(),
        sources: response.sumber_dokumen,
        metrics: response.metrics,
        method: response.method,
        error: false,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      // Show error notification
      toast.error(
        `❌ Terjadi kesalahan saat memproses pertanyaan: ${
          error instanceof Error ? error.message : "Silakan coba lagi."
        }`,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Create error response message
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: `Maaf, terjadi kesalahan saat memproses pertanyaan Anda. ${
          error instanceof Error ? error.message : "Silakan coba lagi."
        }`,
        sender: "bot",
        timestamp: new Date(),
        error: true,
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleRefreshChat = () => {
    setMessages([]);
    setInputMessage("");
    setIsLoading(false);
    toast.info(
      "🔄 Chat telah disegarkan. Anda dapat memulai percakapan baru.",
      {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  return (
    <div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
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
              <div className="flex items-center justify-center gap-4 mb-2">
                <h2 className="text-white text-xl font-medium poppins-medium">
                  LawChain
                </h2>
                {/* API Status Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      apiStatus === "healthy"
                        ? "bg-green-400"
                        : apiStatus === "unhealthy"
                        ? "bg-red-400"
                        : "bg-yellow-400"
                    }`}
                  ></div>
                  <span className="text-xs text-gray-300">
                    {apiStatus === "healthy"
                      ? "Connected"
                      : apiStatus === "unhealthy"
                      ? "Disconnected"
                      : "Checking..."}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 text-sm poppins-light">
                Asisten hukum AI untuk UUD 1945 • Mode:{" "}
                {models.find((m) => m.value === selectedModel)?.label}
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
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                        style={{ backgroundColor: "#6339D7" }}
                      >
                        <IconRobot size={20} className="text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-6 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                      message.sender === "user"
                        ? "text-white border border-[#6339D7]/20"
                        : "bg-white/98 backdrop-blur-sm text-gray-800 border border-gray-200/40 shadow-sm"
                    }`}
                    style={
                      message.sender === "user"
                        ? { backgroundColor: "#6339D7" }
                        : message.error
                        ? {
                            backgroundColor: "rgba(254, 242, 242, 0.95)",
                            borderColor: "rgba(239, 68, 68, 0.3)",
                          }
                        : {}
                    }
                  >
                    {message.error && (
                      <div className="flex items-center mb-2 text-red-400">
                        <IconAlertCircle size={16} className="mr-2" />
                        <span className="text-xs">Error</span>
                      </div>
                    )}
                    <div
                      className={`${
                        message.sender === "bot"
                          ? "prose prose-sm prose-gray max-w-none"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className={`leading-relaxed font-['Poppins'] whitespace-pre-wrap flex-1 ${
                            message.sender === "user"
                              ? "text-sm text-white/95"
                              : "text-sm text-gray-800"
                          }`}
                        >
                          {message.sender === "bot"
                            ? renderMarkdownText(message.message)
                            : message.message}
                        </p>

                        {/* Copy button for bot messages */}
                        {message.sender === "bot" && !message.error && (
                          <button
                            onClick={() =>
                              copyToClipboard(message.message, message.id)
                            }
                            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                            title="Salin jawaban"
                          >
                            {copiedMessageId === message.id ? (
                              <IconCheck size={16} className="text-green-600" />
                            ) : (
                              <IconCopy
                                size={16}
                                className="text-gray-500 group-hover:text-gray-700"
                              />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Method and metrics display for bot messages */}
                    {message.sender === "bot" &&
                      message.method &&
                      !message.error && (
                        <div className="mt-4 pt-4 border-t border-gray-200/30">
                          <div className="bg-gradient-to-r from-indigo-50/70 to-purple-50/70 rounded-xl p-4 border border-indigo-100/50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm"></div>
                                <span className="text-sm font-semibold text-gray-800">
                                  Metode Analisis:{" "}
                                  {message.method === "langchain"
                                    ? "LangChain RAG"
                                    : "Native RAG"}
                                </span>
                              </div>
                              {message.metrics && (
                                <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-lg border border-indigo-200/30">
                                  <IconStar
                                    size={16}
                                    className="text-amber-500"
                                  />
                                  <span className="text-sm font-bold text-gray-800">
                                    Tingkat Akurasi:{" "}
                                    {Math.round(
                                      message.metrics.estimated_accuracy
                                    )}
                                    %
                                  </span>
                                </div>
                              )}
                            </div>
                            {message.metrics && (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/50 p-3 rounded-lg border border-blue-100/50">
                                  <div className="text-xs text-blue-600 font-medium mb-1">
                                    Relevansi Jawaban
                                  </div>
                                  <div className="text-lg font-bold text-blue-700">
                                    {Math.round(
                                      message.metrics.answer_relevance
                                    )}
                                    %
                                  </div>
                                </div>
                                <div className="bg-white/50 p-3 rounded-lg border border-green-100/50">
                                  <div className="text-xs text-green-600 font-medium mb-1">
                                    Kelengkapan Informasi
                                  </div>
                                  <div className="text-lg font-bold text-green-700">
                                    {Math.round(
                                      message.metrics.answer_completeness
                                    )}
                                    %
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Source documents for bot messages */}
                    {message.sender === "bot" &&
                      message.sources &&
                      message.sources.length > 0 && (
                        <div className="mt-5 pt-5 border-t border-gray-200/30">
                          <div className="mb-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm"></div>
                                <h3 className="text-sm font-bold text-gray-800">
                                  Dasar Hukum & Referensi
                                </h3>
                              </div>
                              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                                {message.sources.length} Dokumen
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              Jawaban ini berdasarkan pada dokumen resmi UUD
                              1945 dari berbagai institusi negara
                            </p>
                          </div>

                          <div className="space-y-4">
                            {message.sources
                              .slice(
                                0,
                                expandedSources[message.id] ? undefined : 1
                              )
                              .map((source, idx) => {
                                const sourceInfo =
                                  documentSources[source.dokumen];

                                // Skip jika tidak ada preview yang bermakna
                                if (
                                  !source.preview ||
                                  source.preview.trim().length < 10
                                ) {
                                  return null;
                                }

                                return (
                                  <div
                                    key={idx}
                                    className="bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300"
                                  >
                                    {/* Header dokumen */}
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span
                                            className="text-white px-2 py-1 rounded text-xs font-bold"
                                            style={{
                                              backgroundColor: "#6339D7",
                                            }}
                                          >
                                            Dokumen {idx + 1}
                                          </span>
                                          <span className="text-sm font-semibold text-gray-700">
                                            Halaman {source.halaman}
                                          </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-1 leading-tight">
                                          {sourceInfo?.judul || source.dokumen}
                                        </h4>
                                        <p className="text-xs text-gray-600">
                                          <span className="font-medium">
                                            Institusi:
                                          </span>{" "}
                                          {sourceInfo?.institusi ||
                                            source.institusi}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Kutipan teks */}
                                    <div
                                      className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-4 border-l-4 mb-3"
                                      style={{ borderLeftColor: "#6339D7" }}
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <span
                                          className="text-xs font-semibold uppercase tracking-wide"
                                          style={{ color: "#6339D7" }}
                                        >
                                          Kutipan Dokumen
                                        </span>
                                      </div>
                                      <blockquote className="text-sm text-gray-800 leading-relaxed italic">
                                        "{source.preview.trim()}"
                                      </blockquote>
                                    </div>

                                    {/* Link ke dokumen asli */}
                                    {sourceInfo?.sumber && (
                                      <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
                                        <div className="text-xs text-gray-500">
                                          Dokumen resmi dari{" "}
                                          {sourceInfo.institusi}
                                        </div>
                                        <a
                                          href={sourceInfo.sumber}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 shadow-sm hover:shadow hover:opacity-90"
                                          style={{ backgroundColor: "#6339D7" }}
                                        >
                                          <IconExternalLink size={12} />
                                          <span>Buka Dokumen</span>
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}

                            {/* Load More / Show Less Button */}
                            {message.sources.length > 1 && (
                              <div className="text-center mt-4">
                                <button
                                  onClick={() =>
                                    toggleSourceExpansion(message.id)
                                  }
                                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6339D7] to-purple-600 hover:from-[#5429c4] hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                  {expandedSources[message.id] ? (
                                    <>
                                      <span>Tampilkan Lebih Sedikit</span>
                                      <svg
                                        className="w-4 h-4 transform rotate-180"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </>
                                  ) : (
                                    <>
                                      <span>
                                        Lihat {message.sources.length - 1}{" "}
                                        Referensi Lainnya
                                      </span>
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </>
                                  )}
                                </button>

                                {!expandedSources[message.id] && (
                                  <div className="mt-2">
                                    <span className="text-xs text-gray-500">
                                      Menampilkan 1 dari{" "}
                                      {message.sources.length} referensi • Klik
                                      untuk melihat semua
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

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
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: "#6339D7" }}
                    >
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
                  onChange={(e) =>
                    setSelectedModel(e.target.value as "langchain" | "native")
                  }
                  className="bg-transparent text-white border border-white/20 rounded-lg px-3 py-2 text-xs font-['Poppins'] focus:outline-none focus:border-[#6339D7] transition-all duration-200"
                  style={{ minWidth: "120px" }}
                  title={
                    models.find((m) => m.value === selectedModel)?.description
                  }
                >
                  {models.map((model) => (
                    <option
                      key={model.value}
                      value={model.value}
                      className="bg-gray-800 text-white"
                    >
                      {model.label}
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

      {/* Toast Container for notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
        limit={3}
      />
    </div>
  );
};

export default ChatbotPage;
