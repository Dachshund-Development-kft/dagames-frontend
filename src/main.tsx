import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)