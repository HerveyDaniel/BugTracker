package com.herveydaniel.service;

import com.herveydaniel.demomodel.*;
import com.herveydaniel.demorepository.DemoProjectRepository;
import com.herveydaniel.demorepository.DemoTicketRepository;
import com.herveydaniel.demorepository.DemoUsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DemoTicketServiceImpl{

    @Autowired
    private DemoTicketRepository ticketRepo;

    @Autowired
    private DemoProjectRepository projectRepo;

    @Autowired
    private DemoUsersRepository usersRepo;

    @Autowired
    private DemoUserServiceImpl userService;

    public List<DemoTicket> getAllTickets() {
        return ticketRepo.findAll();
    }

    public DemoTicket findTicketById(Long id) throws Exception{
        DemoTicket ticket = ticketRepo.findByTicketIdIs(id);
        return ticket;
    }

    public DemoTicket createTicket(Long id, DemoTicket ticket) throws Exception {
        DemoProject project = projectRepo.findById(id).orElseThrow(() ->  new Exception("Project with this ID does not exist."));
        ticket.setProject(project);
        project.getProjectTickets().add(ticket);
        return ticketRepo.save(ticket);
    }

    public DemoTicket assignTicket(Map<String, Long> requestData) throws Exception{
        Long id = requestData.get("id");
        Long ticketId = requestData.get("ticketId");
        DemoTicket ticketToAdd = ticketRepo.findById(ticketId).orElseThrow(() ->  new Exception("Ticket with this ID does not exist."));
        DemoUsers assigningTo = usersRepo.findById(id).orElseThrow(() ->  new Exception("User with this ID does not exist."));

        ticketToAdd.setAssignedUsers(assigningTo);
        assigningTo.getAssignedTickets().add(ticketToAdd);
        ticketRepo.save(ticketToAdd);
        return ticketToAdd;
    }

    public DemoTicket editTicket(Map<String, String> requestData) throws Exception{
        Long ticketId = Long.valueOf(requestData.get("ticketId"));
        DemoTicket ticketToEdit = ticketRepo.findById(ticketId).orElseThrow(() ->  new Exception("Ticket with this ID does not exist."));
        DemoProject demoProject;

        if(requestData.get("addToProject") != null){
            if(Long.valueOf(requestData.get("addToProject")) != 0) {
                demoProject = projectRepo.findByProjectId(Long.valueOf(requestData.get("addToProject")));
            } else {
                demoProject = projectRepo.findByProjectId(ticketToEdit.getProject().getProjectId());
            }
        } else {
            demoProject = projectRepo.findByProjectId(ticketToEdit.getProject().getProjectId());
        }

        DemoTicket editedTicket = DemoTicket.builder()
                .ticketId(ticketToEdit.getTicketId())
                .ticketTitle(requestData.get("ticketTitle"))
                .priorityStatus(DemoPriority.valueOf(requestData.get("priorityStatus")))
                .ticketType(DemoType.valueOf(requestData.get("ticketType")))
                .ticketProgress(DemoProgress.valueOf(requestData.get("ticketProgress")))
                .ticketInfo(requestData.get("ticketInfo"))
                .project(demoProject)
                .assignedUsers(ticketToEdit.getAssignedUsers())
                .ticketComments(ticketToEdit.getTicketComments())
                .build();

        ticketRepo.save(editedTicket);
        return editedTicket;
    }

    public List<DemoTicket> getUserTickets(Long userId) throws Exception{
        DemoUsers currentUser = usersRepo.findById(userId).orElseThrow(() ->  new Exception("Demo User with this ID does not exist."));
        return currentUser.getAssignedTickets();
    }

    public List<DemoTicket> getProjectTickets(Long userId) throws Exception {
        DemoUsers currentUser = userService.findUserById(userId);

        List<DemoTicket> userProjectTickets = currentUser.getAssignedproject().getProjectTickets();
        List<DemoTicket> unassignedTickets = new ArrayList<>();

        for(DemoTicket ticket : userProjectTickets){
            if(ticket.getAssignedUsers() == null) {
                unassignedTickets.add(ticket);
            }
        }

        return unassignedTickets;
    }

    public List<DemoTicket> getAllProjectTickets() {
        List<DemoTicket> allTickets = ticketRepo.findAll();
        List<DemoTicket> unassignedTickets = new ArrayList<>();

        for(DemoTicket ticket : allTickets) {
            if(ticket.getAssignedUsers() == null){
                unassignedTickets.add(ticket);
            }
        }
        return unassignedTickets;
    }

    public void deleteTicket(Long id) throws Exception {
        DemoTicket ticket = ticketRepo.findById(id).orElseThrow(() ->  new Exception("Ticket with this ID does not exist."));

        if(ticket.getProject() != null) {
            ticket.getProject().getProjectTickets().remove(ticket);
        }
        ticketRepo.delete(ticket);
    }

    public List<DemoTicket> ticketFilter(
            String infix,
            DemoPriority priority,
            DemoProgress progress,
            DemoType type,
            String role,
            int projectId
    )
    {
        List<DemoTicket> allTickets = ticketRepo.findAll();

        if(role.equals("DEMOUSER")) {
            Iterator<DemoTicket> iterator = allTickets.iterator();
            while(iterator.hasNext()){
                if(iterator.next().getProject().getProjectId() != projectId){
                    iterator.remove();
                }
            }
        }

        return allTickets
                .stream()
                .filter(ticket -> (infix==(null) || ticket.getTicketTitle().toLowerCase().contains(infix.toLowerCase())))
                .filter(ticket -> (priority==(null) || ticket.getPriorityStatus()==(priority)))
                .filter(ticket -> (progress==(null) || ticket.getTicketProgress()==(progress)))
                .filter(ticket -> (type==(null) || ticket.getTicketType()==(type)))
                .filter(ticket -> ticket.getAssignedUsers() == null)
                .collect(Collectors.toList());
    }

    public List<DemoComment> createComment(Map<String, String> requestData) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("MM-dd-yyyy HH:mm");

        DemoTicket ticket = ticketRepo.findByTicketId(Long.valueOf(requestData.get("selectedTicketId")));
        if(ticket.getTicketComments() == null) {
            ticket.setTicketComments(new ArrayList<>());
        }
        ticket.getTicketComments().add(new DemoComment(requestData.get("createdBy"), requestData.get("content"), "Posted on: " + LocalDateTime.now().format(dateTimeFormatter)));
        ticketRepo.save(ticket);
        return ticket.getTicketComments();
    }

    public void deleteComment(Map<String, Long> requestData, int commentIndex) throws Exception{
        Long ticketId = Long.valueOf(requestData.get("ticketId"));
        DemoTicket ticket = ticketRepo.findById(ticketId).orElseThrow(() ->  new Exception("Ticket with this ID does not exist."));
        ticket.getTicketComments().remove(commentIndex);
        ticketRepo.save(ticket);
    }
}
