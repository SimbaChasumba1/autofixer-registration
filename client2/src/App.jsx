import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import UploadVideoPage from "./pages/UploadVideoPage";
import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";

function App() {
return (
<BrowserRouter>
<Routes>

<Route
path="/"
element={<LandingPage />}
/>

<Route
path="/register"
element={<RegisterPage />}
/>

<Route
path="/terms"
element={<TermsAndConditionsPage />}
/>

<Route
path="/upload-video"
element={<UploadVideoPage />}
/>

<Route
path="/payment"
element={<PaymentPage />}
/>

<Route
path="/success"
element={<SuccessPage />}
/>

</Routes>
</BrowserRouter>
);
}

export default App;
