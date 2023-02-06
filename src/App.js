import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Menu from "./components/Menu";
import Dashboard from "./components/Dashboard";

import "./assets/styles/index.scss";

function App() {
  return (
    <Router>
      <section className="entry">
        <Menu />
        <Dashboard />
      </section>
    </Router>
  );
}

export default App;
