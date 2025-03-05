import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login";
import RouteGuard from "./RouteGuard"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RouteGuard />} >
          <Route path="/" element={<Main />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
