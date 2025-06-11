package com.herveydaniel.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.herveydaniel.model.*;
import com.herveydaniel.repository.ProjectRepository;
import com.herveydaniel.repository.TicketRepository;
import com.herveydaniel.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.DataInput;
import java.io.IOException;
import java.util.*;

@Service
public class ProjectServiceImpl {

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private TicketServiceImpl ticketService;

    @Autowired
    private TicketRepository ticketRepo;

    @Autowired
    private ObjectMapper objectMapper;

    public List<Project> getAllProjects() {
        return projectRepo.findAll();
    }

    public Project createProject(Long id, Project project) throws Exception {
        Users user = usersRepository.findById(id).orElseThrow(() -> new Exception("User with this ID does not exist"));
        project.getAssignedUsers().add(user);
        user.setAssignedProject(project);
        return projectRepo.save(project);
    }

    public Users assignProjectUser(Long id, Map<String, Project> update) throws Exception{
        Users user = usersRepository.findById(id).orElseThrow(() -> new Exception("User with this ID does not exist"));
        if(update.containsKey("assignedProject")){
            user.setAssignedProject(update.get("assignedProject"));
        }
        Users updatedUser = usersRepository.save(user);
        return updatedUser;
    }

    public Users assignProjectUser(Long projectId, Long userId) throws Exception{
        Users user = usersRepository.findById(userId).orElseThrow(() -> new Exception("User with this ID does not exist"));
        Project project = projectRepo.findById(projectId).orElseThrow(() -> new Exception("Project with this ID does not exist"));
        user.setAssignedProject(project);
        Users updatedUser = usersRepository.save(user);
        return updatedUser;
    }

//    public Project assignProjectUser(Long id, Map<String, Long> update) throws Exception{
//        Project project = projectRepo.findById(id).orElseThrow(() ->  new Exception("Project with this ID does not exist."));;
//        if(update.containsKey("assignedUserId")){
//            Users user = usersRepository.findById(update.get("assignedUserId")).orElseThrow(() ->  new Exception("Project with this ID does not exist."));
//            project.getAssignedUsers().add(user);
//        }
//        Project updatedProject = projectRepo.save(project);
//        return updatedProject;
//    }

    public Ticket assignProjectTicket(Long projectId, Long ticketId) throws Exception {
        Project projectToAdd = projectRepo.findByProjectId(projectId);
        Ticket assigningTo = ticketService.findTicketById(ticketId);

        assigningTo.setProject(projectToAdd);
        ticketRepo.save(assigningTo);
        return assigningTo;
    }

//    public Project editProject(Project requestData) throws Exception{
//        Long projectId = requestData.getProjectId();
//        Project projectToEdit = projectRepo.findById(projectId).orElseThrow(() ->  new Exception("Project with this ID does not exist."));
//
//        for(Users user : requestData.getAssignedUsers()) {
//            user.setAssignedProject(projectToEdit);
//            usersRepository.save(user);
//        }
//
//        projectToEdit.getAssignedUsers().addAll(requestData.getAssignedUsers());
//
//        Project editedProject = Project.builder()
//                .projectId(projectToEdit.getProjectId())
//                .projectName(requestData.getProjectName())
//                .projectDescription(requestData.getProjectDescription())
//                .projectTickets(projectToEdit.getProjectTickets())
//                .assignedUsers(projectToEdit.getAssignedUsers())
//                .build();
//
//        projectRepo.save(editedProject);
//        return editedProject;
//    }

    public Project editProject(Map<String, String> requestData) throws Exception{
        Long projectId = Long.valueOf(requestData.get("projectId"));
        Project projectToEdit = projectRepo.findById(projectId).orElseThrow(() ->  new Exception("Project with this ID does not exist."));

        List<Long> appendUsers = objectMapper.readValue(requestData.get("selectedUsersData"), new TypeReference<List<Long>>() {});

        for(Long userId : appendUsers) {
            Users user = usersRepository.findById(userId).orElseThrow(() -> new Exception("User with this ID does not exist"));
            user.setAssignedProject(projectToEdit);
            projectToEdit.getAssignedUsers().add(user);
            usersRepository.save(user);
        }

        Project editedProject = Project.builder()
                .projectId(projectToEdit.getProjectId())
                .projectName(requestData.get("projectName"))
                .projectDescription(requestData.get("projectDescription"))
                .projectTickets(projectToEdit.getProjectTickets())
                .assignedUsers(projectToEdit.getAssignedUsers())
                .build();

        projectRepo.save(editedProject);
        return editedProject;
    }

//    public List<Users> editProjectUsers(Map<String, List<Users>> requestData) {
//        return requestData.get("selectedUsersData");
//    }

    public void deleteProject(Long id)throws Exception {
        Project project = projectRepo.findById(id).orElseThrow(() ->  new Exception("Project with this ID does not exist."));
        projectRepo.delete(project);
    }

    public Project findProjectById(Long id) {
        return projectRepo.findByProjectId(id);
    }

    public Project getUserProject(Long id) {
        Users currentUser = usersRepository.findByIdIs(id);
        return currentUser.getAssignedProject();
    }
}
