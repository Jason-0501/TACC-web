import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Set from './set';
import ResourceList from './ResourceList'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path='set' element={<Set />}/>
          <Route path='resource' element={<ResourceList />}/>
          <Route index element={<App />}/>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
)
