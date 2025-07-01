import * as React from 'react';
import { Alert, InputBase, Box, styled, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { mangaActions, map_search } from '../context/mangaSlice';
import { useDispatch, useSelector } from 'react-redux';
import { errorActions, map_error } from '../context/errorSlice';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.85),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.48),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(5),
    width: '60%',
    float: 'right'
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


export default function SearchBar() {
  const dispatch = useDispatch(),
        search = useSelector(map_search),
        error = useSelector(map_error)

  React.useEffect(()=>{
    if(error) {
      console.log(error)
      const timer_id = setTimeout(()=>{
        dispatch(errorActions.set_error(null))
      }, [5000])
      return ()=> clearTimeout(timer_id)
    }
  })
  
  const handleSearch = (ev) => {
    let value = ev.target.value.trim()
    if (value !== search){
      if(value === '') {
        dispatch(mangaActions.set_search(''));
        dispatch(errorActions.set_error("Search field must not be empty. Enter a value!"))
      }
      else {
        dispatch(mangaActions.set_search(value));
        dispatch(errorActions.set_error(null))
      }
    }
    dispatch(mangaActions.set_pagination({ offset: 0 }));
  };
  
  
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end'}}>
      {error &&
        <Alert severity='error'>{error}</Alert>
      }
      <Search 
        onChange={ev=>handleSearch(ev)} 
        onFocus={ev => ev.target.value === '' && dispatch(errorActions.set_error("Search field must not be empty. Enter a value!"))}
        onBlur={ev => ev.target.value === '' && dispatch(errorActions.set_error(null))}
      >
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          sx={{height:50}}
        />
      </Search>
    </Box>
  );
}
