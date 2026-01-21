import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Landing } from '@/pages/Landing'
import { EditorPage } from '@/pages/EditorPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
