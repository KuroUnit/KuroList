import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { mangaActions, map_pagination, map_total } from '../context/mangaSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function PaginationRounded() {
  const pagination = useSelector(map_pagination)
  const total = useSelector(map_total)
  const dispatch = useDispatch();
  
  const totalPages = Math.ceil(total / 48)
  
  const setOffset = (ev, value)=>{
    let offset = (value - 1) * pagination.limit,
        limit = 48
    if (offset+pagination.limit > total){
      limit = (total - offset)
    }
    // dispatch(mangaActions.set_search(''));
    dispatch(mangaActions.set_pagination({limit: limit, offset: offset}))
  }

  return (
    <Stack spacing={2} marginBottom='20px'>
      <Pagination count={totalPages} variant="outlined" shape="rounded"
      onChange={(ev, value) => setOffset(ev, value)} sx={{
          '& .MuiPaginationItem-root': {
            color: 'rgb(255, 255, 255)',
            borderColor: 'rgba(224, 224, 224, 0.7)',
          },'& .MuiPaginationItem-root:hover': {
            backgroundColor: 'rgba(116, 116, 116, 0.7)',
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'rgba(224, 224, 224, 0.7)',
            color: 'rgb(255, 255, 255)', 
            borderColor: 'rgba(224, 224, 224, 0.7)',
          },
          '& .MuiPaginationItem-root.Mui-selected:hover': {
            backgroundColor: 'rgba(116, 116, 116, 0.7)',
          },
        }}/>
    </Stack>
  );
}