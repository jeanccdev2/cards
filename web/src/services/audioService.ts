import puter from "@heyputer/puter.js";

async function transcribe(audioBlob: Blob) {
  const result = await puter.ai.speech2txt(audioBlob, {
    language: "pt",
  });
  return result.text;
}

export default {
  transcribe,
};
