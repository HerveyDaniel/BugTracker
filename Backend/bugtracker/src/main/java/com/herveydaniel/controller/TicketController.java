package com.herveydaniel.controller;


import com.fasterxml.jackson.annotation.JsonView;
import com.herveydaniel.model.*;
import com.herveydaniel.service.TicketServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class TicketController {

    @Autowired
    private TicketServiceImpl ticketServiceImpl;


    @GetMapping("/api/admin/ticket")
    public List<Ticket> getAllTickets() {
        return ticketServiceImpl.getAllTickets();
    }

    //Both
    @GetMapping("/api/ticket/{id}")
    public Ticket getTicketById(@PathVariable Long id) throws Exception {
        return ticketServiceImpl.findTicketById(id);
    }

    //Both
    @PostMapping("/api/ticket/{id}")
    public Ticket createTicket(@PathVariable Long id, @RequestBody Ticket ticket) throws Exception{
        return ticketServiceImpl.createTicket(id, ticket);
    }

    //Both
    @PutMapping("/api/ticket/assign")
    public Ticket assignTicket(@RequestBody Map<String, Long> requestData) throws Exception {
        return ticketServiceImpl.assignTicket(requestData);
    }

    //Both
    @PutMapping("/api/ticket/edit")
    public Ticket editTicket(@RequestBody Map<String, String> requestData) throws Exception {
        return ticketServiceImpl.editTicket(requestData);
    }

    //Admin
    @DeleteMapping("/api/admin/ticket/{id}")
    public void deleteTicket(@PathVariable Long id) throws Exception {
        ticketServiceImpl.deleteTicket(id);
    }

    //Both
    @GetMapping("/api/ticket/search")
    public List<Ticket> ticketFilter(
            @RequestParam(value = "param1", defaultValue = "") String infix,
            @RequestParam(value = "param2", defaultValue = "") Priority priority,
            @RequestParam(value = "param3", defaultValue = "") Progress progress,
            @RequestParam(value = "param4", defaultValue = "") Type type,
            @RequestParam(value = "param5", defaultValue = "") String role,
            @RequestParam(value = "param6", defaultValue = "0", required = false) int projectId
    )
    {
        return ticketServiceImpl.ticketFilter(
                infix,
                priority,
                progress,
                type,
                role,
                projectId
        );
    }

    //Both
    @GetMapping("/api/ticket/usertickets")
    public List<Ticket> getUserTickets(@RequestParam("param1") Long userId) throws Exception{
      return ticketServiceImpl.getUserTickets(userId);
    }

    //Both
    @GetMapping("/api/ticket/projecttickets")
    public List<Ticket> getProjectTickets(@RequestParam("param1") Long userId) throws Exception {
        return ticketServiceImpl.getProjectTickets(userId);
    }

    //Admin
    @GetMapping("/api/admin/ticket/allProjecttickets")
    public List<Ticket> getAllProjectTickets() {
        return ticketServiceImpl.getAllProjectTickets();
    }

    //Both
    @PutMapping("/api/ticket/comment")
    public List<Comment> createComment(@RequestBody CommentDto commentDto)
    {
        return ticketServiceImpl.createComment(commentDto.getSelectedTicket().getTicketId(), commentDto.getCreatedBy(), commentDto.getContent());
    }

    //Admin
    @PutMapping("/api/admin/ticket/comment/{commentIndex}")
    public void deleteComment(@RequestBody Map<String, Long> requestData, @PathVariable int commentIndex) throws Exception{
        ticketServiceImpl.deleteComment(requestData, commentIndex);
    }
}



