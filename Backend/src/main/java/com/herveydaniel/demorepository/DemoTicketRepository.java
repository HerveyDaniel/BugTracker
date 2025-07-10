package com.herveydaniel.demorepository;

import com.herveydaniel.demomodel.DemoTicket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DemoTicketRepository extends JpaRepository<DemoTicket, Long> {

    DemoTicket findByTicketId(Long id);
    DemoTicket findByTicketIdIs(Long id);
}
