package ru.isu.online_courses.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.isu.online_courses.model.User;
import ru.isu.online_courses.model.UserGroups;
@Repository
public interface UserGroupsRepository extends JpaRepository<UserGroups, Integer> {
    @Query("SELECT ug.user FROM UserGroups ug WHERE ug.group.id = :groupId")
    List<User> findUsersByGroupId(@Param("groupId") Integer groupId);
    
    @Query("SELECT ug.group.id FROM UserGroups ug WHERE ug.user.id = :userId")
    List<Integer> findGroupIdsByUserId(@Param("userId") Integer userId);

    Optional<UserGroups> findByGroupIdAndUserId(Integer groupId, Integer userId);
}
