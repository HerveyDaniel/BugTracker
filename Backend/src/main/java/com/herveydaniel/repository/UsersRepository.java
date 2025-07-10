package com.herveydaniel.repository;

import com.herveydaniel.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByUsername(String username);
    Users findByIdIs(Long id);
}
