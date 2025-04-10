import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import the Footer component
import Content from "./components/Content";
import Menu from "./components/Menu";
import Takeaway from "./components/Takeaway";
import TableSelection from "./components/TableSelection";
import DateTimeSelection from "./components/DateTimeSelection";
import OrderConfirmation from "./components/OrderConfirmation";
import ResConfirmation from "./components/ResConfirmation";
import UpdateOrDeleteOrder from "./components/UpdateDelete";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminMenuManagement from "./components/AdminMenuManagement";
import UserLogin from "./components/Login";
import UserProfile from "./components/UserProfile";
import UserRegistration from "./components/UserRegistration";
import bgImage from "/images/hk-background.png";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Content /></PageWrapper>} />
        <Route path="/select-date-time" element={<PageWrapper><DateTimeSelection /></PageWrapper>} />
        <Route path="/reserve-table" element={<PageWrapper><TableSelection /></PageWrapper>} />
        <Route path="/confirmation" element={<PageWrapper><ResConfirmation /></PageWrapper>} />
        <Route path="/menu" element={<PageWrapper><Menu /></PageWrapper>} />
        <Route path="/order-takeaway" element={<PageWrapper><Takeaway /></PageWrapper>} />
        <Route path="/order-confirmation/:orderId" element={<PageWrapper><OrderConfirmation /></PageWrapper>} />
        <Route path="/update-or-delete-order" element={<PageWrapper><UpdateOrDeleteOrder /></PageWrapper>} />
        
        {/* User Authentication Routes */}
        <Route path="/login" element={<PageWrapper><UserLogin /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><UserRegistration /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><UserProfile /></PageWrapper>} />
        
        {/* Admin Routes */}
        <Route path="/admin-login" element={<PageWrapper><AdminLogin /></PageWrapper>} />
        <Route path="/admin-dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        <Route path="/admin-menu-management" element={<PageWrapper><AdminMenuManagement /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div
            className="bg-repeat bg-[length:100px_100px] bg-center px-8 pt-20"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <AnimatedRoutes />
          </div>
        </main>
        <Footer /> {/* Add the Footer component here */}
      </div>
    </Router>
  );
}

export default App;