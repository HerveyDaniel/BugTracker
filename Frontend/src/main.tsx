import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const client = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={client}>
      <AuthProvider> 
        <Routes>
          <Route path="/*" element={<App />}/>
        </Routes>
      </AuthProvider>
      </QueryClientProvider>
    </Router>
  </StrictMode>,
)
