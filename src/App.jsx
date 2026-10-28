import { Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" className="container">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="footer container">
        Demo project by <a href="https://devhashaam.github.io/">Muhammad Hashaam</a> · Data from{' '}
        <a href="https://dummyjson.com/">DummyJSON</a> · No real orders are placed.
      </footer>
    </>
  )
}
