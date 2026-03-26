import { connect } from "livekit-client";

export const useLiveKit = async () => {
  const res = await fetch("http://localhost:7000/api/livekit/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomName: "hospital-room",
      userName: "sandeep",
    }),
  });

  const data = await res.json();

  const room = await connect(data.url, data.token);

  return room;
};