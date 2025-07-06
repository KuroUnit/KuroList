import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Box, Button, Modal, TextField, Paper, Grid, Typography, IconButton, Alert, Tooltip, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


import {
  listActions,
  get_lists,
  create_list,
  delete_list,
  update_list,
  map_all_lists,
  map_list_status,
  map_list_error,
  map_selected_list,
  map_list_msg,
} from '../context/listSlice';

import { map_open_create_list, map_open_list, uiActions } from '../context/uiSlice';
import AuthenticatedImage from './AuthenticatedImage';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#050505',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  borderRadius: '8px',
  border: '2px solid #857e7e85'
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function GridLists() {
  const dispatch = useDispatch();

  const lists = useSelector(map_all_lists),
        listStatus = useSelector(map_list_status),
        listError = useSelector(map_list_error),
        selectedList = useSelector(map_selected_list),
        successMensage = useSelector(map_list_msg),
        isCreateListModalOpen = useSelector(map_open_create_list),
        isDetailsModalOpen = useSelector(map_open_list);
  
  const [newListName, setNewListName] = useState('');
  
  useEffect(() => {
    if (listStatus === 'idle') {
      dispatch(get_lists());
    }
  }, [listStatus, dispatch]);

  useEffect(() => {
    if (successMensage) {
      const timer_id = setTimeout(() => {
        dispatch(listActions.set_message(""));
      }, 3000);
      return () => clearTimeout(timer_id);
    }
  }, [dispatch, successMensage]);

  const handleOpenCreateModal = () => dispatch(uiActions.open_create_list());
  const handleCloseCreateModal = () => dispatch(uiActions.close_create_list());

  const handleOpenDetailsModal = (listId) => {
    dispatch(listActions.set_selected_list_id(listId));
    dispatch(uiActions.open_list());
  };
  
  const handleCloseDetailsModal = () => {
    dispatch(listActions.clear_selected_list_id());
    dispatch(uiActions.close_list());
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      dispatch(create_list({ name: newListName }));
      setNewListName('');
      handleCloseCreateModal();
    }
  };

  const handleDeleteList = (listId) => {
    dispatch(delete_list(listId));
  };
  
  const handleDeleteMangaFromList = (listId, mangaId) => {
    dispatch(update_list(listId, mangaId, "remove"));
  };


  if (listStatus === 'loading' && lists.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (listStatus === 'failed') {
    return <Alert severity="error">Erro ao carregar as listas: {listError}</Alert>;
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '84vh' }}>
      {successMensage && <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(listActions.set_message(''))}>{ successMensage }</Alert>}

      <Button variant="contained" sx={{ mb: 2 }} onClick={handleOpenCreateModal}>
        Criar Nova Lista
      </Button>

      <Modal open={isCreateListModalOpen} onClose={handleCloseCreateModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Nova Lista</Typography>
          <TextField autoFocus margin="dense" label="Nome da Lista" fullWidth variant="standard" value={newListName} onChange={(e) => setNewListName(e.target.value)} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseCreateModal}>Cancelar</Button>
            <Button onClick={handleCreateList} variant="contained" sx={{ ml: 1 }}>Criar</Button>
          </Box>
        </Box>
      </Modal>
      
      <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {lists.map((list) => (
          <Grid item xs={4} key={list.id}>
            <Item onClick={() => handleOpenDetailsModal(list.id)}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '384px'}}>
                <Typography variant='h5' noWrap>{list.name}</Typography>
                <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }}>
                  <DeleteIcon sx={{color: "rgb(240, 88, 88)"}}/>
                </IconButton>
              </Box>
              <Box sx={{ height: '170px', mt: 2, mb: 1}}>
                {list.mangas.length === 0 ?
                  <Typography variant="body2" sx={{ color: 'gray' }}>Lista vazia</Typography>
                :
                  <Box sx={{ display: 'flex', mt: 1.5, gap: 1, overflow: 'hidden' }}>
                    {list.mangas.slice(0, 3).map(manga => (
                      <Box sx={{ height: 160, width: 115, flexShrink: 0 }}>
                        <Tooltip title={manga.title}><AuthenticatedImage mangaId={manga.id} fileName={manga.coverFileName} alt={manga.title} /></Tooltip>
                      </Box>
                    ))}
                    {list.mangas.length > 3 && <Typography sx={{ alignSelf: 'center' }}>...</Typography>}
                  </Box>
                }
              </Box>
            </Item>
          </Grid>
        ))}
      </Grid>

      <Modal open={isDetailsModalOpen} onClose={handleCloseDetailsModal}>
        <Box sx={{ ...modalStyle, width: 500, maxHeight: '80vh', overflowY: 'auto' }}>
          {selectedList ? (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>{selectedList.name}</Typography>
              {selectedList.mangas.length === 0 ?
                <Typography variant="body2" color="text.secondary">Esta lista está vazia.</Typography>
              : 
                selectedList.mangas.map(manga => (
                  <Box key={manga.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 100, height: 150, flexShrink: 0 }}>
                        <AuthenticatedImage mangaId={manga.id} fileName={manga.coverFileName} alt={manga.title} />
                      </Box>
                      <Tooltip title={manga.title}>
                        <Typography variant="body1" noWrap 
                          sx={{
                            color: 'text.secondary',
                            fontSize: 15,
                            width: '200px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            padding: '8px',
                            cursor: 'default'
                          }}
                        >
                          {manga.title}
                        </Typography>
                      </Tooltip>
                    </Box>
                    <IconButton color="error" size="small" onClick={() => handleDeleteMangaFromList(selectedList.id, manga.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))
              }
            </>
          ) : <p>Carregando...</p>}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDetailsModal}>Fechar</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}