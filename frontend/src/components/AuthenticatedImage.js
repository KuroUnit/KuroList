import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, CircularProgress, Tooltip } from '@mui/material';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

import { get_cover_image } from '../context/mangaSlice';

export default function AuthenticatedImage({ mangaId, fileName, alt, ref, ...otherProps}) {
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    if (!mangaId || !fileName) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const loadImage = async () => {
      try {
        const blobUrl = await dispatch(get_cover_image({ mangaId, fileName }));
        if (isMounted.current) setImageUrl(blobUrl);
      } catch (error) {
        if (isMounted.current) setHasError(true);
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    };
    loadImage();

    // Evitando que as imagens fiquem prejudicando o desempenho da aplicação
    return () => {
      isMounted.current = false;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mangaId, fileName, dispatch]);

  return (
    <Box 
      ref={ref} 
      {...otherProps} 
      sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#333', 
        borderRadius: '8px' 
      }}
    >
      {isLoading ? (
        <CircularProgress color="inherit" size={40} />
      ) : hasError ? (
        <BrokenImageIcon fontSize="large" sx={{ color: 'text.secondary' }} />
      ) : (
        <img
          src={imageUrl}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '8px' }}
        />
      )}
    </Box>
  );
}