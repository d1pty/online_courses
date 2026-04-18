import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import http from "../../http-common";
import { Container, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';

const UserCourses = () => {
    const { userId } = useParams();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (userId) {
            http.get(`/UserCourses/${userId}`)
                .then(response => {
                    const userCourses = response.data;
                    console.log(userCourses);
                    setCourses(userCourses);
                })
                .catch(error => {
                    console.error("Ошибка при загрузке курсов:", error);
                });
        }
    }, [userId]);

    return (
        <Container>
            <Grid container spacing={2} justifyContent="space-between" alignItems="center" style={{ marginTop: '20px' }}>
                <Grid item>
                    <Typography variant="h4">Мои Курсы</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item xs={12} md={8}>
                    <List>
                        {courses.map(course => (
                            <ListItem key={course.id} button component={RouterLink} to={`/UserCourses/course/${course.id}`}>
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
}

export default UserCourses;
