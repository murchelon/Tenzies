import React from 'react';
import ReactDOM from 'react-dom/client';
import Tenzies from './Components/Tenzies/Tenzies';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Tenzies />
  </React.StrictMode>
);

