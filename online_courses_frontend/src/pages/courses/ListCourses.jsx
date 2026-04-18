import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import http from "../../http-common";
import { Container, Button, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';

const ListCourses = () => {
    const { userId } = useParams();
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        if (userId) {
            http.get(`/${userId}/courses`)
                .then(response => {
                    setCourses(response.data);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, [userId]);

    return (
        <Container>
            <Grid container spacing={2} justifyContent="space-between" alignItems="center" style={{ marginTop: '20px' }}>
                <Grid item>
                    <Typography variant="h4">Курсы</Typography>
                </Grid>
                <Grid item>
                    <Button component={RouterLink} to="/addCourse" variant="contained" color="primary">
                        Добавить курс
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item xs={12} md={8}>
                    <List>
                        {courses.map((course, i) => (
                            <ListItem button component={RouterLink} to={`/course/${course.id}`} key={i}>
                                <ListItemText
                                    primary={course.title}
                                    secondary={course.description}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ListCourses;
