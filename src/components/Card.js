import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export default function Card({manga}) {
  return (
    <Box sx={{borderRadius: '8px'}} >
      <Typography variant="h5" 
        sx={{ 
          color: 'text.secundary',
          fontSize: 15,
          width: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          padding: '8px'
        }}>
        {manga.title}
      </Typography>
      <Box sx={{width: '100%',height: 250,}}>
        <img src={manga.coverUrl} alt="Imagem" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            borderRadius: '8px'
        }} />
      </Box>
    </Box>
  );
}
