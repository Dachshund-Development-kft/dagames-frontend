import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import ErrorPage from './pages/ErrorPage'
import ForgotPassword from './pages/forgotPassword'
import Register from './pages/registerPage'
import LobbyPage from './pages/game/LobbyPage'
import LogoutPage from './pages/logoutPage'
import SettingsPage from './pages/game/settingsPage'
import LoginPage from './pages/loginPage'
import MainPage from './pages/game/mainPage'
import InventoryPage from './pages/game/inventoryPage'
import StorePage from './pages/game/storePage'
import NewsPage from './pages/game/newsPage'



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
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/play',
    element: <LobbyPage />,
  },
  {
    path: '/shop',
    element: <StorePage />,
  },
  {
    path: '/news',
    element: <NewsPage />,
  },
  {
    path: '/inventory',
    element: <InventoryPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
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