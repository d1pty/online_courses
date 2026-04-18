package ru.isu.online_courses.payload.request;
 
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SignupRequest {
    private String username;
    private String role;
    private String password;
    private String name;
}
