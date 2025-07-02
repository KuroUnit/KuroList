import {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Tooltip, IconButton, Dialog, DialogTitle,
  DialogContent, FormControl, InputLabel, Select, MenuItem,
  DialogActions, Button, CircularProgress
} from '@mui/material';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

import { listActions, map_all_lists } from '../context/listSlice';
import { uiActions } from '../context/uiSlice';
import { get_cover_image, mangaActions } from '../context/mangaSlice';

export default function Card({ manga }) {
  const [openDialog, setOpenDialog] = useState(false),
        [selectedList, setSelectedList] = useState(''),
        [imageUrl, setImageUrl] = useState(null),
        [isLoadingImage, setIsLoadingImage] = useState(true),
        [imageError, setImageError] = useState(false);

        
  const lists =  useSelector(map_all_lists),
        dispatch = useDispatch()

  useEffect(() => {
    if (!manga.id || !manga.coverFileName) {
      setIsLoadingImage(false);
      setImageError(true);
      return;
    }

    let mounted = true

    const loadImage = async () => {
      try {
        const blobUrl = await dispatch(get_cover_image({mangaId: manga.id, fileName: manga.coverFileName}))
        if (mounted) setImageUrl(blobUrl)
        
      } catch (error) {
        if(mounted) setImageError(true);
      } finally {
        if(mounted) setIsLoadingImage(false);
      }

    }
    loadImage();
    // Evitando que as imagens fiquem prejudicando o desempenho da aplicação
    return () => {
      mounted = false
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manga.id, manga.coverFileName, dispatch])

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => setOpenDialog(false);

  const handleConfirmSave = () => {
    if (selectedList) {
      dispatch(listActions.set_manga_to_list({ listId: selectedList, newManga: manga }));
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
        {isLoadingImage ? (
          <CircularProgress color="inherit" />
        ) : imageError ? (
          <Tooltip title="Não foi possível carregar a imagem">
            <BrokenImageIcon sx={{ color: 'text.secondary', fontSize: 40 }} />
          </Tooltip>
        ) : (
          <img
            src={imageUrl}
            alt={manga.title + " Image"}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '8px' }}
          />
        )}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Salvar Mangá</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Escolha a lista</InputLabel>
            <Select value={selectedList} label="Escolha a lista" onChange={(e) => setSelectedList(e.target.value)}>
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
          <Button onClick={handleConfirmSave} disabled={!selectedList} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}