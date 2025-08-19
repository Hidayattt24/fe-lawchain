/**
 * API configuration and functions for LawChain Frontend
 */

// Types untuk request dan response
export interface QuestionRequest {
  question: string;
  method: "langchain" | "native";
  max_docs?: number;
}

export interface SourceDocument {
  dokumen: string;
  judul: string;
  sumber_url: string;
  institusi: string;
  priority_score: number;
  halaman: string;
  chunk_id: number;
  similarity_score: number;
  preview: string;
}

export interface Metrics {
  semantic_similarity: number;
  content_coverage: number;
  answer_relevance: number;
  source_quality: number;
  legal_context: number;
  answer_completeness: number;
  confidence_score: number;
  estimated_accuracy: number;
}

export interface QuestionResponse {
  success: boolean;
  pertanyaan: string;
  jawaban: string;
  method: string;
  metrics: Metrics;
  jumlah_sumber: number;
  sumber_dokumen: SourceDocument[];
  timestamp: string;
  processing_time?: number;
}

export interface ErrorResponse {
  success: boolean;
  error: string;
  error_code?: string;
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
  services: {
    ollama: boolean;
    langchain_vectorstore: boolean;
    native_vectorstore: boolean;
    data_files: boolean;
  };
  uptime?: number;
}

// Konfigurasi API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// Helper function untuk membuat request dengan timeout yang lebih baik
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Timeout controller for long-running requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12 * 60 * 1000); // 12 minutes timeout

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal: controller.signal,
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout - silakan coba lagi dengan pertanyaan yang lebih spesifik"
        );
      }
    }

    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// API Functions
export const lawchainAPI = {
  // Health check
  async healthCheck(): Promise<HealthResponse> {
    return apiRequest<HealthResponse>("/health");
  },

  // Ask question
  async askQuestion(request: QuestionRequest): Promise<QuestionResponse> {
    return apiRequest<QuestionResponse>("/ask", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  // Get system status
  async getStatus(): Promise<any> {
    return apiRequest<any>("/system/status");
  },

  // Rebuild vector store (jika diperlukan)
  async rebuildVectorStore(
    method: "langchain" | "native" | "both",
    force: boolean = false
  ): Promise<any> {
    return apiRequest<any>("/system/rebuild", {
      method: "POST",
      body: JSON.stringify({ method, force }),
    });
  },
};

export default lawchainAPI;
