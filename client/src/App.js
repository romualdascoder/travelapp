import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import PageNotFound from "./components/PageNotFound";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
