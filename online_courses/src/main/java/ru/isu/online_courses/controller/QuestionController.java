package ru.isu.online_courses.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.isu.online_courses.model.Answer;
import ru.isu.online_courses.model.Course;
import ru.isu.online_courses.model.CourseData;
import ru.isu.online_courses.model.CourseDataRequest;
import ru.isu.online_courses.model.Question;
import ru.isu.online_courses.repository.AnswerRepository;
import ru.isu.online_courses.repository.CourseRepository;
import ru.isu.online_courses.repository.QuestionRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class QuestionController {
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Autowired
    private CourseRepository courseRepository;
       
    @PostMapping("/createQuestion")
    public Question createQuestion(@RequestBody Question question) {
        Question savedQuestion = questionRepository.save(question);
        for (Answer answer : question.getAnswers()) {
            answer.setQuestion(savedQuestion);
            answerRepository.save(answer);
        }
        return savedQuestion;
    }
    
    @GetMapping("/question/{id}")
    public Optional<Question> getQuestionById(@PathVariable Long id) {
        return questionRepository.findById(id);
    }
    @GetMapping("/course/{courseId}/questions")
    public ResponseEntity<List<Question>> getQuestionsInCourse(@PathVariable Integer courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }

        List<Question> questions = questionRepository.findByCourseId(courseId);
        return ResponseEntity.ok(questions);
    }
    
    @PostMapping("/updateQuestion/{id}")
    public Question updateQuestion(@PathVariable Long id, @RequestBody Question updatedQuestion) {
        Optional<Question> existingQuestionOpt = questionRepository.findById(id);
        Question existingQuestion = existingQuestionOpt.get();
        existingQuestion.setCorrectAnswer(updatedQuestion.getCorrectAnswer());
        existingQuestion.setCourse(updatedQuestion.getCourse());
        existingQuestion.setQuestion(updatedQuestion.getQuestion());

        Question savedQuestion = questionRepository.save(existingQuestion);

        for (Answer answer : updatedQuestion.getAnswers()) {
            answer.setQuestion(savedQuestion);
            answerRepository.save(answer);
        }

        return savedQuestion;
    }

    @PostMapping("/deleteQuestion/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        Optional<Question> questionOptional = questionRepository.findById(id);
        if (questionOptional.isPresent()) {
            Question question = questionOptional.get();
            answerRepository.deleteAll(question.getAnswers()); // Удалить ответы, связанные с вопросом
            questionRepository.delete(question); // Удалить вопрос
        } else {
        }
    }
}
