import { PipecatClient } from "@pipecat-ai/client-js";
import {
  PipecatClientProvider,
  PipecatClientAudio,
} from "@pipecat-ai/client-react";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";
import VoiceBot from "./features/assistant/components/VoiceBot";

// Create client ONCE
const client = new PipecatClient({
  transport: new SmallWebRTCTransport({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  }),
  enableMic: true,
  enableCam: false,
});

export default function App() {
  return (
    <PipecatClientProvider client={client}>
      <VoiceBot />
      {/* SDK-managed audio output */}
      <PipecatClientAudio />
    </PipecatClientProvider>
  );
}

