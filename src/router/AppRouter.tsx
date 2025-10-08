// IMPORT REACT
import { Route, Routes } from "react-router-dom"

// IMPORT PAGES
import { HomePages } from "../FinTrack/pages/HomePages"
import { TransactionsPages } from "../FinTrack/pages/TransactionsPages"
import { GoalsPages } from "../FinTrack/pages/GoalsPages"
import { NotFound } from "../FinTrack/pages/NotFoundPages"

export const AppRouter = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePages />} />
      <Route path="/transactions" element={<TransactionsPages />} />
      <Route path="/goals" element={<GoalsPages />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}
