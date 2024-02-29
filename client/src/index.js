import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/styles.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Collision from './components/Collision';
import Phase from './components/Phase';
import Enemies from './components/Enemies';
import Level1 from './components/PhaseL1';
import Level2 from './components/PhaseL2';
import Level3 from './components/PhaseL3';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/game1', element: <Enemies /> },
  { path: '/collision', element: <Collision /> },
  { path: '/level1', element: <Level1 /> },
  { path: '/level2', element: <Level2 /> },
  { path: '/level3', element: <Level3 /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
