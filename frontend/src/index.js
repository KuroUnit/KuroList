import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './context/store';
import App from './App';
import './index.css';

import { setInterceptors } from './axiosConfig';
setInterceptors(store);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

