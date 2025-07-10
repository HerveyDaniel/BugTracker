package com.herveydaniel.service;

import com.herveydaniel.model.Project;
import java.util.List;

public interface ProjectService {
    List<Project> getAllProjects();
    Project createProject(Project project);
    void deleteProject(Long id) throws Exception;
}
