package com.herveydaniel.service;

import com.herveydaniel.model.*;
import com.herveydaniel.repository.ProjectRepository;
import com.herveydaniel.repository.TicketRepository;
import com.herveydaniel.repository.UsersRepository;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class TicketServiceImpl implements TicketService{
    @Autowired
    private TicketRepository ticketRepo;

    @Autowired
    private ProjectRepository projectRepo;

    @Autowired
    private UsersRepository usersRepo;

    @Autowired
    private UserServiceImpl userService;

    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepo.findAll();
    }

    public Ticket findTicketById(Long id) throws Exception{
        Ticket ticket = ticketRepo.findByTicketIdIs(id);
        return ticket;
    }

    @Override
    public Ticket createTicket(Long id, Ticket ticket) throws Exception {
        Project project = projectRepo.findById(id).orElseThrow(() ->  new Exception("Project with this ID does not exist."));
        ticket.setProject(project);
        project.getProjectTickets().add(ticket);
        return ticketRepo.save(ticket);
    }

    public Ticket assignTicket(Map<String, Long> requestData) throws Exception{
        Long id = requestData.get("id");
        Long ticketId = requestData.get("ticketId");
        Ticket ticketToAdd = ticketRepo.findById(ticketId).orElseThrow(() ->  new Exception("Ticket with this ID does not exist."));
        Users assigningTo = usersRepo.findById(id).orElseThrow(() ->  new Exception("User with this ID does not exist."));

        ticketToAdd.setAssignedUsers(assigningTo);
        assigningTo.getAssignedTickets().add(ticketToAdd);
        ticketRepo.save(ticketToAdd);
        return ticketToAdd;
    }

    public Ticket editTicket(Map<String, String> requestData) throws Exception{
        Long ticketId = Long.valueOf(requestData.get("ticketId"));
        Ticket ticketToEdit = ticketRepo.findById(ticketId).orElseThrow(() ->  new Exception("Ticket with this ID does not exist."));
        Project project;

        if(requestData.get("addToProject") != null){
            if(Long.valueOf(requestData.get("addToProject")) != 0) {
                project = projectRepo.findByProjectId(Long.valueOf(requestData.get("addToProject")));
            } else {
                project = projectRepo.findByProjectId(ticketToEdit.getProject().getProjectId());
            }
        } else {
            project = projectRepo.findByProjectId(ticketToEdit.getProject().getProjectId());
        }


        Ticket editedTicket = Ticket.builder()
                .ticketId(ticketToEdit.getTicketId())
                .ticketTitle(requestData.get("ticketTitle"))
                .priorityStatus(Priority.valueOf(requestData.get("priorityStatus")))
                .ticketType(Type.valueOf(requestData.get("ticketType")))
                .ticketProgress(Progress.valueOf(requestData.get("ticketProgress")))
                .ticketInfo(requestData.get("ticketInfo"))
                .project(project)
                .assignedUsers(ticketToEdit.getAssignedUsers())
                .ticketComments(ticketToEdit.getTicketComments())
                .build();

        ticketRepo.save(editedTicket);
        return editedTicket;
    }

    public List<Ticket> getUserTickets(Long userId) throws Exception{
        Users currentUser = userService.findUserById(userId);
        return currentUser.getAssignedTickets();
    }

    public List<Ticket> getProjectTickets(Long userId) throws Exception {
        Users currentUser = userService.findUserById(userId);
        List<Ticket> userProjectTickets = currentUser.getAssignedProject().getProjectTickets();
        List<Ticket> unassignedTickets = new ArrayList<>();

        for(Ticket ticket : userProjectTickets){
            if(ticket.getAssignedUsers() == null) {
                unassignedTickets.add(ticket);
            }
        }

        return unassignedTickets;
    }

    public List<Ticket> getAllProjectTickets() {
        List<Ticket> allTickets = ticketRepo.findAll();
        List<Ticket> unassignedTickets = new ArrayList<>();

        for(Ticket ticket : allTickets) {
            if(ticket.getAssignedUsers() == null){
                unassignedTickets.add(ticket);
            }
        }
        return unassignedTickets;
    }

    @Override
    public void deleteTicket(Long id) throws Exception {
        Ticket ticket = ticketRepo.findById(id).orElseThrow(() ->  new Exception("Ticket with this ID does not exist."));
        ticketRepo.delete(ticket);
    }

    @Override
    public List<Ticket> ticketFilter(
            String infix,
            Priority priority,
            Progress progress,
            Type type,
            String role,
            int projectId
        )
    {
        List<Ticket> allTickets = ticketRepo.findAll();

        if(role.equals("USER")) {
            Iterator<Ticket> iterator = allTickets.iterator();
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

    public List<Comment> createComment(Long ticketId, String createdBy, String content) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("MM-dd-yyyy HH:mm");
        String now = LocalDateTime.now().format(dateTimeFormatter);
        Ticket ticket = ticketRepo.findByTicketId(ticketId);
        if(ticket.getTicketComments() == null) {
            ticket.setTicketComments(new ArrayList<>());
        }
        ticket.getTicketComments().add(new Comment(createdBy, content, LocalDateTime.now()));
        ticketRepo.save(ticket);
        return ticket.getTicketComments();
    }

    public void deleteComment(Map<String, Long> requestData, int commentIndex) throws Exception{
        Long ticketId = Long.valueOf(requestData.get("ticketId"));
        Ticket ticket = ticketRepo.findById(ticketId).orElseThrow(() ->  new Exception("Ticket with this ID does not exist."));
        ticket.getTicketComments().remove(commentIndex);
        ticketRepo.save(ticket);
    }
}
