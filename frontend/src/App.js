import React, { useEffect } from 'react';
import './App.css';

import Drawer from './components/Drawer';
import LoginPage from './components/LoginPage'

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { find_mangas, map_search,map_pagination } from './context/mangaSlice';
import { useDispatch, useSelector } from 'react-redux';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const dispatch = useDispatch(),
        pagination = useSelector(map_pagination),
        search = useSelector(map_search)
  

  useEffect(() => {
    const timer_id = setTimeout(() => {
      dispatch(find_mangas(pagination, search))
    }, (10));
    return () => clearTimeout(timer_id);
  }, [dispatch, pagination, search]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Drawer />
    </ThemeProvider>
  )
}

export default App;

