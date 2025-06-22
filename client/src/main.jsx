import axios from 'axios'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import './index.css'
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
        <App />
    </AppContextProvider>
  </BrowserRouter>,
)
