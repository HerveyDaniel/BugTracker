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
    /*can implement on frontend the logic for counting out how many of each priority/feature/progress
    first, let the api return the list of all tickets. then loop through all of them with tsx
    code and then display the final count by inserting tsx code into a html element. */

    /*conversely, we can implement business logic server-side for the above function.
    Make a method for each needed category (ex. int medPriorityCount) in the service class.
    use the ticketRepository.findAll() method to return the list. Then, iterate through the list
    and keep track of the count in a declared local variable*/

    //int lowCount();

    //int medCount();

    //int highCount();
}
