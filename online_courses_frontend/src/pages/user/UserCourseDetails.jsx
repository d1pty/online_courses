import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import http from "../../http-common";
import { Container, Typography, Grid, List, ListItem, ListItemText, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

const ViewCourse = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState({
        title: '',
        description: '',
        teacherId: null
    });
    const [courseData, setCourseData] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [openTestsDialog, setOpenTestsDialog] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

    useEffect(() => {
        http.get(`/course/${courseId}`)
            .then(response => {
                const courseData = response.data;
                setCourse({
                    title: courseData.title,
                    description: courseData.description,
                    courseData: courseData.courseData
                });
            })
            .catch(error => {
                console.error("Ошибка при загрузке данных курса:", error);
            });
        http.get(`/course/${courseId}/data`)
            .then(response => {
                setCourseData(response.data);
            })
            .catch(error => {
                console.error("Ошибка при загрузке содержания курса:", error);
            });
    }, [courseId]);

    const handleChapterSelect = (chapter) => {
        setSelectedChapter(chapter);
    };

    const handleShowTests = () => {
        setOpenTestsDialog(true);
        http.get(`/course/${courseId}/questions`)
            .then(response => {
                const formattedQuestions = response.data.map(question => ({
                    ...question,
                    answers: question.answers.map(answerObj => answerObj.answer)
                }));
                setQuestions(formattedQuestions);
                // Сброс выбранных ответов при открытии теста
                setSelectedAnswers(new Array(formattedQuestions.length).fill(null));
            })
            .catch(error => {
                console.error('Ошибка при получении вопросов:', error);
            });
    };

    const handleCloseTestsDialog = () => {
        setOpenTestsDialog(false);
        setCorrectAnswersCount(0);
    };

    const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
        const updatedAnswers = [...selectedAnswers];
        updatedAnswers[questionIndex] = answerIndex;
        setSelectedAnswers(updatedAnswers);
    };

    const handleSubmit = () => {
        let count = 0;
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].correctAnswer === selectedAnswers[i]) {
                count++;
            }
        }
        setCorrectAnswersCount(count);
        setOpenTestsDialog(false);
    };
    
    const selectedAnswerStyle = {
        backgroundColor: '#ccc',
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>{course.title}</Typography>
            <Typography variant="body1" gutterBottom>{course.description}</Typography>
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
                    <Button variant="contained" color="primary" onClick={handleShowTests}>Показать тесты</Button>
                </Grid>
                <Grid item xs={9}>
                    <Box>
                        {selectedChapter ? (
                            <Box>
                                <ReactQuill
                                    value={selectedChapter.chapterText}
                                    readOnly={true}
                                    theme="bubble"
                                />
                            </Box>
                        ) : (
                            <Typography variant="body1">Выберите главу, чтобы увидеть её содержание</Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
            <Dialog open={openTestsDialog} onClose={handleCloseTestsDialog} fullWidth maxWidth="md">
                <DialogTitle>Вопросы для курса "{course.title}"</DialogTitle>
                <DialogContent>
                    {questions.map((question, qIndex) => (
                        <Box key={qIndex} mt={2}>
                            <Typography variant="h6">{`Вопрос ${qIndex + 1}`}</Typography>
                            <Typography variant="body1">{question.question}</Typography>
                            <List>
                                {question.answers.map((answer, aIndex) => (
                                    <ListItem
                                        key={aIndex}
                                        style={selectedAnswers[qIndex] === aIndex ? selectedAnswerStyle : {}}
                                        onClick={() => handleCorrectAnswerChange(qIndex, aIndex)}
                                    >
                                        <ListItemText primary={answer} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTestsDialog} color="primary">Закрыть</Button>
                    <Button onClick={handleSubmit} color="primary">Отправить</Button>
                </DialogActions>
            </Dialog>
            {/* Вывод количества верных ответов */}
            <Dialog open={correctAnswersCount} onClose={() => setCorrectAnswersCount(0)}>
                <DialogTitle>Количество верных ответов</DialogTitle>
                <DialogContent>
                    <Typography>{`Вы дали ${correctAnswersCount} верных ответов из ${questions.length}`}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCorrectAnswersCount(0)} color="primary">Закрыть</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ViewCourse;

