import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from "../../http-common";
import { Container, Typography, Button, TextField, Grid, List, ListItem, ListItemText, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const EditGroup = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');

    useEffect(() => {
        http.get(`/group/${groupId}`)
            .then(response => {
                setGroupName(response.data.groupName);
                setStudents(response.data.userGroups.map(ug => ug.user));
            })
            .catch(error => {
                console.error("Ошибка при загрузке данных группы:", error);
            });

        http.get('/students')
            .then(response => {
                setAllStudents(response.data);
            })
            .catch(error => {
                console.error("Ошибка при загрузке списка студентов:", error);
            });
    }, [groupId]);

    const handleEdit = () => {
        http.post(`/updateGroup/${groupId}`, { groupName })
            .then(() => {
                navigate('/groups');
            })
            .catch(error => {
                console.error("Ошибка при редактировании группы:", error);
            });
    };

    const handleDelete = () => {
        if (window.confirm("Вы уверены, что хотите удалить эту группу?")) {
            http.post(`/deleteGroup/${groupId}`)
                .then(() => {
                    navigate('/groups');
                })
                .catch(error => {
                    console.error("Ошибка при удалении группы:", error);
                });
        }
    };

    const handleAddStudent = () => {
        http.post(`/group/${groupId}/addStudent`, { userId: selectedStudent })
            .then(response => {
                setStudents([...students, response.data.user]);
                setSelectedStudent('');
            })
            .catch(error => {
                console.error("Ошибка при добавлении студента:", error);
            });
    };

    const handleRemoveStudent = (studentId) => {
        http.post(`/group/${groupId}/deleteStudent/${studentId}`)
            .then(() => {
                setStudents(students.filter(student => student.id !== studentId));
            })
            .catch(error => {
                console.error("Ошибка при удалении студента:", error);
            });
    };

    const availableStudents = allStudents.filter(student => !students.some(s => s.id === student.id));

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Редактирование группы</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Название группы"
                        fullWidth
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleEdit}>Сохранить изменения</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="error" onClick={handleDelete}>Удалить группу</Button>
                </Grid>
            </Grid>
            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>Студенты в группе</Typography>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item xs={8}>
                    <FormControl fullWidth>
                        <InputLabel id="select-student-label">Выбор студента</InputLabel>
                        <Select
                            labelId="select-student-label"
                            value={selectedStudent}
                            onChange={e => setSelectedStudent(e.target.value)}
                        >
                            {availableStudents.map(student => (
                                <MenuItem key={student.id} value={student.id}>
                                    {student.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" color="primary" onClick={handleAddStudent}>Добавить студента</Button>
                </Grid>
            </Grid>
            <List>
                {students.map(student => (
                    <ListItem key={student.id} secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveStudent(student.id)}>
                            <DeleteIcon />
                        </IconButton>
                    }>
                        <ListItemText primary={student.name} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default EditGroup;
