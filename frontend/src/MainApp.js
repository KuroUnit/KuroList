import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Drawer from './components/Drawer';
import { find_mangas, map_search, map_pagination } from './context/mangaSlice';
import {get_lists} from './context/listSlice'


function MainApp() {
  const dispatch = useDispatch(),
        pagination = useSelector(map_pagination),
        search = useSelector(map_search)
  
  useEffect(() => {
    const timer_id = setTimeout(() => {
      dispatch(find_mangas(pagination, search))
      dispatch(get_lists())
    }, (10));
    return () => clearTimeout(timer_id);
  }, [dispatch, pagination, search]);

  return <Drawer />
}

export default MainApp;

