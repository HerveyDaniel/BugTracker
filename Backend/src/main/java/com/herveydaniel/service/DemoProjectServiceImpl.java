package com.herveydaniel.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.herveydaniel.demomodel.DemoProject;
import com.herveydaniel.demomodel.DemoTicket;
import com.herveydaniel.demomodel.DemoUsers;
import com.herveydaniel.demorepository.DemoProjectRepository;
import com.herveydaniel.demorepository.DemoTicketRepository;
import com.herveydaniel.demorepository.DemoUsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DemoProjectServiceImpl {

    @Autowired
    private DemoProjectRepository projectRepo;

    @Autowired
    private DemoUserServiceImpl userService;

    @Autowired
    private DemoUsersRepository usersRepository;

    @Autowired
    private DemoTicketServiceImpl ticketService;

    @Autowired
    private DemoTicketRepository ticketRepo;

    @Autowired
    private ObjectMapper objectMapper;

    public List<DemoProject> getAllProjects() {
        return projectRepo.findAll();
    }

    public DemoProject createProject(Map<String, String> requestData) throws Exception {

        List<Long> appendUsers = objectMapper.readValue(requestData.get("assignedUsers"), new TypeReference<List<Long>>() {});

        DemoProject project = DemoProject.builder()
                .projectName(requestData.get("projectName"))
                .projectDescription(requestData.get("projectDescription"))
                .projectTickets(new ArrayList<>())
                .assignedUsers(new ArrayList<>())
                .build();

        projectRepo.save(project);

        Optional<DemoProject> newProject = projectRepo.findById(project.getProjectId());

        for(Long userId : appendUsers) {
            DemoUsers user = usersRepository.findByIdIs(userId);
            newProject.get().getAssignedUsers().add(user);
            user.setAssignedproject(newProject.get());
            usersRepository.save(user);
        }

        return projectRepo.save(newProject.get());
    }

    public DemoUsers assignProjectUser(Long id, Map<String, DemoProject> update) throws Exception{
        DemoUsers user = usersRepository.findById(id).orElseThrow(() -> new Exception("User with this ID does not exist"));
        if(update.containsKey("assignedProject")){
            user.setAssignedproject(update.get("assignedProject"));
        }
        DemoUsers updatedUser = usersRepository.save(user);
        return updatedUser;
    }

    public DemoUsers assignProjectUser(Long projectId, Long userId) throws Exception{
        DemoUsers user = usersRepository.findById(userId).orElseThrow(() -> new Exception("User with this ID does not exist"));
        DemoProject project = projectRepo.findById(projectId).orElseThrow(() -> new Exception("Project with this ID does not exist"));
        user.setAssignedproject(project);
        DemoUsers updatedUser = usersRepository.save(user);
        return updatedUser;
    }

    public DemoTicket assignProjectTicket(Long projectId, Long ticketId) throws Exception {
        DemoProject projectToAdd = projectRepo.findByProjectId(projectId);
        DemoTicket assigningTo = ticketService.findTicketById(ticketId);

        assigningTo.setProject(projectToAdd);
        ticketRepo.save(assigningTo);
        return assigningTo;
    }

    public DemoProject editProject(Map<String, String> requestData) throws Exception{
        Long projectId = Long.valueOf(requestData.get("projectId"));
        DemoProject projectToEdit = projectRepo.findById(projectId).orElseThrow(() ->  new Exception("Project with this ID does not exist."));

        List<Long> appendUsers = objectMapper.readValue(requestData.get("selectedUsersData"), new TypeReference<List<Long>>() {});

        for(Long userId : appendUsers) {
            DemoUsers user = usersRepository.findById(userId).orElseThrow(() -> new Exception("User with this ID does not exist"));
            user.setAssignedproject(projectToEdit);
            projectToEdit.getAssignedUsers().add(user);
            usersRepository.save(user);
        }

        projectToEdit.setProjectName(requestData.get("projectName"));
        projectToEdit.setProjectDescription(requestData.get("projectDescription"));

        return projectRepo.save(projectToEdit);
    }

    public void deleteProject(Long id)throws Exception {
        DemoProject project = projectRepo.findById(id).orElseThrow(() ->  new Exception("Project with this ID does not exist."));
        projectRepo.delete(project);
    }

    public DemoProject findProjectById(Long id) {
        return projectRepo.findByProjectId(id);
    }

    public DemoProject getUserProject(Long id) {
        DemoUsers currentUser = usersRepository.findByIdIs(id);
        return currentUser.getAssignedproject();
    }
}
