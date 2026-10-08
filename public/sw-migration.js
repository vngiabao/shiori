// Older Shiori workers cannot present an Update button. Adopt this worker once
// from that generation, without reloading its open pages or clearing user data.
// Workers supporting the handshake keep subsequent updates waiting for consent.
self.addEventListener("message", (event) => {
  if (event.data?.type === "SHIORI_PROMPT_UPDATE_SUPPORTED")
    event.ports[0]?.postMessage(true);
});
self.addEventListener("install", (event) => {
  const active = self.registration.active;
  if (!active) return;
  event.waitUntil(
    new Promise((resolve) => {
      const channel = new MessageChannel();
      const finish = (supported) => {
        clearTimeout(timeout);
        channel.port1.close();
        resolve(supported ? undefined : self.skipWaiting());
      };
      const timeout = setTimeout(() => finish(false), 2000);
      channel.port1.onmessage = (reply) => finish(reply.data === true);
      active.postMessage({ type: "SHIORI_PROMPT_UPDATE_SUPPORTED" }, [
        channel.port2,
      ]);
    }),
  );
});
