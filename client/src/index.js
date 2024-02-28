import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/styles.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Game1 from './pages/Level1';
import Collision from './components/Collision'
// import Testing from './components/Testing';
import Phase from './components/Phase';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  // { path: '/game1', element: <Game1 /> },
  { path: '/game1', element: <Phase /> },
  { path: '/collision', element: <Collision /> },
  // { path: '/testing', element: <Testing /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
