import React, { useState } from 'react';
import axios from 'axios'; import { useUserContext } from './components/userContext';
import { Backdrop, Box, Button, Input, InputLabel, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('', '');
  const [loginStatus, setLoginStatus] = useState('');
  const navigate = useNavigate();
  const { setUsername: saveUsername } = useUserContext();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username: username,
        password: password
      });
      console.log(response.data);
      setMessage(response.data.message);
      setLoginStatus('green');
      saveUsername(username);
      if (response.data.userType === "admin") {
        navigate('/Admin');
      } else if (response.data.userType === "employee") {
        navigate('/Employee');
      }
    } catch (error) {
      setMessage('Login failed: ' + (error.response && error.response.data.message ? error.response.data.message : 'Unknown error'), 'red');
      setLoginStatus('red');
    }
  };

  return (

    <form onSubmit={handleLogin}>
      <Box p={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200h', marginTop: '360px' }}>
        <Paper elevation={3} sx={{ padding: '16px', margin: '16px 0' }}>
          <Typography variant="h1" sx={{ marginBottom: '16px', marginLeft: '128px' }}>Home Page</Typography>
          <TextField label="Username" type="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <TextField label="Password" type="password" sx={{ marginLeft: '10px' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="outlined" sx={{ marginTop: '10px', marginLeft: '10px' }}>Log In</Button>
          <Typography sx={{ color: loginStatus }}>{message && <p>{message}</p>}</Typography>
        </Paper>
      </Box>
    </form>
  );
}

export default LogIn;