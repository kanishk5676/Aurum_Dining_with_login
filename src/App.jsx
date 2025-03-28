import { useRef } from "react";
import Navbar from "./components/Navbar"
import Carousel from "./components/Carousel"
import Content from "./components/Content"
import "../src/index.css"

function App() {
  return (
    <div>
      <Navbar />
      <Carousel />
      <Content/>
    </div>
  );
}

export default App;
