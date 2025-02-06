import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import MainPage from './pages/MainPage'
import ErrorPage from './pages/ErrorPage'
import ForgotPassword from './pages/forgotPassword'
import Register from './pages/registerPage'
import LobbyPage from './pages/game/LobbyPage'
import LogoutPage from './pages/logoutPage'
import SettingsPage from './pages/game/settingsPage'


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
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
    path: '/game/lobby',
    element: <LobbyPage />,
  },
  {
    path: '/game/settings',
    element: <SettingsPage />,
  },
  {
    path: '/game',
    element: <MainPage />,
  },
  {
    path: '/logout',
    element: <LogoutPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)