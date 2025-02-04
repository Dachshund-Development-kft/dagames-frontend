import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import MainPage from './pages/MainPage'
import ErrorPage from './pages/ErrorPage'
import LoginPage from './pages/loginPage'
import ForgotPassword from './pages/forgotPassword'
import Register from './pages/registerPage'
import AboutUsPage from './pages/aboutUsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/about-us',
    element: <AboutUsPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)