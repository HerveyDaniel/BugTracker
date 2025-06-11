package com.herveydaniel.demorepository;

import com.herveydaniel.demomodel.DemoUsers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DemoUserRepository extends JpaRepository<DemoUsers, Long> {

    //Users findByUsername(String username);
}
