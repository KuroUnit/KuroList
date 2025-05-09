import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';

import Card from './Card';
import { map_mangas } from '../context/mangaSlice';

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
  const mangas = useSelector(map_mangas)
  return (
    <Box sx={{ flexGrow: 1 }} height='100%'>
      <Grid container spacing={{ xs: 1, md: 1, xl: 2 }}>
        {mangas.map((manga, index) => (
          <Grid key={index} width={'192px'} flexWrap='wrap'>
            <Item>
              <Card manga={manga}/>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
    
  );
}
