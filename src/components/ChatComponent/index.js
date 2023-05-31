// import React, { useEffect, useState } from "react";
// import { HubConnectionBuilder } from "@microsoft/signalr";

// const ChatComponent = () => {
//   const [connection, setConnection] = useState(null);
//   const [notification, setNotification] = useState(undefined);

//   useEffect(() => {
//     const hubConnection = new HubConnectionBuilder()
//       .withUrl("https://localhost:44334/hubs/notifications")
//       .withAutomaticReconnect()
//       .build();

//     //https://localhost:44334/swagger/index.html

//     console.log({ hubConnection });

//     setConnection(hubConnection);

//     hubConnection
//       .start()
//       .then(() => console.log("SignalR Connected"))
//       .catch((error) => console.log("SignalR Connection Error: ", error));

//     hubConnection.on("ReceiveNotification", (message) => {
//       setNotification(message);
//     });

//     return () => {
//       hubConnection.stop();
//     };
//   }, []);

//   console.log({ notification });

//   return (
//     <div>
//       <h1>Notification Component</h1>
//       {notification && <p>{notification}</p>}
//     </div>
//   );
// };

// export default ChatComponent;
