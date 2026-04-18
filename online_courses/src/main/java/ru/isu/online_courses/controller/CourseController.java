package ru.isu.online_courses.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.isu.online_courses.model.Course;
import ru.isu.online_courses.model.CourseGroups;
import ru.isu.online_courses.model.CourseRequest;
import ru.isu.online_courses.model.Groups;
import ru.isu.online_courses.model.User;
import ru.isu.online_courses.repository.CourseGroupsRepository;
import ru.isu.online_courses.repository.CourseRepository;
import ru.isu.online_courses.repository.GroupsRepository;
import ru.isu.online_courses.repository.UserGroupsRepository;
import ru.isu.online_courses.repository.UserRepository;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CourseController {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserGroupsRepository userGroupsRepository;
    
    @Autowired
    private GroupsRepository groupRepository;
    

    @Autowired
    private CourseGroupsRepository courseGroupsRepository;
    
    @PostMapping("/course/{courseId}/addGroup/{groupId}")
    public ResponseEntity<?> addGroupToCourse(@PathVariable Integer courseId, @PathVariable Integer groupId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        Groups group = groupRepository.findById(groupId).orElse(null);

        if (course == null || group == null) {
            return ResponseEntity.notFound().build();
        }

        CourseGroups courseGroup = new CourseGroups();
        courseGroup.setCourse(course);
        courseGroup.setGroup(group);
        courseGroupsRepository.save(courseGroup);

        return ResponseEntity.status(HttpStatus.CREATED).body(courseGroup);
    }
    @GetMapping("/course/{courseId}/groups")
    public ResponseEntity<List<Groups>> getGroupsInCourse(@PathVariable Integer courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }

        List<Groups> groups = courseGroupsRepository.findGroupsByCourseId(courseId);
        return ResponseEntity.ok(groups);
    }
    
    @PostMapping("/course/{courseId}/deleteGroup/{groupId}")
    public ResponseEntity<?> removeGroupFromCourse(@PathVariable Integer courseId, @PathVariable Integer groupId) {
        CourseGroups courseGroup = courseGroupsRepository.findByCourseIdAndGroupId(courseId, groupId).orElse(null);
        if (courseGroup == null) {
            return ResponseEntity.notFound().build();
        }

        courseGroupsRepository.delete(courseGroup);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return ResponseEntity.ok(courses);
    }
    @GetMapping("/{teacherId}/courses")
    public ResponseEntity<List<Course>> getCoursesByTeacherId(@PathVariable Long teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        return ResponseEntity.ok(courses);
    }
    
    @PostMapping("/updateCourse/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Integer id, @RequestBody CourseRequest courseRequest) {
        Optional<Course> existingCourse = courseRepository.findById(id);
        if (existingCourse.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Course course = existingCourse.get();
        course.setTitle(courseRequest.getTitle());
        course.setDescription(courseRequest.getDescription());
        Course updatedCourse = courseRepository.save(course);

        return ResponseEntity.ok(updatedCourse);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<Course> getCourseById(@PathVariable Integer courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(course);
    }
    // Удаление курса
    @PostMapping("/deleteCourse/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable Integer courseId) {
        if (!courseRepository.existsById(courseId)) {
            return ResponseEntity.notFound().build();
        }
        courseRepository.deleteById(courseId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/addCourse")
    public ResponseEntity<?> createCourse(@RequestBody CourseRequest courseRequest) {
        // Проверка на наличие учителя
        Optional<User> teacherOptional = userRepository.findById(courseRequest.getTeacherId());
        if (teacherOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Teacher not found");
        }

        // Проверка роли учителя
        User teacher = teacherOptional.get();
        if (!"ROLE_TEACHER".equals(teacher.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Пользователь не имеет права создавать курсы");
        }

        // Создание курса
        Course course = new Course(courseRequest.getTitle(), courseRequest.getDescription(), teacher);
        Course createdCourse = courseRepository.save(course);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }
    @GetMapping("/GroupCourses/{groupId}")
    public ResponseEntity<List<Course>> getCoursesByGroupId(@PathVariable Integer groupId) {
        if (groupId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Course> courses = courseGroupsRepository.findCoursesByGroupId(groupId);
        if (courses.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(courses);
    }
    @GetMapping("/UserCourses/{userId}")
    public ResponseEntity<Set<Course>> getCoursesByUserId(@PathVariable Integer userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Integer> groupIds = userGroupsRepository.findGroupIdsByUserId(userId);
        if (groupIds.isEmpty()) {
            return ResponseEntity.ok(new HashSet<>());
        }

        // Set для хранения уникальных курсов
        Set<Course> courses = new HashSet<>();
        for (Integer groupId : groupIds) {
            List<Course> coursesInGroup = courseGroupsRepository.findCoursesByGroupId(groupId);
            courses.addAll(coursesInGroup);
        }

        if (courses.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(courses);
    }
}
