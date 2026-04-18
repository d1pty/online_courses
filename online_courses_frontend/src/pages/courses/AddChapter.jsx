import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from "../../http-common";
import { Container, TextField, Button, Typography, Grid, Box } from '@mui/material';
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddChapter = ({ user }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState({
        chapterTitle: '',
        chapterText: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChapter({ ...chapter, [name]: value });
    };

    const handleTextChange = (value) => {
        setChapter({ ...chapter, chapterText: value });
    };

    const handleAdd = () => {
        http.post(`/course/${courseId}/addData`, chapter)
            .then(() => {
                navigate(`/course/${courseId}`);
            })
            .catch(error => {
                console.error("Ошибка при добавлении главы:", error);
                alert('Ошибка при добавлении главы');
            });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Добавить главу</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        name="chapterTitle"
                        label="Название главы"
                        fullWidth
                        value={chapter.chapterTitle}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <ReactQuill
                        value={chapter.chapterText}
                        onChange={handleTextChange}
                        theme="snow"
                        placeholder="Текст главы"
                        modules={{
                            toolbar: [
                                [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                                [{size: []}],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{'list': 'ordered'}, {'list': 'bullet'}, 
                                {'indent': '-1'}, {'indent': '+1'}],
                                ['link', 'image'],
                                ['clean']
                            ],
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleAdd}>Добавить главу</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={() => navigate(`/course/${courseId}`)}>Отмена</Button>
                </Grid>
            </Grid>
        </Container>
    );
};

const mapStateToProps = state => ({
    user: state.auth.user 
});

export default connect(mapStateToProps)(AddChapter);
