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
import GameOver from './components/GameOver';
import GameContext from './pages/GameContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Leaderboard from './pages/Leaderboard';

const router = createBrowserRouter([
  { path: '/', element: <Register /> },
  { path: '/login', element: <Login /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: 'leaderboard', element: <Leaderboard />},
  { path: '/gameOver', element: <GameOver /> },
  { path: '/game1', element: <Enemies /> },
  { path: '/phase', element: <Phase /> },
  { path: '/collision', element: <Collision /> },
  { path: '/gameover', element: <GameOver /> },
  { path: '/level1', element: <Level1 /> },
  { path: '/level2', element: <Level2 /> },
  { path: '/level3', element: <Level3 /> },
  { path: '/test', element: <GameContext /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
