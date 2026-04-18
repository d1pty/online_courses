import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from "../../http-common";
import { Container, TextField, Button, Typography, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box, MenuItem, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { connect } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import TestDialog from './TestDialog';

Quill.register('modules/imageResize', ImageResize);

const quillModules = {
    toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
    ],
    imageResize: {
    }
};

const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
];

const CourseDetails = ({ user }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({
        title: '',
        description: '',
        teacherId: null
    });
    const [courseData, setCourseData] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [showGroups, setShowGroups] = useState(false);
    const [groups, setGroups] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingChapter, setEditingChapter] = useState({ chapterTitle: '', chapterText: '' });
    const [newChapter, setNewChapter] = useState({ chapterTitle: '', chapterText: '' });
    const [newModalOpen, setNewModalOpen] = useState(false);
    const [openTestDialog, setOpenTestDialog] = useState(false); 

    useEffect(() => {
        if (user.role !== 'ROLE_TEACHER') {
            alert('У вас нет прав для редактирования курсов');
            navigate(`/${user.id}/courses`);
            return;
        }
        http.get(`/course/${courseId}`)
            .then(response => {
                const courseData = response.data;
                if (courseData.teacher.id !== user.id) {
                    alert('Вы можете редактировать только свои курсы');
                    navigate(`/${user.id}/courses`);
                    return;
                }
                setCourse({
                    title: courseData.title,
                    description: courseData.description,
                    teacherId: courseData.teacherId
                });
            })
            .catch(error => {
                console.error("Ошибка при загрузке данных курса:", error);
                alert('Ошибка при загрузке данных курса');
                navigate(`/${user.id}/courses`);
            });
        http.get(`/course/${courseId}/data`)
            .then(response => {
                setCourseData(response.data);
            })
            .catch(error => {
                console.error("Ошибка при загрузке содержания курса:", error);
            });
        http.get(`/course/${courseId}/groups`)
            .then(response => {
                setGroups(response.data);
            })
            .catch(error => {
                console.error("Ошибка при загрузке списка групп:", error);
            });
        http.get(`/groups`)
            .then(response => {
                setAllGroups(response.data);
            })
            .catch(error => {
                console.error("Ошибка при загрузке списка всех групп:", error);
            });
    }, [courseId, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse({ ...course, [name]: value });
    };

    const handleEdit = () => {
        http.post(`/updateCourse/${courseId}`, course)
            .then(() => {
                navigate(`/${user.id}/courses`);
            })
            .catch(error => {
                console.error("Ошибка при редактировании курса:", error);
                alert('Ошибка при редактировании курса');
            });
    };

    const handleDelete = () => {
        if (window.confirm("Вы уверены, что хотите удалить этот курс?")) {
            http.post(`/deleteCourse/${courseId}`)
                .then(() => {
                    navigate(`/${user.id}/courses`);
                })
                .catch(error => {
                    console.error("Ошибка при удалении курса:", error);
                    alert('Ошибка при удалении курса');
                });
        }
    };

    const openNewModal = () => {
        setNewModalOpen(true);
    };

    const closeNewModal = () => {
        setNewModalOpen(false);
        setNewChapter({ chapterTitle: '', chapterText: '' });
    };

    const handleAddChapter = () => {
        openNewModal();
    };

    const handleNewChapterChange = (field, value) => {
        setNewChapter({ ...newChapter, [field]: value });
    };

    const handleNewChapterSave = () => {
        http.post(`/course/${courseId}/addData`, newChapter)
            .then(response => {
                setCourseData([...courseData, response.data]);
                setNewModalOpen(false);
                setNewChapter({ chapterTitle: '', chapterText: '' });
            })
            .catch(error => {
                console.error("Ошибка при добавлении главы:", error);
                alert('Ошибка при добавлении главы');
            });
    };

    const handleChapterEdit = (chapter) => {
        setEditingChapter(chapter);
        setEditModalOpen(true);
    };

    const handleChapterDelete = (id) => {
        if (window.confirm("Вы уверены, что хотите удалить эту главу?")) {
            http.post(`/course/${courseId}/deleteData/${id}`)
            .then(() => {
                setCourseData(courseData.filter(chapter => chapter.id !== id));
                setSelectedChapter(null);
            })
            .catch(error => {
                console.error("Ошибка при удалении главы:", error);
                alert('Ошибка при удалении главы');
            });
        }
    };

    const handleChapterSelect = (chapter) => {
        setSelectedChapter(chapter);
    };

    const handleToggleView = () => {
        setShowGroups(!showGroups);
    };

    const handleGroupChange = (e) => {
        setSelectedGroup(e.target.value);
    };

    const handleAddGroup = () => {
        http.post(`/course/${courseId}/addGroup/${selectedGroup}`)
            .then(() => {
                http.get(`/course/${courseId}/groups`)
                    .then(response => {
                        setGroups(response.data);
                    })
                    .catch(error => {
                        console.error("Ошибка при обновлении списка групп:", error);
                    });
            })
            .catch(error => {
                console.error("Ошибка при добавлении группы к курсу:", error);
                alert('Ошибка при добавлении группы к курсу');
            });
    };

    const handleDeleteGroup = (groupId) => {
        if (window.confirm("Вы уверены, что хотите удалить эту группу из курса?")) {
            http.post(`/course/${courseId}/deleteGroup/${groupId}`)
                .then(() => {
                    setGroups(groups.filter(group => group.id !== groupId));
                })
                .catch(error => {
                    console.error("Ошибка при удалении группы из курса:", error);
                    alert('Ошибка при удалении группы из курса');
                });
        }
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const handleEditChapterChange = (field, value) => {
        setEditingChapter({ ...editingChapter, [field]: value });
    };

    const handleEditChapterSave = () => {
        http.post(`/course/${courseId}/updateData/${editingChapter.id}`, editingChapter)
            .then(() => {
                setCourseData(courseData.map(chapter => chapter.id === editingChapter.id ? editingChapter : chapter));
                setEditModalOpen(false);
                setSelectedChapter(editingChapter);
            })
            .catch(error => {
                console.error("Ошибка при редактировании главы:", error);
                alert('Ошибка при редактировании главы');
            });
    };
    const handleOpenTestDialog = () => {
        setOpenTestDialog(true);
    };

    const handleCloseTestDialog = () => {
        setOpenTestDialog(false);
    };

    const handleSubmitTest = (test) => {
        console.log('Test data:', test);
        setOpenTestDialog(false);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Редактировать курс</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="title"
                        label="Название курса"
                        fullWidth
                        value={course.title}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="description"
                        label="Описание курса"
                        fullWidth
                        value={course.description}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleToggleView}>
                        {showGroups ? 'Показать содержание' : 'Показать группы'}
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleAddChapter}>Добавить главу</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleOpenTestDialog}>Добавить тест</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleEdit}>Сохранить изменения</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="error" onClick={handleDelete}>Удалить курс</Button>
                </Grid>
            </Grid>
            {showGroups ? (
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>Группы</Typography>
                    <FormControl fullWidth variant="outlined" style={{ marginTop: '20px' }}>
                        <InputLabel id="group-select-label">Выберите группу</InputLabel>
                        <Select
                            labelId="group-select-label"
                            id="group-select"
                            value={selectedGroup}
                            onChange={handleGroupChange}
                            label="Выберите группу"
                        >
                            {allGroups
                                .filter(group => !groups.some(g => g.id === group.id))
                                .map(group => (
                                    <MenuItem key={group.id} value={group.id}>{group.groupName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={handleAddGroup} style={{ marginTop: '20px' }}>
                        Добавить группу
                    </Button>
                    <List>
                        {groups.map(group => (
                            <ListItem key={group.id}>
                                <ListItemText primary={group.groupName} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteGroup(group.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            ) : (
                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                    <Grid item xs={3}>
                        <Typography variant="h5" gutterBottom>Содержание</Typography>
                        <List>
                            {courseData.map((chapter, index) => (
                                <ListItem key={index} button onClick={() => handleChapterSelect(chapter)}>
                                    <ListItemText primary={chapter.chapterTitle} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={9}>
                        <Box>
                            {selectedChapter ? (
                                <Box>
                                    <Typography variant="body1" component="div" style={{ whiteSpace: 'pre-wrap' }}>
                                        <ReactQuill value={selectedChapter.chapterText} readOnly={true} theme="bubble" />
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        style={{ marginTop: '10px', marginRight: '10px' }}
                                        onClick={() => handleChapterEdit(selectedChapter)}
                                    >
                                        Редактировать
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        style={{ marginTop: '10px' }}
                                        onClick={() => handleChapterDelete(selectedChapter.id)}
                                    >
                                        Удалить
                                    </Button>
                                </Box>
                            ) : (
                                <Typography variant="body1">Выберите главу, чтобы увидеть её содержание</Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            )}

            <Dialog open={editModalOpen} onClose={closeEditModal} maxWidth="md" fullWidth>
                <DialogTitle>Редактировать главу</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Название главы"
                        type="text"
                        fullWidth
                        value={editingChapter.chapterTitle}
                        onChange={(e) => handleEditChapterChange('chapterTitle', e.target.value)}
                    />
                    <ReactQuill
                        value={editingChapter.chapterText}
                        onChange={(content) => handleEditChapterChange('chapterText', content)}
                        style={{ height: '400px', marginBottom: '20px' }} // Adjust height as needed
                        modules={quillModules}
                        formats={quillFormats}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeEditModal} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleEditChapterSave} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={newModalOpen} onClose={closeNewModal} maxWidth="md" fullWidth>
                <DialogTitle>Добавить новую главу</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Название главы"
                        type="text"
                        fullWidth
                        value={newChapter.chapterTitle}
                        onChange={(e) => handleNewChapterChange('chapterTitle', e.target.value)}
                    />
                    <ReactQuill
                        value={newChapter.chapterText}
                        onChange={(content) => handleNewChapterChange('chapterText', content)}
                        style={{ height: '400px', marginBottom: '20px' }}
                        modules={quillModules}
                        formats={quillFormats}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeNewModal} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleNewChapterSave} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
            <TestDialog 
                open={openTestDialog} 
                onClose={handleCloseTestDialog} 
                onSubmit={handleSubmitTest} 
            />
        </Container>
    );
};

const mapStateToProps = state => ({
    user: state.auth.user 
});

export default connect(mapStateToProps)(CourseDetails);
