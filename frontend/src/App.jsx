import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Loading from "./pages/Loading";
import Results from "./pages/Results";


function AnimatedRoutes() {

  const location = useLocation();

  return (
    <AnimatePresence mode="wait">

      <Routes location={location} key={location.pathname}>

        <Route 
          path="/"
          element={<Home />}
        />

        <Route
          path="/upload"
          element={<Upload />}
        />

        <Route
          path="/loading"
          element={<Loading />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

      </Routes>

    </AnimatePresence>
  );
}


function App() {

  return (
    <BrowserRouter>

      <AnimatedRoutes />

    </BrowserRouter>
  );
}


export default App;