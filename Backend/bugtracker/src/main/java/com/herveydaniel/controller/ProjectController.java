package com.herveydaniel.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.herveydaniel.model.*;
import com.herveydaniel.service.ProjectServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
public class ProjectController {
    @Autowired
    private ProjectServiceImpl projectServiceImpl;

    //Admin
    @GetMapping("/api/admin/project")
    public List<Project> getAllProjects() {
        return projectServiceImpl.getAllProjects();
    }

    //Admin
    @PostMapping("/api/admin/project/{id}")
    public Project createProject(@PathVariable Long id, @RequestBody Project project) throws Exception {
        return projectServiceImpl.createProject(id, project);
    }

    //Admin? (see frontend implementation)
//    @PatchMapping("/project/user/{id}")
//    public Users assignProjectUser(@PathVariable Long id, @RequestBody Map<String, Project> update) throws Exception {
//        return projectServiceImpl.assignProjectUser(id, update);
//    }

    //Admin? (This might be vestigial; see which one of the two methods are used)
//    @PutMapping("/project/user")
//    public Users assignProjectUser(
//            @RequestParam(value = "param1") Long projectId,
//            @RequestParam(value = "param2") Long userId
//            ) throws Exception {
//        return projectServiceImpl.assignProjectUser(projectId, userId);
//    }

    //Admin? (see frontend implementation)
//    @PutMapping("/project/ticket")
//    public Ticket assignProjectTicket(
//            @RequestParam(value = "param1") Long projectId,
//            @RequestParam(value = "param2") Long ticketId
//    ) throws Exception {
//        return projectServiceImpl.assignProjectTicket(projectId, ticketId);
//    }

    //Admin
    @PutMapping("/api/admin/project/edit")
    public Project editProject(@RequestBody Map<String,String> requestData) throws Exception {
        return projectServiceImpl.editProject(requestData);
    }

//    @PutMapping("/project/edit/users")
//    public Project editProjectUsers(@RequestBody Map<String, List<Users>> requestData) throws Exception {
//        return projectServiceImpl.editProjectUsers(requestData);
//    }

    //Admin
    @DeleteMapping("/api/admin/project/{id}")
    public void deleteProject(@PathVariable Long id) throws Exception {
        projectServiceImpl.deleteProject(id);
    }

    //Admin
    @GetMapping("/api/admin/project/{id}")
    public Project findProjectById(@PathVariable Long id) {
        return projectServiceImpl.findProjectById(id);
    }

    //Both
    @GetMapping("/api/project/userproject/{id}")
    public Project getUserProject(@PathVariable Long id) {
        return projectServiceImpl.getUserProject(id);
    }
//    @GetMapping("/ticket/search")
//    public List<Ticket> ticketFilter(
//            @RequestParam(value = "param1", defaultValue = "") String infix,
//            @RequestParam(value = "param2", defaultValue = "") Priority priority,
//            @RequestParam(value = "param3", defaultValue = "") Progress progress,
//            @RequestParam(value = "param4", defaultValue = "") Type type
//    )
//    {
//        return projectServiceImpl.ticketFilter(
//                infix,
//                priority,
//                progress,
//                type
//        );
//    }
//
//    @GetMapping("/ticket/usertickets")
//    public List<Ticket> getUserTickets(@RequestParam("param1") Long userId) throws Exception{
//        return projectServiceImpl.getUserTickets(userId);
//    }
}
