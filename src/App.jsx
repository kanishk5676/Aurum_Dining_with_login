import { useState } from 'react'
import Navbar from "./components/Navbar"
import Content from "./components/Content"
import "../src/index.css"

function App() {
  return (
    <div>
      <Navbar />
      <Content />
    </div>
  );
}

export default App;
