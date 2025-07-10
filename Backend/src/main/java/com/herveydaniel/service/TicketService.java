package com.herveydaniel.service;

import com.herveydaniel.model.Priority;
import com.herveydaniel.model.Progress;
import com.herveydaniel.model.Ticket;
import com.herveydaniel.model.Type;

import java.util.List;

public interface TicketService {
    List<Ticket> getAllTickets();
    Ticket createTicket(Long id, Ticket ticket) throws Exception;
    void deleteTicket(Long id) throws Exception;
    List<Ticket> ticketFilter(String infix, Priority priority, Progress progress, Type type, String role, int projectId);
}
