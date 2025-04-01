import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Content from "./components/Content";
import Menu from "./components/Menu";
import Takeaway from "./components/Takeaway";
import TableSelection from "./components/TableSelection";
import DateTimeSelection from "./components/DateTimeSelection";
import OrderConfirmation from "./components/OrderConfirmation";
import ResConfirmation from "./components/ResConfirmation";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/select-date-time" element={<DateTimeSelection />} />
          <Route path="/reserve-table" element={<TableSelection />} />
          <Route path="/confirmation" element={<ResConfirmation />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order-takeaway" element={<Takeaway />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} /> {/* ✅ Added OrderConfirmation route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;