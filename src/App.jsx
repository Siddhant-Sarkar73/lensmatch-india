import { createHashRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom'
import { CompareProvider } from './hooks/useCompare'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import LensDetail from './pages/LensDetail'
import Quiz from './pages/Quiz'
import Rent from './pages/Rent'
import Learn from './pages/Learn'
import Compare from './pages/Compare'

// Root layout — wraps every page with Navbar + Footer
function RootLayout() {
  return (
    <div className="min-h-screen bg-cream font-sans text-brown flex flex-col">
      <ScrollRestoration />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,          element: <Home /> },
      { path: 'lenses',       element: <Catalogue /> },
      { path: 'lens/:id',     element: <LensDetail /> },
      { path: 'find',         element: <Quiz /> },
      { path: 'rent',         element: <Rent /> },
      { path: 'learn',        element: <Learn /> },
      { path: 'learn/:slug',  element: <Learn /> },
      { path: 'compare',      element: <Compare /> },
    ],
  },
])

export default function App() {
  return (
    <CompareProvider>
      <RouterProvider router={router} />
    </CompareProvider>
  )
}
