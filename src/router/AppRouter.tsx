// IMPORT REACT
import { Route, Routes, Navigate } from "react-router-dom"

// IMPORT PAGES
import { HomePages } from "../FinTrack/pages/HomePages"
import { TransactionsPages } from "../FinTrack/pages/TransactionsPages"
import { GoalsPages } from "../FinTrack/pages/GoalsPages"
import { NotFound } from "../FinTrack/pages/NotFoundPages"
import { LoginPages } from "../authentication/pages/LoginPages"
import { RegisterPages } from "../authentication/pages/RegisterPages"

import { useAuth } from "../authentication/hooks/useAuth"
import { ProtectedRoute } from "../authentication/components/ProtectedRoute"


export const AppRouter = () => {
    const { authState } = useAuth();

  return (
    <>
    <Routes>
      <Route path="/login" element={authState.logged ? <Navigate to="/" replace /> : <LoginPages />} />
      <Route path="/register" element={authState.logged ? <Navigate to="/" replace /> : <RegisterPages />} />
      <Route path="/" element={<ProtectedRoute><HomePages /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><TransactionsPages /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><GoalsPages /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}
