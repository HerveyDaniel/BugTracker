package com.herveydaniel.controller;

import com.herveydaniel.model.*;
import com.herveydaniel.service.ProjectServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ProjectController {
    @Autowired
    private ProjectServiceImpl projectServiceImpl;

    @GetMapping("/api/admin/project")
    public List<Project> getAllProjects() {
        return projectServiceImpl.getAllProjects();
    }

    @PostMapping("/api/admin/project/{id}")
    public Project createProject(@PathVariable Long id, @RequestBody Project project) throws Exception {
        return projectServiceImpl.createProject(id, project);
    }

    @PutMapping("/api/admin/project/edit")
    public Project editProject(@RequestBody Map<String,String> requestData) throws Exception {
        return projectServiceImpl.editProject(requestData);
    }

    @DeleteMapping("/api/admin/project/{id}")
    public void deleteProject(@PathVariable Long id) throws Exception {
        projectServiceImpl.deleteProject(id);
    }

    @GetMapping("/api/admin/project/{id}")
    public Project findProjectById(@PathVariable Long id) {
        return projectServiceImpl.findProjectById(id);
    }

    @GetMapping("/api/project/userproject/{id}")
    public Project getUserProject(@PathVariable Long id) {
        return projectServiceImpl.getUserProject(id);
    }
}
