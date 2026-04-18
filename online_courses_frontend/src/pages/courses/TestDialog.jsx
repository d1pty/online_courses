import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import http from "../../http-common";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, IconButton, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const TestDialog = ({ open, onClose }) => {
    const [questions, setQuestions] = useState([]);
    const { courseId } = useParams();

    useEffect(() => {
        if (open) {
            http.get(`/course/${courseId}/questions`)
                .then(response => {
                    const formattedQuestions = response.data.map(question => ({
                        ...question,
                        answers: question.answers.map(answerObj => answerObj.answer)
                    }));
                    setQuestions(formattedQuestions);
                })
                .catch(error => {
                    console.error('Ошибка при получении вопросов:', error);
                });
        }
    }, [open, courseId]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', answers: [''], correctAnswer: 0 }]);
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
    };

    const handleAddAnswer = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers.push('');
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (qIndex, aIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers[aIndex] = value;
        setQuestions(newQuestions);
    };

    const handleDeleteAnswer = (qIndex, aIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers.splice(aIndex, 1);
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = () => {
        questions.forEach(question => {
            const formattedQuestion = {
                course: { id: courseId },
                question: question.question,
                correctAnswer: question.correctAnswer,
                answers: question.answers.map(answer => ({ answer: answer }))
            };
    
            console.log('Отправляем на сервер:', formattedQuestion);
    
            if (question.id) {
                http.put(`/updateQuestion/${question.id}`, formattedQuestion)
                    .then(response => {
                    })
                    .catch(error => {
                        console.error('Ошибка при обновлении вопроса:', error);
                    });
            } else {
                http.post('/createQuestion', formattedQuestion)
                    .then(response => {
                    })
                    .catch(error => {
                        console.error('Ошибка при создании вопроса:', error);
                    });
            }
        });
    
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Создать тест</DialogTitle>
            <DialogContent>
                <Button variant="contained" color="primary" onClick={handleAddQuestion} startIcon={<AddIcon />}>
                    Добавить вопрос
                </Button>
                {questions.map((question, qIndex) => (
                    <Box key={qIndex} mt={2} mb={2}>
                        <TextField
                            label={`Вопрос ${qIndex + 1}`}
                            fullWidth
                            value={question.question}
                            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                            margin="normal"
                        />
                        <RadioGroup
                            value={question.correctAnswer}
                            onChange={(e) => handleCorrectAnswerChange(qIndex, parseInt(e.target.value))}
                        >
                            {question.answers.map((answer, aIndex) => (
                                <Box key={aIndex} display="flex" alignItems="center">
                                    <FormControlLabel
                                        value={aIndex}
                                        control={<Radio />}
                                        label={
                                            <TextField
                                                fullWidth
                                                value={answer}
                                                onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                                margin="normal"
                                            />
                                        }
                                    />
                                    <IconButton onClick={() => handleDeleteAnswer(qIndex, aIndex)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </RadioGroup>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleAddAnswer(qIndex)}
                            startIcon={<AddIcon />}
                        >
                            Добавить ответ
                        </Button>
                    </Box>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Отмена</Button>
                <Button onClick={handleSubmit} color="primary">Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TestDialog;
