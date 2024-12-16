import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminScreen = () => {
    const [employees, setEmployees] = useState([]); // Holds employee data
    const [isEditing, setIsEditing] = useState({}); // Tracks which employee is being edited
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:5000/admin'); // Replace with your backend endpoint
            const data = await response.json();
            setEmployees(data);
        };

        fetchData();
    }, []);

    const handleEdit = (index) => {
        setIsEditing((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleChange = (index, field, value) => {
        if (field === 'payrate') {
            const validValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
            const decimals = validValue.split('.')[1];
            if (decimals && decimals.length > 2) {
                value = parseFloat(validValue).toFixed(2);
            } else {
                value = validValue;
            }
        }
        setEmployees((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const handleSave = async (index) => {
        const updatedEmployee = employees[index];
        await fetch('http://localhost:5000/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEmployee),
        });
        setIsEditing((prev) => ({ ...prev, [index]: false }));
    };

    const handleAddNewEmployee = () => {
        const newEmployee = {
            _id: '-1',
            username: 'Username',
            password: 'Password',
            name: 'Name',
            role: 'Role',
            payrate: '0',
            admin: false,
        };
        setEmployees((prev) => [...prev, newEmployee]);
    };

    const handleLogout = () => {
        navigate(-1);
    };

    const allFieldsFilled = (employee) => {
        const requiredFields = ['username', 'password', 'name', 'role', 'payrate', 'admin'];
        return requiredFields.every(field => employee[field] !== '');
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Admin Screen
                </Typography>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleLogout}
                    sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#f0f0f0' } }}
                >
                    Logout
                </Button>
            </Box>

            <Grid container spacing={3}>
                {employees.map((employee, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={2} sx={{ borderRadius: 2, padding: 3, backgroundColor: '#fff' }}>
                            {Object.keys(employee).map((field) => (
                                <Box key={field} sx={{ marginBottom: 2 }}>
                                    <Typography variant="body1" component="label" sx={{ fontWeight: 'bold', color: '#444' }}>
                                        {field}:
                                    </Typography>
                                    {isEditing[index] ? (
                                        field === 'admin' ? (
                                            <TextField
                                                select
                                                SelectProps={{
                                                    native: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                                value={employee[field].toString()}
                                                onChange={(e) => handleChange(index, field, e.target.value === 'true')}
                                                fullWidth
                                                sx={{ marginTop: 1 }}
                                            >
                                                <option value="true">True</option>
                                                <option value="false">False</option>
                                            </TextField>
                                        ) : field !== '_id' ? (
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                value={employee[field]}
                                                onChange={(e) => handleChange(index, field, e.target.value)}
                                                fullWidth
                                                sx={{ marginTop: 1 }}
                                            />
                                        ) : (
                                            <Typography variant="body2" sx={{ marginLeft: 1, color: '#666' }}>
                                                {employee[field]}
                                            </Typography>
                                        )
                                    ) : (
                                        <Typography variant="body2" sx={{ marginLeft: 1, color: '#666' }}>
                                            {employee[field]}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                            <Button
                                variant="contained"
                                color={isEditing[index] ? 'success' : 'info'}
                                onClick={() => (isEditing[index] ? handleSave(index) : handleEdit(index))}
                                fullWidth
                                sx={{ marginTop: 3, backgroundColor: isEditing[index] ? '#28a745' : '#17a2b8', '&:hover': { backgroundColor: isEditing[index] ? '#218838' : '#138496' } }}
                                disabled={!allFieldsFilled(employee)}
                            >
                                {isEditing[index] ? 'Save' : 'Edit'}
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddNewEmployee}
                sx={{ marginTop: 2, backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
            >
                Add Employee
            </Button>
        </Box>
    );
};

export default AdminScreen;
