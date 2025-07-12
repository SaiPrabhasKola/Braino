import "./index.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"



export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/home" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
}