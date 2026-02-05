export {};

declare global {
  interface Window {
    puter: {
      ai: {
        speech2txt: (
          source: string | Blob | File,
          options: {
            audio?: string | Blob | File;
            file?: string | Blob | File;
            model?: string;
            translate?: boolean;
            response_format?: string;
            language?: string;
            prompt?: string;
          },
          testMode?: boolean,
        ) => Promise<{
          text?: string;
          language?: string;
          confidence?: number;
        }>;
      };
      // outros métodos também podem ser tipados aqui se quiser
      // e.g., chat, txt2speech, img2txt, etc.
    };
  }
}
