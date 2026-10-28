import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { makeStore } from './app/store.js'
import { ROUTER_FUTURE } from './app/router.js'
import './styles.css'

const store = makeStore()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* BASE_URL is "/shopsphere/" in production, so routes work on GitHub Pages */}
      <BrowserRouter basename={import.meta.env.BASE_URL} future={ROUTER_FUTURE}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
