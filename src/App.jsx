import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Content from "./components/Content";
import Menu from "./components/Menu";
import Takeaway from "./components/Takeaway";
import TableSelection from "./components/TableSelection";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<><Carousel /><Content /></>} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/takeaway" element={<Takeaway/ >} />
        <Route path="/reserve" element={<TableSelection/>}/>
      </Routes>
    </Router>
  );
}

export default App;
