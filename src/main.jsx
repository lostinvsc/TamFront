import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import GenerateTickets from "./GenerateTickets.jsx";
import GameStart from "./GameStart.jsx";
import Winners from "./Winners.jsx";
import PlayersList from "./PlayersList.jsx";
import Login from "./Login.jsx";
import UnsoldTickets from "./UnsoldTickets.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/host">
      
          <Route path="generatetickets" element={<GenerateTickets/>} />
          <Route path="login" element={<Login/>} />
          <Route path="list" element={<PlayersList />} />
       
        </Route>
        <Route path="/player">
          <Route path="gamestart" element={<GameStart />} />
          <Route path="winners" element={<Winners />} />
          <Route path="unsold" element={<UnsoldTickets />} />
      
        
        </Route>
      </Routes>
    </Router>
    </>
  
);
