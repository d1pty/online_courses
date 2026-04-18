import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from "../../http-common";
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';

const AddGroup = () => {
    const [group, setGroup] = useState({
        groupName: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGroup({ ...group, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await http.post("/addGroup", group);
            const groupId = response.data.id;
            navigate(`/group/${groupId}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Добавить группу
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="groupName"
                                label="Название группы"
                                variant="outlined"
                                fullWidth
                                value={group.groupName}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Добавить
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default AddGroup;
