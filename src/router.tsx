import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import MyShelf from './pages/MyShelf'
import ItemRegister from './pages/ItemRegister'
import UsageHistory from './pages/UsageHistory'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'shelf',
        element: <MyShelf />,
      },
      {
        path: 'register',
        element: <ItemRegister />,
      },
      {
        path: 'history',
        element: <UsageHistory />,
      },
      {
        path: 'edit/:id',
        element: <ItemRegister />,
      },
    ],
  },
])
