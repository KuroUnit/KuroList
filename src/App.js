import React, { useEffect } from 'react';
import './App.css';

import Drawer from './components/Drawer';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { find_mangas } from './context/mangaSlice';
import { useDispatch } from 'react-redux';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const timer_id = setTimeout(() => {
      dispatch(find_mangas())
    }, (1000*1));
    return () => clearTimeout(timer_id);
  }, [dispatch]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Drawer />
    </ThemeProvider>
  )
}

export default App;

