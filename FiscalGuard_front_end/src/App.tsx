import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import { router } from './routes/routes';

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  );
};

export default App;