package com.herveydaniel.controller;

import com.herveydaniel.demomodel.*;
import com.herveydaniel.model.*;
import com.herveydaniel.service.DemoTicketServiceImpl;
import com.herveydaniel.service.TicketServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class DemoTicketController {

    @Autowired
    private DemoTicketServiceImpl ticketServiceImpl; //This may have to be an instance of TicketService

    @GetMapping("/demo/api/admin/ticket")
    public List<DemoTicket> getAllTickets() {
        return ticketServiceImpl.getAllTickets();
    }

    //Both
    @GetMapping("/demo/api/ticket/{id}")
    public DemoTicket getTicketById(@PathVariable Long id) throws Exception {
        return ticketServiceImpl.findTicketById(id);
    }

    @PostMapping("/demo/api/ticket/{id}")
    public DemoTicket createTicket(@PathVariable Long id, @RequestBody DemoTicket ticket) throws Exception{
        return ticketServiceImpl.createTicket(id, ticket);
    }

    @PutMapping("/demo/api/ticket/assign")
    public DemoTicket assignTicket(@RequestBody Map<String, Long> requestData) throws Exception {
        return ticketServiceImpl.assignTicket(requestData);
    }

    @PutMapping("/demo/api/ticket/edit")
    public DemoTicket editTicket(@RequestBody Map<String, String> requestData) throws Exception {
        return ticketServiceImpl.editTicket(requestData);
    }

    @DeleteMapping("/demo/api/admin/ticket/{id}")
    public void deleteTicket(@PathVariable Long id) throws Exception {
        ticketServiceImpl.deleteTicket(id);
    }

    @GetMapping("/demo/api/ticket/search")
    public List<DemoTicket> ticketFilter(
            @RequestParam(value = "param1", defaultValue = "") String infix,
            @RequestParam(value = "param2", defaultValue = "") DemoPriority priority,
            @RequestParam(value = "param3", defaultValue = "") DemoProgress progress,
            @RequestParam(value = "param4", defaultValue = "") DemoType type,
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

    @GetMapping("/demo/api/ticket/usertickets")
    public List<DemoTicket> getUserTickets(@RequestParam("param1") Long userId) throws Exception{
        return ticketServiceImpl.getUserTickets(userId);
    }

    @GetMapping("/demo/api/ticket/projecttickets")
    public List<DemoTicket> getProjectTickets(@RequestParam("param1") Long userId) throws Exception {
        return ticketServiceImpl.getProjectTickets(userId);
    }

    @GetMapping("/demo/api/admin/ticket/allProjecttickets")
    public List<DemoTicket> getAllProjectTickets() {
        return ticketServiceImpl.getAllProjectTickets();
    }

    @PutMapping("/demo/api/ticket/comment")
    public List<DemoComment> createComment(@RequestBody Map<String, String> requestData)
    {
        return ticketServiceImpl.createComment(requestData);
    }

    @PutMapping("/demo/api/admin/ticket/comment/{commentIndex}")
    public void deleteComment(@RequestBody Map<String, Long> requestData, @PathVariable int commentIndex) throws Exception{
        ticketServiceImpl.deleteComment(requestData, commentIndex);
    }
}
