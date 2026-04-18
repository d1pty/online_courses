package ru.isu.online_courses.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import ru.isu.online_courses.model.AddStudentRequest;
import ru.isu.online_courses.model.Groups;
import ru.isu.online_courses.model.User;
import ru.isu.online_courses.model.UserGroups;
import ru.isu.online_courses.repository.GroupsRepository;
import ru.isu.online_courses.repository.UserGroupsRepository;
import ru.isu.online_courses.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GroupsController {

    @Autowired
    private GroupsRepository groupRepository;
    
    @Autowired
    private UserGroupsRepository userGroupsRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userRepository.findAll().stream()
            .filter(user -> "ROLE_STUDENT".equals(user.getRole()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(students);
    }
    
    @PostMapping("/group/{groupId}/addStudent")
    public ResponseEntity<?> addStudentToGroup(@PathVariable Integer groupId, @RequestBody AddStudentRequest request) {
        Groups group = groupRepository.findById(groupId).orElse(null);
        User user = userRepository.findById(request.getUserId()).orElse(null);

        if (group == null || user == null) {
            return ResponseEntity.notFound().build();
        }

        UserGroups userGroup = new UserGroups();
        userGroup.setGroup(group);
        userGroup.setUser(user);
        userGroupsRepository.save(userGroup);

        return ResponseEntity.status(HttpStatus.CREATED).body(userGroup);
    }
    
    @GetMapping("/group/{groupId}/students")
    public ResponseEntity<List<User>> getStudentsInGroup(@PathVariable Integer groupId) {
        Groups group = groupRepository.findById(groupId).orElse(null);
        if (group == null) {
            return ResponseEntity.notFound().build();
        }

        List<User> students = userGroupsRepository.findUsersByGroupId(groupId);
        return ResponseEntity.ok(students);
    }
    @PostMapping("/group/{groupId}/deleteStudent/{userId}")
    public ResponseEntity<?> removeStudentFromGroup(@PathVariable Integer groupId, @PathVariable Integer userId) {
        UserGroups userGroup = userGroupsRepository.findByGroupIdAndUserId(groupId, userId).orElse(null);
        if (userGroup == null) {
            return ResponseEntity.notFound().build();
        }

        userGroupsRepository.delete(userGroup);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/groups")
    public ResponseEntity<List<Groups>> getAllGroups() {
        List<Groups> groups = groupRepository.findAll();
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<Groups> getGroupById(@PathVariable Integer groupId) {
        Groups group = groupRepository.findById(groupId).orElse(null);
        if (group == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(group);
    }

    @PostMapping("/addGroup")
    public ResponseEntity<Groups> createGroup(@RequestBody Groups group) {
        Groups createdGroup = groupRepository.save(group);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGroup);
    }

    @PostMapping("/updateGroup/{groupId}")
    public ResponseEntity<Groups> updateGroup(@PathVariable Integer groupId, @RequestBody Groups newGroup) {
        Groups group = groupRepository.findById(groupId).orElse(null);
        if (group == null) {
            return ResponseEntity.notFound().build();
        }
        group.setGroupName(newGroup.getGroupName());
        groupRepository.save(group);
        return ResponseEntity.ok(group);
    }

    @PostMapping("/deleteGroup/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable Integer groupId) {
        if (groupRepository.existsById(groupId)) {
            groupRepository.deleteById(groupId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    @GetMapping("/UserGroups/{userId}")
    public ResponseEntity<List<Integer>> getGroupIdsByUserId(@PathVariable Integer userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Integer> groupIds = userGroupsRepository.findGroupIdsByUserId(userId);
        if (groupIds.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(groupIds);
    }
}
