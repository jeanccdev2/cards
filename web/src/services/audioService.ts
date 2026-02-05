async function transcribe(audioBlob: Blob) {
  const result = await window.puter.ai.speech2txt(audioBlob, {
    // language: "pt-BR",
  });
  console.log("result", result);
  return result.text;
}

export default {
  transcribe,
};
