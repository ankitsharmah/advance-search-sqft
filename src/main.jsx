import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { PropertySearchSuggestions } from './PropertysearchSuggestions.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PropertySearchSuggestions/>
  </StrictMode>,
)
