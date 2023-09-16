import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Room from "./components/room";
import Home from "./components/home";
// import RoomList from "./components/roomList";

function App() {
  const [name, setName] = useState("");
  const socketRef = useRef();

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const submitName = () => {
    socketRef.current.emit("send-name", name);
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:3003");
    return () => socketRef.current.disconnect();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          exact
          element={
            <Home
              handleNameSubmit={handleNameSubmit}
              name={name}
              submitName={submitName}
            />
          }
        />
        {/* <Route path="/rooms" element={<RoomList />} /> */}
        <Route path="/room" element={<Room name={name} />} />
      </Routes>
    </div>
  );
}

export default App;
