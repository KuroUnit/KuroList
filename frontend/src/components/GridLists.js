import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Box, Button, Modal, TextField, Paper, Grid, Typography, IconButton, Alert, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { 
  listActions, 
  map_all_lists, 
  map_list_status, 
  map_list_error, 
  map_selected_list,
  get_lists,
  create_list, 
} from '../context/listSlice';
import { map_open_create_list, map_open_list, uiActions } from '../context/uiSlice';

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#050505',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   color: (theme.vars ?? theme).palette.text.secondary,
//   borderRadius: '8px',
//   border: '2px solid #857e7e85'
// }));

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
// };

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

  // --- Seletores para ler o estado do Redux ---
  const lists = useSelector(map_all_lists),
        listStatus = useSelector(map_list_status),
        listError = useSelector(map_list_error),
        isCreateListModalOpen = useSelector(map_open_create_list),
        isDetailsModalOpen = useSelector(map_open_list),
        selectedList = useSelector(map_selected_list);

  const [newListName, setNewListName] = useState(''),
        [showSuccessAlert, setShowSuccessAlert] = useState(false);


  useEffect(() => {
    if (listStatus === 'idle') {
      dispatch(get_lists());
    }
  }, [listStatus, dispatch]);
  
  useEffect(() => {
    if (listStatus === 'succeeded' && isCreateListModalOpen === false) {
      setShowSuccessAlert(true);
      const timer_id = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      return () => clearTimeout(timer_id);
    }
  }, [lists, listStatus, isCreateListModalOpen]);

  const handleOpenCreateModal = () => dispatch(uiActions.open_create_list());
  const handleCloseCreateModal = () => dispatch(uiActions.close_create_list());

  const handleCreateList = () => {
    if (newListName.trim()) {
      dispatch(create_list({ name: newListName }));
      setNewListName('');
      handleCloseCreateModal();
    }
  };

  const handleOpenDetailsModal = (listId) => {
    dispatch(listActions.set_selected_list_id(listId));
    dispatch(uiActions.open_list());
  };

  const handleCloseDetailsModal = () => {
    dispatch(listActions.clear_selected_list_id());
    dispatch(uiActions.close_list());
  };
  
  const handleDeleteList = (listId) => {
    // dispatch(delete_list(listId));
  };
  const handleDeleteMangaFromList = (listId, mangaid) => {
    // dispatch(delete_manga_list(listId));
  }

  if (listStatus === 'loading' && lists.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (listStatus === 'failed') {
    return <Alert severity="error">Erro ao carregar as listas: {listError}</Alert>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {showSuccessAlert && <Alert severity="success" sx={{ mb: 2 }}>Lista criada com sucesso!</Alert>}

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

      <Modal open={isDetailsModalOpen} onClose={handleCloseDetailsModal}>
        <Box sx={modalStyle}>
          {selectedList ? (
            <>
              <Typography variant="h6">{selectedList.name}</Typography>
                <Box sx={{ mt: 2, maxHeight: 400, overflowY: 'auto', pr: 2 }}>
                {selectedList.mangas.length === 0 ? (
                  <Typography>Nenhum mangá foi adicionado a esta lista ainda.</Typography>
                ) : (
                  selectedList.mangas.map((manga) => (
                    <Box 
                      key={manga.id} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        mb: 2 
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          sx={{ width: 50, height: 75, objectFit: 'cover', borderRadius: 1 }}
                          src={manga.coverUrl}
                          alt={manga.title}
                        />
                        <Typography variant="body1" sx={{ maxWidth: 200 }} noWrap>
                          {manga.title}
                        </Typography>
                      </Box>
                      
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteMangaFromList(selectedList.id, manga.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))
                )}
              </Box>
              {selectedList.mangas.length === 0 ? <p>Nenhum mangá nesta lista.</p> : <p>{selectedList.mangas.length} mangás.</p>}
            </>
          ) : <p>Carregando...</p>}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDetailsModal}>Fechar</Button>
          </Box>
        </Box>
      </Modal>

      <Grid container spacing={3}>
        {lists.map((list) => (
          <Grid item key={list.id} xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 200, cursor: 'pointer' }} onClick={() => handleOpenDetailsModal(list.id)}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" noWrap>{list.name}</Typography>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Box sx={{ flexGrow: 1, mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {list.mangas.length} mangá(s) na lista.
                </Typography>
                <Box sx={{ display: 'flex', mt: 1.5, gap: 1, overflow: 'hidden' }}>
                  {list.mangas.slice(0, 4).map((manga) => (
                    <Box
                      key={manga.id}
                      component="img"
                      sx={{
                        width: 40,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                      src={manga.coverUrl}
                      alt={manga.title}
                    />
                  ))}
                  {list.mangas.length > 4 && (
                    <Typography sx={{ alignSelf: 'center', ml: 0.5 }}>...</Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}