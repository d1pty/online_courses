import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from "react-redux";
import auth from "../../actions/auth";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Typography, Alert } from '@mui/material';

const Register = ({ dispatch, isRegistered, message }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); 
  const [role, setRole] = useState("");
  const [successful, setSuccessful] = useState(undefined);

  const handleRegister = (e) => {
    e.preventDefault();
    setSuccessful(false);

    dispatch(auth.register(username, password, name, role)) 
        .then(() => {
          setSuccessful(true);
          window.location.reload();
        })
        .catch(() => {
          setSuccessful(false);
        });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  if (isRegistered) {
    return <Navigate to="/login" />;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Регистрация</Typography>
      <form onSubmit={handleRegister}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="ФИО"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Логин"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Пароль"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Роль</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            onChange={handleRoleChange}
            label="Роль"
            required
          >
            <MenuItem value=""><em>Выберите роль</em></MenuItem>
            <MenuItem value="ROLE_TEACHER">Преподаватель</MenuItem>
            <MenuItem value="ROLE_STUDENT">Студент</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Button type="submit" variant="contained" color="primary">Зарегистрировать</Button>
        </FormControl>
        {message && successful !== undefined && (
          <FormControl fullWidth margin="normal">
            <Alert severity={successful ? "success" : "error"}>
              {message}
            </Alert>
          </FormControl>
        )}
      </form>
    </Container>
  );
};

const mapStateToProps = state => ({
  isRegistered: state.auth.isRegistered,
  message: state.message.message
});

export default connect(mapStateToProps)(Register);
