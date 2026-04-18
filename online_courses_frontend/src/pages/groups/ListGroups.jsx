import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import http from "../../http-common";
import { Container, Button, Grid, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';

const ListGroups = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        http.get("/groups")
            .then(response => {
                setGroups(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }, []);

    return (
        <Container>
            <Grid container spacing={2} justifyContent="space-between" alignItems="center" style={{ marginTop: '20px' }}>
                <Grid item>
                    <Typography variant="h4">Группы</Typography>
                </Grid>
                <Grid item>
                    <Button component={RouterLink} to="/addGroup" variant="contained" color="primary">
                        Добавить группу
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item xs={12} md={8}>
                    <List>
                        {groups.map((group, i) => {
                            const students = group.userGroups.map(ug => ug.user.name);
                            const displayedStudents = students.slice(0, 5); // Отображаем первые 3 студента
                            const remainingStudents = students.length - displayedStudents.length;

                            return (
                                <ListItem button component={RouterLink} to={`/group/${group.id}`} key={i}>
                                    <ListItemText
                                        primary={group.groupName}
                                        secondary={
                                            <>
                                                {displayedStudents.join(', ')}
                                                {remainingStudents > 0 && (
                                                    <Tooltip title={students.join(', ')}>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {` и еще ${remainingStudents} студент(а/ов)`}
                                                        </Typography>
                                                    </Tooltip>
                                                )}
                                            </>
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ListGroups;
