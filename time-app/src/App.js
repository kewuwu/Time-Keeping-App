import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './LogIn';
import EmployeeScreen from './EmployeeScreen';
import AdminScreen from './AdminScreen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { UserProvider } from './components/userContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f39c12',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  InputLabel: {
    fontfamily: 'Jura',
    color: '#blue',
  },
  typography: {
    h1: {
      fontFamily: 'Jura',
      fontSize: '3rem',
      fontWeight: 700,
      color: '#3f51b5',
    }
  },
})
function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/Employee" element={<EmployeeScreen />} />
            <Route path="/Admin" element={<AdminScreen />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  )

}

export default App;