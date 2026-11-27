import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { aiApi } from '@/features/ai-voice/api/ai.api';
import { getApiErrorMessage } from '@/lib/api/axios';

/**
 * Custom React Query Hooks for AI Voice:
 * WHAT THEY DO: Wrap our Axios API functions inside TanStack Query mutations.
 * WHY WE USE THEM:
 *   1. TanStack Query automatically provides loading states (`isPending`) and error states (`isError`).
 *   2. If a request fails, it automatically shows a friendly toast notification to the user.
 *   3. It prevents buttons from being clicked multiple times while waiting for a response.
 */

/**
 * Hook for Speech-to-Text mutation (Audio -> Text)
 */
export function useTranscribeMutation() {
  return useMutation({
    mutationFn: ({
      file,
      languageCode,
    }: {
      file: Blob | File;
      languageCode?: string;
    }) => aiApi.transcribe(file, languageCode),
    onError: (error) => {
      // Shows a helpful red error popup on the screen if something goes wrong
      toast.error(getApiErrorMessage(error));
    },
  });
}

/**
 * Hook for LLM Chat mutation (User question -> AI answer)
 */
export function useChatMutation() {
  return useMutation({
    mutationFn: (message: string) => aiApi.chat(message),
    onError: (error) => {
      // Shows a helpful red error popup on the screen if something goes wrong
      toast.error(getApiErrorMessage(error));
    },
  });
}

/**
 * Hook for Text-to-Speech mutation (Text -> Sound audio blob)
 */
export function useSpeakMutation() {
  return useMutation({
    mutationFn: ({
      text,
      speaker,
      languageCode,
    }: {
      text: string;
      speaker?: string;
      languageCode?: string;
    }) => aiApi.speak(text, speaker, languageCode),
    onError: (error) => {
      // Shows a helpful red error popup on the screen if something goes wrong
      toast.error(getApiErrorMessage(error));
    },
  });
}
