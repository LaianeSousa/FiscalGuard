import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../layout/Layout'
import Dashboard from '../pages/Dashboard'
import Upload from '../pages/Upload'
import Auditoria from '../pages/Auditoria'
import Fechamento from '../pages/Fechamento'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'upload',
        element: <Upload />,
      },
      {
        path: 'auditoria',
        element: <Auditoria />,
      },
      {
        path: 'fechamento',
        element: <Fechamento />,
      },
    ],
  },
])
