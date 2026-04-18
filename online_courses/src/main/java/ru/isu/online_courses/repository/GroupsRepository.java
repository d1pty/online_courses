package ru.isu.online_courses.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isu.online_courses.model.Groups;

@Repository
public interface GroupsRepository extends JpaRepository<Groups, Integer> {
}
