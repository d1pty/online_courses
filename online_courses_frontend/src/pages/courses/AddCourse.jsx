import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from "../../http-common";
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { connect } from "react-redux";

const AddCourse = ({ teacherId }) => {
    const [course, setCourse] = useState({
        title: '',
        description: '',
        teacherId: teacherId 
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await http.post("/addCourse", course);
            navigate(`/${teacherId}/courses`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Добавить курс
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="title"
                                label="Название курса"
                                variant="outlined"
                                fullWidth
                                value={course.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Описание курса"
                                variant="outlined"
                                fullWidth
                                value={course.description}
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

const mapStateToProps = state => ({
    teacherId: state.auth.user.id
});

export default connect(mapStateToProps)(AddCourse);