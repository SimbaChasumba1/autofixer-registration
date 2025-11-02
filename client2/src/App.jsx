import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";

import Registration from "./pages/RegisterPage";

import UploadVideoPage from "./pages/UploadVideoPage";

import PaymentPage from "./pages/PaymentPage";

import Success from "./pages/SuccessPage";

import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import SuccessPage from "./pages/SuccessPage";



export default function App() {

  return (

    <Router>

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/upload-video" element={<UploadVideoPage />} />

        <Route path="/payment" element={<PaymentPage />} />

        <Route path="/success" element={<SuccessPage />} />

        <Route path="*" element={<NotFound />} />

      </Routes>

    </Router>

  );

}