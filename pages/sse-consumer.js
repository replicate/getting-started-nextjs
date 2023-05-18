import { useEffect } from "react";

const ServerSentEventsConsumer = () => {
  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.addEventListener("message", (event) => {
      const messageData = JSON.parse(event.data);
      console.log("Received SSE message:", messageData);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return <div>Check the browser console for SSE messages.</div>;
};

export default ServerSentEventsConsumer;
