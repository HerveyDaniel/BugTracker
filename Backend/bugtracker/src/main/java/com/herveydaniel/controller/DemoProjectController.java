package com.herveydaniel.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.herveydaniel.demomodel.DemoProject;
import com.herveydaniel.demomodel.DemoTicket;
import com.herveydaniel.demomodel.DemoUsers;
import com.herveydaniel.service.DemoProjectServiceImpl;
import com.herveydaniel.service.ProjectServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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

//    @PatchMapping("/demo/project/user/{id}")
//    public DemoUsers assignProjectUser(@PathVariable Long id, @RequestBody Map<String, DemoProject> update) throws Exception {
//        return projectServiceImpl.assignProjectUser(id, update);
//    }

//    @PutMapping("/demo/project/user")
//    public DemoUsers assignProjectUser(
//            @RequestParam(value = "param1") Long projectId,
//            @RequestParam(value = "param2") Long userId
//    ) throws Exception {
//        return projectServiceImpl.assignProjectUser(projectId, userId);
//    }

//    @PutMapping("/demo/project/ticket")
//    public DemoTicket assignProjectTicket(
//            @RequestParam(value = "param1") Long projectId,
//            @RequestParam(value = "param2") Long ticketId
//    ) throws Exception {
//        return projectServiceImpl.assignProjectTicket(projectId, ticketId);
//    }

    @PutMapping("/demo/api/admin/project/edit")
    public DemoProject editProject(@RequestBody Map<String, String> requestData) throws Exception {
        return projectServiceImpl.editProject(requestData);
    }

//    @PutMapping("/project/edit/users")
//    public Project editProjectUsers(@RequestBody Map<String, List<Users>> requestData) throws Exception {
//        return projectServiceImpl.editProjectUsers(requestData);
//    }

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
