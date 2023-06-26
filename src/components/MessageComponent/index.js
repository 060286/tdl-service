import React, { useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

const userInfo = {
  email: "tamle.dev1@gmail.com",
  fullName: "Tam Le 2 Le",
  id: "ffed1e9c-3c14-4661-87cc-063176d90c88",
  userName: "tamle.dev1",
  img: null,
};

function MessageComponent({ email }) {
  const [messages, setMessages] = useState([]);
  const connection = new HubConnectionBuilder()
    .withUrl("https://localhost:44334/hubs/notifications", userInfo) // Replace with your API URL
    .withAutomaticReconnect()
    .build();

  useEffect(() => {
    connection.start().catch((error) => console.error(error));

    connection.on("SendNotification", (message) => {
      console.log({ message });

      setMessages((prevMessages) => [...prevMessages, message]);
    });

    console.log({ connection });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div>
      {/* {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))} */}
    </div>
  );
}

export default MessageComponent;
