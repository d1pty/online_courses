package ru.isu.online_courses.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CourseRequest {
    private String title;
    private String description;
    private Integer teacherId;

}