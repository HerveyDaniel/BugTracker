package com.herveydaniel.controller;

import com.herveydaniel.demomodel.DemoProject;
import com.herveydaniel.service.DemoProjectServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class DemoProjectController {
    @Autowired
    private DemoProjectServiceImpl projectServiceImpl;

    @GetMapping("/demo/api/admin/project")
    public List<DemoProject> getAllProjects() {
        return projectServiceImpl.getAllProjects();
    }

    @PostMapping("/demo/api/admin/project")
    public DemoProject createProject(@RequestBody Map<String, String> requestData) throws Exception {
        return projectServiceImpl.createProject(requestData);
    }

    @PutMapping("/demo/api/admin/project/edit")
    public DemoProject editProject(@RequestBody Map<String, String> requestData) throws Exception {
        return projectServiceImpl.editProject(requestData);
    }

    @DeleteMapping("/demo/api/admin/project/{id}")
    public void deleteProject(@PathVariable Long id) throws Exception {
        projectServiceImpl.deleteProject(id);
    }

    @GetMapping("/demo/api/admin/project/{id}")
    public DemoProject findProjectById(@PathVariable Long id) {
        return projectServiceImpl.findProjectById(id);
    }

    @GetMapping("/demo/api/project/userproject/{id}")
    public DemoProject getUserProject(@PathVariable Long id) {
        return projectServiceImpl.getUserProject(id);
    }
}
