import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProjectsPage from '../pages/ProjectsPage'
import HomePage from '../pages/HomePage'
import CreateGroupPage from '../pages/CreateGroupPage'
import GroupPage from '../pages/GroupPage'
import AddExpensePage from '../pages/AddExpensePage'

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/a-mitges">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projectes" element={<ProjectsPage />} />
        <Route path="/crear-grup" element={<CreateGroupPage />} />
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/group/:groupId/afegir-despesa" element={<AddExpensePage />} />
      </Routes>
    </BrowserRouter>
  )
}