import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import React from 'react'
import ErrorPage from './pages/ErrorPage'
import Register from './pages/registerPage'
import LobbyPage from './pages/game/LobbyPage'
import LogoutPage from './pages/logoutPage'
import SettingsPage from './pages/game/settingsPage'
import LoginPage from './pages/loginPage'
import MainPage from './pages/game/mainPage'
import InventoryPage from './pages/game/inventoryPage'
import StorePage from './pages/game/storePage'
import NewsPage from './pages/game/newsPage'
import VerifyPage from './pages/verifyPage'
import { Analytics } from "@vercel/analytics/react"
import PlayPageID from './pages/game/lobbyPage[id]'
import GamePage from './pages/game/gamePage'
import LeaderboardPage from './pages/game/Leaderboard'
import TermsOfService from './pages/game/tos'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/leaderboard',
    element: <LeaderboardPage />,
  },
  {
    path: '/tos',
    element: <TermsOfService />,
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
    path: '/verify',
    element: <VerifyPage />,
  },
  {
    path: '/play/:id',
    element: <PlayPageID />,
  },
  {
    path: '/game/:id',
    element: <GamePage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <Analytics/>
    <RouterProvider router={router} />
  </React.Fragment>
)