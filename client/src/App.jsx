import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Kanban from "./Kanban";
import Register from "./pages/Register";
import Login from "./pages/Login";

//  Route Guard using localStorage
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Kanban route */}
        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <Kanban />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
