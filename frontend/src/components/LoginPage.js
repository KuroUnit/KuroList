import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { authActions, map_error, map_loading, map_token, login_user } from '../context/authSlice';

const LoginPage = () => {
  const [login, setLogin] = useState(""),
        [password, setPassword] = useState(""),
        [formError, setFormError] = useState(null);

  const dispatch = useDispatch(),
        navigate = useNavigate();

  const auth_error = useSelector(map_error),
        loading = useSelector(map_loading),
        token = useSelector(map_token);

  const handleInputChange = (setter) => (ev) => {
    setFormError(null);
    if (auth_error){
      dispatch(authActions.clear_error())
    }
    setter(ev.target.value)
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setFormError(null);

    if (!login.trim() || !password.trim()) {
      setFormError("Por favor, preencha todos os campos.");
      return;
    }

    dispatch(login_user({ login, password }))
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const errorMessage = auth_error || formError;
  
  return (
    <Container maxWidth="xs">
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent='center'
        sx={{ minHeight: '100vh' }} 
      >
        <Typography variant="h5" gutterBottom>Login</Typography>
        <Box component="form" onSubmit={handleSubmit} width="100%">
          <TextField
            margin="normal"
            fullWidth
            label="Login"
            value={login}
            onChange={handleInputChange(setLogin)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Senha"
            type="password"
            value={password}
            onChange={handleInputChange(setPassword)}
          />
          {errorMessage && (
            <Typography color="error" variant="body2">{errorMessage}</Typography>
          )}
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
