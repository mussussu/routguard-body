import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))
root.render(<App />)

// Register SW with build version to force update on deploys
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // __BUILD_ID__ is injected by Vite at build time
    navigator.serviceWorker
      .register(`/service-worker.js?v=${__BUILD_ID__}`)
      .catch(console.error)
  })
}
