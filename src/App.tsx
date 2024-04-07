import React from 'react';
import "./globals.css"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import HomePage from './components/HomePage'
import GetStartedPage from './components/GetStartedPage';
import Tabs from './components/Deployement';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
    <Route path="/" element={<HomePage />}/>
    
    <Route path="/a" element={<GetStartedPage />} />

    <Route path="/b" element={<Tabs />} />
    
    </Route>
  ) 
);

const App: React.FC = () => {
  return (
    <RouterProvider router={router} />

  );
};

export default App;
