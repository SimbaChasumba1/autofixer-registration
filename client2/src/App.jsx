import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";

import RegisterPage from "./pages/RegisterPage";

import PaymentPage from "./pages/PaymentPage";

import SuccessPage from "./pages/SuccessPage";

import UploadVideoPage from "./pages/UploadVideoPage";



// import RegistrationsPage from "./pages/RegistrationsPage"; // optional



const App = () => {

  return (

    <Router>

      <Routes>

      <Route path="/" element={<LandingPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/upload-video" element={<UploadVideoPage />} />

      <Route path="/payment" element={<PaymentPage />} />

      <Route path="/success" element={<SuccessPage />} />

      </Routes>

    </Router>

  );

};



export default App;





