import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter } from 'react-router-dom'
import {Toaster} from "react-hot-toast";
import {AuthProvider} from "@/context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
            <Toaster/>
            <App />
        </AuthProvider>
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
