import React from 'react';
import { Card, CardContent, Typography, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#ffffff',
    color: '#fff',
    display: 'flex',  // Enable flexbox
    flexDirection: 'column',  // Stack children vertically
    justifyContent: 'center',  // Center content vertically
    alignItems: 'center',  // Center content horizontally
    height: '850px',  // Or any other height
    padding: theme.spacing(2),
    textAlign: 'center',
    margin: theme.spacing(2),
    elevation: 10,
    width: '350px',
}));

const CustomButtonBase = styled(ButtonBase)(({ theme, disabled }) => ({
    display: 'block',  // Make ButtonBase fill the card
    textAlign: 'initial',
    opacity: disabled ? 0.8 : 1,
}));

const TimeCardComponent = ({ label, time, backgroundColor, onClick, disabled = false }) => (
    <CustomButtonBase onClick={onClick} disabled={disabled}>
        <CustomCard style={{ backgroundColor }}>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom >
                    {label}
                </Typography>
                <Typography variant="h2" align="center">
                    {time}
                </Typography>
            </CardContent>
        </CustomCard>
    </CustomButtonBase>
);

export default TimeCardComponent;