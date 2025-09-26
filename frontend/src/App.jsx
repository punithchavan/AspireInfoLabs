import { Routes, Route } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterPage";
import { CheckEmailPage } from "./pages/CheckEmailPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { CompleteProfilePage } from "./pages/CompleteProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { WelcomePage } from "./pages/WelcomePage";
import { HomePage } from "./pages/HomePage";

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/home" element={<HomePage />}/>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/check-email" element={<CheckEmailPage />}/>
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/complete-profile" element={<CompleteProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
