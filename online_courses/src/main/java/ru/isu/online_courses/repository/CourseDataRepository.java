package ru.isu.online_courses.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isu.online_courses.model.CourseData;
@Repository
public interface CourseDataRepository extends JpaRepository<CourseData, Integer> {
    List<CourseData> findByCourseId(Integer courseId);
}