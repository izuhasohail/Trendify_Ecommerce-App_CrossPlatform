import React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const AlertBox = ({ message, type, onClose }) => {
  // Set a timeout to close the alert after 5 seconds
  setTimeout(() => {
    onClose();
  }, 3000);

  return (
    <Stack spacing={2}
      sx={{
        width: '50%',
        height: 20,
        margin: "auto",
        position: "fixed",
        zIndex: 90000,
        top: '3%',
        left: 0,
        right: 0,
        fontFamily:"poppins"
      }} >
      <Alert severity={type} variant='filled'
        sx={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 1)' }}
        onClose={onClose}>
        {message}
      </Alert>
    </Stack>

  );
}

export default AlertBox;