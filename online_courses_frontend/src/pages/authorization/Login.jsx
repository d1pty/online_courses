import React, { useState } from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import auth from "../../actions/auth";
import { TextField, Button, Container, Typography, Alert, CircularProgress, Box } from '@mui/material';

const Login = ({ isLoggedIn, message, dispatch }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    loading: false
  });

  const { username, password, loading } = formData;

  const onChangeUsername = e => setFormData({ ...formData, username: e.target.value });
  const onChangePassword = e => setFormData({ ...formData, password: e.target.value });

  const handleLogin = async e => {
    e.preventDefault();
    setFormData({ ...formData, loading: true });

    try {
      await dispatch(auth.login(username, password));
      window.location.reload();
    } catch (error) {
      setFormData({ ...formData, loading: false });
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/myTasks" />;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Вход</Typography>
      <form onSubmit={handleLogin}>
        <Box mb={2}>
          <TextField
            label="Логин"
            variant="outlined"
            fullWidth
            value={username}
            onChange={onChangeUsername}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Пароль"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={onChangePassword}
            required
          />
        </Box>
        <Box mb={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Войти
          </Button>
        </Box>
        <Box mb={2}>
          <Button component={RouterLink} to="/register" fullWidth>
            Зарегистрироваться
          </Button>
        </Box>
        {message && (
          <Box mt={2}>
            <Alert severity="error">
              {message}
            </Alert>
          </Box>
        )}
      </form>
    </Container>
  );
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  message: state.message.message
});

export default connect(mapStateToProps)(Login);
