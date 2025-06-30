import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';

import { useDispatch, useSelector } from 'react-redux';
import { listActions, map_selected_list, map_lists, map_current_list } from '../context/listSlice';
import { Alert, TextField, Tooltip, Typography } from '@mui/material';
import { map_alert, map_open_create_list, map_open_list, uiActions } from '../context/uiSlice';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#050505',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: (theme.vars ?? theme).palette.text.secondary,
  borderRadius: '8px',
  border: '2px solid #857e7e85'
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function ResponsiveGrid() {
  const dispatch = useDispatch(),
        lists = useSelector(map_lists),
        selectedList = useSelector(map_selected_list),
        currentList = useSelector(map_current_list),
        openList = useSelector(map_open_list),
        openCreateList = useSelector(map_open_create_list),
        alert = useSelector(map_alert)
        
  React.useEffect(() => {
    if(alert){
      const timer_id = setTimeout(() => {
        dispatch(uiActions.set_alert(false))
      }, (3000));
      return () => clearTimeout(timer_id);
    }
  })

  const handleOpenList = (list) => {
    dispatch(listActions.set_selected_list(list.id));
    dispatch(uiActions.open_list());
  };
  
  const handleCloseList = () => {
    dispatch(uiActions.close_list());
    dispatch(listActions.clear_selected_list());
  };  

  const handleDeleteManga = (mangaId) => {
    if (selectedList) {
      dispatch(listActions.del_manga_from_list({ listId: selectedList.id, mangaId }));
      updateList(selectedList.id)
      console.log(selectedList)
    }
  };
  const updateList = (listId) => {
    dispatch(listActions.set_selected_list(listId))
  }
  const handleDeleteList = (listId) => {
    dispatch(listActions.del_list(listId));
    if (selectedList?.id === listId){
      dispatch(uiActions.close_list())
      dispatch(listActions.clear_selected_list())
    }
  };  

  const handleCreateList = () => {
    const newList = { id: Date.now(), name: currentList, mangas: [] };
    dispatch(listActions.clear_current_list())
    dispatch(listActions.set_list(newList));
    if(lists.find(list => list.id === newList.id)){
    }
    dispatch(uiActions.set_alert(true))
    dispatch(uiActions.close_create_list())
  };

  

  return (
    <Box sx={{ flexGrow: 1, minHeight: '84vh' }}>
      {alert && (
        <Alert
          severity="success"
          onClose={() => dispatch(uiActions.set_alert(false))}
          sx={{ mb: 2, mt: 2, borderRadius: 10 }}
        >
           List created successfully
        </Alert>
      )}
      <Button variant="contained" sx={{marginBottom: '10px'}} onClick={()=>dispatch(uiActions.open_create_list())}>Create New List</Button>
      <Modal open={openCreateList} onClose={()=>dispatch(uiActions.close_create_list())}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 200,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Box
            component="form"
            sx={{ m: 3, display:'flex', alignItems: 'end' }}
            noValidate
            autoComplete="off"
          >
            <TextField id="standard-basic" label="List Name" variant="standard" sx={{width: '300px'}} value={currentList} onChange={(ev)=>dispatch(listActions.set_current_list(ev.target.value))}/>
            <Button variant="contained" sx={{height: '36px', marginLeft: '20px' }} onClick={()=>handleCreateList()}>Create</Button>
          </Box>
        </Box>
      </Modal>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {lists.map((list) => (
          <Grid item xs={4} key={list.id} width='480px' flexWrap='wrap'>
            <Item onClick={() => handleOpenList(list)}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Typography variant='h5' noWrap>{list.name}</Typography>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                color="error"
                onClick={(ev) => {
                  ev.stopPropagation();
                  handleDeleteList(list.id);
                }}
              >
                Delete
              </Button>
            </Box>
            <Box height='300px'>
              {list.mangas.length === 0 ? 
                <Typography variant="body2" sx={{ color: 'gray' }}>Empty List</Typography>
              :
                list.mangas.slice(0, 3).map(manga => (
                  <Box key={manga.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <img src={manga.coverUrl} alt={manga.title+" Image"} style={{ width: 50, height: 75, objectFit: 'cover', borderRadius: 4, marginRight: 8 }} />
                    <Typography variant="body2" noWrap>{manga.title}</Typography>
                  </Box>
                )
              )}
            </Box>

            </Item>
          </Grid>
        ))}
      </Grid>

      <Modal open={openList} onClose={handleCloseList}>
        <Box sx={{ ...style, maxHeight: '80vh', overflowY: 'auto' }}>
          {selectedList ?
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>{selectedList.name}</Typography>
              {selectedList.mangas.length === 0 ?
                <Typography variant="body2" color="text.secondary">Empty List</Typography>
              : 
                selectedList.mangas.map(manga => (
                  <Box key={manga.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={manga.coverUrl}
                        alt={manga.title+" Image"}
                        style={{ width: 50, height: 75, objectFit: 'cover', borderRadius: 4, marginRight: 8 }}
                      />
                      <Tooltip title={manga.title}>
                        <Typography variant="body1" noWrap sx={{
                          color: 'text.secondary',
                          fontSize: 15,
                          width: '200px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          padding: '8px',
                          cursor: 'default'
                        }}
                        >{manga.title}</Typography>
                      </Tooltip>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{float: 'right'}}
                      onClick={() => handleDeleteManga(manga.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                ))
              }
            </>
          : 
            <Typography variant="body2" color="text.secondary">Loading List...</Typography>
          }
        </Box>
      </Modal>

    </Box>
  );
}
