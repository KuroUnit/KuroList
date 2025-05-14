import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';

import Card from './Card';
import { map_mangas } from '../context/mangaSlice';
import { Alert } from '@mui/material';
import { map_alert, uiActions } from '../context/uiSlice';
import PaginationRounded from './Pagination';

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
        alert = useSelector(map_alert)

  React.useEffect(() => {
    if(alert){
      const timer_id = setTimeout(() => {
        dispatch(uiActions.set_alert(false))
      }, (3000));
      return () => clearTimeout(timer_id);
    }
  })
  return (
    <Box sx={{ flexGrow: 1 }} height='100%'>
      {alert && (
        <Alert
          severity="success"
          onClose={() => dispatch(uiActions.set_alert(false))}
          sx={{ mb: 2, mt: 2, borderRadius: 10 }}
        >
          Manga added successfully
        </Alert>
      )}
      <Box>
        <PaginationRounded />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', }}>
          {mangas.map((manga, index) => (
            <Box key={index} sx={{ width: 192,  m:1}}>
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
