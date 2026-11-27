import { apiClient } from '@/lib/api/axios';

/**
 * Shape of the data returned after transcribing audio
 */
export interface TranscribeResult {
  transcript: string; // The recognized words (e.g., "What are your hours?")
  languageCode: string; // The language detected (e.g., "en-IN")
}

/**
 * Shape of the data returned from the AI Chat
 */
export interface ChatResult {
  reply: string; // The intelligent answer from the AI assistant
}

/**
 * Frontend AI API Client (powered by Axios):
 * WHAT IT DOES: Bridges the Next.js React frontend to the NestJS backend endpoints.
 * WHY WE USE IT:
 *   Instead of calling raw URLs in components, this file provides clean, reusable functions.
 *   `apiClient` (Axios) automatically attaches the logged-in admin's Bearer JWT token to every request.
 * HOW DATA FLOWS:
 *   User clicks a button in React -> calls one of these functions -> Axios sends HTTP request to NestJS ->
 *   NestJS communicates with Sarvam AI -> results are returned here.
 */
export const aiApi = {
  /**
   * 1. Speech-to-Text:
   * Takes a microphone recording or an audio file and asks the backend to transcribe it.
   * We use FormData because we are sending binary audio file bytes, not plain text.
   */
  transcribe: async (
    file: Blob | File,
    languageCode?: string,
  ): Promise<TranscribeResult> => {
    // Pack the audio into a standard form envelope
    const formData = new FormData();
    const filename = file instanceof File ? file.name : 'recording.webm';
    formData.append('file', file, filename);
    if (languageCode) {
      formData.append('languageCode', languageCode);
    }

    // Axios POST call to our NestJS endpoint
    const { data } = await apiClient.post<{
      success: boolean;
      data: TranscribeResult;
    }>('/ai/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  },

  /**
   * 2. Intelligent Chat:
   * Takes the customer's question text and asks the backend AI assistant to answer it.
   */
  chat: async (message: string): Promise<ChatResult> => {
    // Axios POST call sending a simple JSON object
    const { data } = await apiClient.post<{
      success: boolean;
      data: ChatResult;
    }>('/ai/chat', { message });

    return data.data;
  },

  /**
   * 3. Text-to-Speech:
   * Takes written words and asks the backend to generate spoken audio.
   * Notice `{ responseType: 'blob' }`: This tells Axios "do not parse this as text or JSON,
   * give me the raw audio sound file so the browser's audio player can play it immediately."
   */
  speak: async (
    text: string,
    speaker?: string,
    languageCode?: string,
  ): Promise<Blob> => {
    // Axios POST call requesting binary audio blob response
    const response = await apiClient.post(
      '/ai/speak',
      { text, speaker, languageCode },
      { responseType: 'blob' },
    );

    return response.data as Blob;
  },
};
