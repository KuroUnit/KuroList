import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { useDispatch, useSelector } from 'react-redux';
import { listAction, map_lists } from '../context/listSlice';

export default function Card({ manga }) {
  const [open, setOpen] = React.useState(false);
  const [selectedList, setSelectedList] = React.useState({name: '', id: 0}),
  lists =  useSelector(map_lists),
  dispatch = useDispatch()

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSelectedList('');
    setOpen(false);
  };

  const handleConfirm = (listId, manga) => {
    dispatch(listAction.set_manga_to_list({listId: listId, newManga: manga}))
    handleClose();
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
        <IconButton onClick={handleOpen}>
          <BookmarkBorderIcon />
        </IconButton>
      </Box>
      <Box sx={{ width: '100%', height: 250 }}>
        <img
          src={manga.coverUrl}
          alt="Imagem"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            borderRadius: '8px'
          }}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Salve Manga</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="select-lista-label">Choose the list</InputLabel>
            <Select
              labelId="select-lista-label"
              value={selectedList.name}
              label="Choose the list"
              onChange={(e) => setSelectedList({name: e.target.value, id: e.explicitOriginalTarget.id})}
            >
              {lists.map((list) => (
                <MenuItem id={list.id} key={list.name} value={list.name}>
                  {list.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={(e)=>handleConfirm(Number(selectedList.id), manga)} disabled={!selectedList.name} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
