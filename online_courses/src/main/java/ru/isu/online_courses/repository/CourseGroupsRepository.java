package ru.isu.online_courses.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.isu.online_courses.model.Course;
import ru.isu.online_courses.model.CourseGroups;
import ru.isu.online_courses.model.Groups;

@Repository
public interface CourseGroupsRepository extends JpaRepository<CourseGroups, Integer> {
    @Query("SELECT cg.group FROM CourseGroups cg WHERE cg.course.id = :courseId")
    List<Groups> findGroupsByCourseId(@Param("courseId") Integer courseId);
    
    @Query("SELECT cg.course FROM CourseGroups cg WHERE cg.group.id = :groupId")
    List<Course> findCoursesByGroupId(@Param("groupId") Integer groupId);

    Optional<CourseGroups> findByCourseIdAndGroupId(Integer courseId, Integer groupId);
}