import React, {useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';

import Card from './Card';
import { map_mangas } from '../context/mangaSlice';
import { Alert } from '@mui/material';
import PaginationRounded from './Pagination';

import { listActions, map_list_msg } from '../context/listSlice';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#050505',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: (theme.vars ?? theme).palette.text.secondary,
  height: '310px',
  borderRadius: '8px',
  border: '2px solid #857e7e85'
}));


export default function MangasGrid() {
  const dispatch = useDispatch(),
        mangas = useSelector(map_mangas),
        successMensage = useSelector(map_list_msg)

  useEffect(() => {
      if (successMensage) {
        const timer_id = setTimeout(() => {
          dispatch(listActions.set_message(""));
        }, 3000);
        return () => clearTimeout(timer_id);
      }
    }, [dispatch, successMensage]);
  return (
    <Box sx={{ flexGrow: 1 }} height='100%'>
      {successMensage && <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(listActions.set_message(''))}>{ successMensage }</Alert>}
      <Box>
        <PaginationRounded />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', }}>
          {mangas.map((manga) => (
            <Box key={manga.id} sx={{ width: 192,  m:1}}>
              <Item>
                <Card manga={manga} />
              </Item>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
    
  );
}
