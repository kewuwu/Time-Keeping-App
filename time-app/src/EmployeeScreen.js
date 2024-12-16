import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './components/userContext';
import { Grid2, Box, Typography, Card, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import TimeCardComponent from './components/timeCardComponent';

function EmployeeScreen() {
    const CustomCard = styled(Card)({
        background: '#303f9f',
        color: '#fff',
        margin: 8,
        padding: 8,
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [clockIn, setClockIn] = useState();
    const [clockOut, setClockOut] = useState();
    const { username, setUsername } = useUserContext();
    const url = `http://localhost:5000/clock/${username}`;
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    useEffect(() => {
        const getClockState = async () => {
            try {
                const response = await axios.get(url);
                console.log(response.data);
                setClockIn(response.data.clockIn);
                setClockOut(response.data.clockOut);
                if ((clockIn !== null) && (clockOut === null)) {
                    setClockIn('0000');
                    setClockOut('0000');
                }

            } catch (error) {
                console.error('Failed to fetch clock state:', error);
                setMessage('Failed to fetch clock state.');
            }
            const timerId = setInterval(() => {
                setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));  // Update the currentTime state every second
            }, 10);  // Update every 1000 milliseconds

            // Cleanup function
            return () => {
                clearInterval(timerId);  // Clear the interval on component unmount
            };
        }
        getClockState();
    }, [])

    const handleClockIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/clock', { username, clockIn: currentTime });
            console.log(response.data);
            setClockIn(currentTime);
            setClockOut(null);
            return 1;
        } catch (error) {
            console.error('Failed to clock in:', error);
            setMessage('Failed to clock in.');
        }
    }
    const handleClockOut = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:5000/clock', { username, clockOut: currentTime });
            console.log(response.data);
            setClockOut(null);
            setClockIn(null);
            return 1;
        } catch (error) {
            console.error('Failed to clock out:', error);
            setMessage('Failed to clock out.');
        }
        return 1;
    }

    var displayOut = clockOut
    var displayIn = clockIn

    if (clockOut == null && clockIn !== null) {
        displayOut = currentTime
    }
    else {
        displayIn = currentTime
    }
    const handleLogout = () => {
        navigate(-1); // Navigate to the login screen
    };



    return (

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Header section */}
            <Box sx={{ bgcolor: '#303f9f', color: 'white', p: 2, textAlign: 'center' }}>
                <Typography variant="h4">Employee Home Page</Typography>
            </Box>

            {/* Main content area */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <Grid2 container spacing={1} justifyContent="center" alignItems="center" style={{ width: '100%', height: '100%' }}>
                    <Grid2 item xs={12} sm={6}>
                        <TimeCardComponent
                            label="Clock-In"
                            time={displayIn}
                            backgroundColor="#303f9f"
                            onClick={handleClockIn}
                            disabled={clockIn !== null}
                        />
                    </Grid2>
                    <Grid2 item xs={12} sm={6}>
                        <TimeCardComponent
                            label="Clock-Out"
                            time={displayOut}
                            backgroundColor="#303f9f"
                            onClick={handleClockOut}
                            disabled={clockOut !== null || clockIn === null}
                        />
                    </Grid2>
                </Grid2>
            </Box>
            <Button onClick={handleLogout}>Logout</Button>
        </Box>
    );
}


export default EmployeeScreen