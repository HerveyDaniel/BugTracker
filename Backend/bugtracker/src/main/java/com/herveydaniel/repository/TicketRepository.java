package com.herveydaniel.repository;

import com.herveydaniel.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Ticket findByTicketId(Long id);
    Ticket findByTicketIdIs(Long id);
}
