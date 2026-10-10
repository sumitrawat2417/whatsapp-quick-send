import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// We grab the <div id="root"> from index.html
const rootElement = document.getElementById('root');

// We tell React to take control of that div and render our App component inside it
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
