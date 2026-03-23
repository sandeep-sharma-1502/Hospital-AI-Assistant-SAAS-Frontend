'use client';

import { useEffect } from "react";
import {
  SessionProvider,
  useSession,
  RoomAudioRenderer,
} from "@livekit/components-react";

import { AgentSessionProvider } from "@livekit/components-react";;
import { TokenSource } from "livekit-client";

import VoiceBot from "./VoiceBot";

const tokenSource = TokenSource.sandboxTokenServer("voicebot-21ff37");

export default function VoiceBotWrapper() {
  const session = useSession(tokenSource, {
    agentName: "hospital-agent",
  });

  useEffect(() => {
    session.start();
    return () => session.end();
  }, []);

  return (
    <SessionProvider session={session}>
      <AgentSessionProvider session={session}>
        <VoiceBot />
        <RoomAudioRenderer />
      </AgentSessionProvider>
    </SessionProvider>
  );
}