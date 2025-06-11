package com.herveydaniel.demorepository;

import com.herveydaniel.demomodel.DemoUsers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DemoUsersRepository extends JpaRepository<DemoUsers, Long> {

    Optional<DemoUsers> findByUsername(String username);
    DemoUsers findByIdIs(Long id);
}
