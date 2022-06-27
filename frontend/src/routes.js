import React from 'react'
import { Navigate } from 'react-router-dom'
import MainLayout from 'src/layouts/MainLayout'
import MinimalLayout from 'src/layouts/MinimalLayout'
import DashboardPage from 'src/pages/dashboard'
import ProfilePage from 'src/pages/profile'
import NotFoundPage from 'src/pages/errors/NotFoundPage'
import History from 'src/pages/history'
import Settings from 'src/pages/settings'
import NoLayout from './layouts/NoLayout'
import SignIn from './pages/signIn/signIn'
import Config from './pages/configuration'

const guard = (component) => (localStorage.getItem('accessToken') ? component : <Navigate to="/signIn"/>)

const routes = [
  {
    path: 'app',
    element: <MainLayout/>,
    children: [
      { path: 'dashboard', element: guard(<DashboardPage/>) },
      { path: 'profile', element: guard(<ProfilePage/>) },
      { path: 'history', element: guard(<History/>) },
      { path: 'config', element: guard(<Config/>) },
      { path: 'settings', element: guard(<Settings/>) },
      { path: '*', element: <Navigate to="/not-found"/> },
    ],
  },
  {
    path: '/',
    element: <MinimalLayout/>,
    children: [
      { path: 'not-found', element: <NotFoundPage/> },
      { path: '/', element: <Navigate to="/app/dashboard"/> },
      { path: '*', element: <Navigate to="/not-found"/> },
    ],
  },
  {
    path: '/',
    element: <NoLayout/>,
    children: [
      { path: 'signin', element: <SignIn/> },
    ],
  },
]

export default routes
