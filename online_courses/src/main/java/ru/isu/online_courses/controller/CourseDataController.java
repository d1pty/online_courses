package ru.isu.online_courses.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.isu.online_courses.model.Course;
import ru.isu.online_courses.model.CourseData;
import ru.isu.online_courses.model.CourseDataRequest;
import ru.isu.online_courses.repository.CourseDataRepository;
import ru.isu.online_courses.repository.CourseRepository;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CourseDataController {

    @Autowired
    private CourseDataRepository courseDataRepository;

    @Autowired
    private CourseRepository courseRepository;

    @PostMapping("/course/{courseId}/addData")
    public ResponseEntity<?> createCourseData(@PathVariable Integer courseId, @RequestBody CourseDataRequest courseDataRequest) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Course not found");
        }

        Course course = courseOptional.get();
        CourseData courseData = new CourseData(courseDataRequest.getChapterTitle(), courseDataRequest.getChapterText(), course);
        CourseData createdCourseData = courseDataRepository.save(courseData);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourseData);
    }

    @GetMapping("/course/{courseId}/data")
    public ResponseEntity<List<CourseData>> getAllCourseData(@PathVariable Integer courseId) {
        List<CourseData> courseDataList = courseDataRepository.findByCourseId(courseId);
        return ResponseEntity.ok(courseDataList);
    }

    @GetMapping("/course/{courseId}/data/{dataId}")
    public ResponseEntity<?> getCourseDataById(@PathVariable Integer courseId, @PathVariable Integer dataId) {
        Optional<CourseData> courseData = courseDataRepository.findById(dataId);
        if (courseData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(courseData.get());
    }

    @PostMapping("/course/{courseId}/updateData/{dataId}")
    public ResponseEntity<?> updateCourseData(@PathVariable Integer courseId, @PathVariable Integer dataId, @RequestBody CourseDataRequest courseDataRequest) {
        Optional<CourseData> existingCourseData = courseDataRepository.findById(dataId);
        if (existingCourseData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CourseData courseData = existingCourseData.get();
        courseData.setChapterTitle(courseDataRequest.getChapterTitle());
        courseData.setChapterText(courseDataRequest.getChapterText());
        courseDataRepository.save(courseData);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/course/{courseId}/deleteData/{dataId}")
    public ResponseEntity<?> deleteCourseData(@PathVariable Integer courseId, @PathVariable Integer dataId) {
        Optional<CourseData> existingCourseData = courseDataRepository.findById(dataId);
        if (existingCourseData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CourseData courseData = existingCourseData.get();
        if (!courseData.getCourse().getId().equals(courseId)) {
            return ResponseEntity.badRequest().body("Course ID mismatch");
        }

        courseDataRepository.deleteById(dataId);
        return ResponseEntity.noContent().build();
    }
}