package com.herveydaniel.service;

import com.herveydaniel.model.Project;
import java.util.List;

public interface ProjectService {
    List<Project> getAllProjects();
    Project createProject(Project project);
    void deleteProject(Long id) throws Exception;

    //refer to TicketService interface class for similar business logic implementations.
    //Only admins will have the ability to create new projects;
}
