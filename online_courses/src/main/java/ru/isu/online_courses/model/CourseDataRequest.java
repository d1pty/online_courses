package ru.isu.online_courses.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CourseDataRequest {
    private String chapterTitle;
    private String chapterText;

}
