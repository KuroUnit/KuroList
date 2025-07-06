import {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Tooltip, IconButton, Dialog, DialogTitle,
  DialogContent, FormControl, InputLabel, Select, MenuItem,
  DialogActions, Button
} from '@mui/material';

import AuthenticatedImage from './AuthenticatedImage';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import { update_list, map_all_lists, get_lists } from '../context/listSlice';
import { uiActions } from '../context/uiSlice';

export default function Card({ manga }) {
  const dispatch = useDispatch();
  const lists =  useSelector(map_all_lists)

  const [openDialog, setOpenDialog] = useState(false),
        [selectedListId, setSelectedListId] = useState('');

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedListId('');
  };

  const handleConfirmSave = () => {
    if (selectedListId) {
      dispatch(update_list(selectedListId, manga.id, "add"));
      dispatch(uiActions.set_alert(true));
    }
    handleCloseDialog();
  };

  return (
    <Box sx={{ borderRadius: '8px' }}>
      <Box sx={{ display: 'flex' }}>
        <Tooltip title={manga.title}>
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              fontSize: 15,
              width: '100%',
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
        <IconButton onClick={handleOpenDialog}>
          <BookmarkBorderIcon />
        </IconButton>
      </Box>

      <Box sx={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#333', borderRadius: '8px' }}>
        <AuthenticatedImage
          mangaId={manga.id}
          fileName={manga.coverFileName}
          alt={manga.title + " Image"}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Salvar Mangá</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Escolha a lista</InputLabel>
            <Select
              value={selectedListId}
              label="Escolha a lista"
              onChange={(e) => setSelectedListId(e.target.value)}
            >
              {lists.map((list) => (
                <MenuItem key={list.id} value={list.id}>
                  {list.name}
                </MenuItem>
              ))}
            </Select>

          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmSave} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}