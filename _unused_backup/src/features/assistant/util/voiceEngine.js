import * as sherpa_onnx from 'sherpa-onnx-wasm';

let ttsInstance = null;
let sttInstance = null;

export const initVoiceEngine = async () => {
  // 1. Initialize TTS (Hindi Voice)
  const ttsConfig = {
    vits: {
      model: "/models/hindi-vits.onnx", 
      lexicon: "/models/lexicon.txt",
      tokens: "/models/tokens.txt",
    },
    sampleRate: 16000,
  };
  
  ttsInstance = new sherpa_onnx.OfflineTts(ttsConfig);
  console.log("✅ Hindi TTS Loaded");

  // 2. Initialize STT (Hindi Listening)
  const sttConfig = {
    modelConfig: {
      transducer: {
        encoder: "/models/encoder.onnx",
        decoder: "/models/decoder.onnx",
        joiner: "/models/joiner.onnx",
      },
      tokens: "/models/tokens.txt",
    },
  };
  
  sttInstance = new sherpa_onnx.OnlineRecognizer(sttConfig);
  console.log("✅ Hindi STT Loaded");
};

export const speak = (text) => {
  if (!ttsInstance) return;
  const audio = ttsInstance.generate(text);
  // Audio play karne ka logic (Web Audio API)
  const audioCtx = new AudioContext();
  const buffer = audioCtx.createBuffer(1, audio.samples.length, 16000);
  buffer.getChannelData(0).set(audio.samples);
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
};
