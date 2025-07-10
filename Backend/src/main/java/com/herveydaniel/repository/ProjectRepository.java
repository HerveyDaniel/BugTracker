package com.herveydaniel.repository;

import com.herveydaniel.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProjectRepository extends JpaRepository<Project, Long> {

    Project findByProjectId(Long id);

}
