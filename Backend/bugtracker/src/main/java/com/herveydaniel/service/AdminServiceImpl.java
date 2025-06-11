package com.herveydaniel.service;

import com.herveydaniel.model.Role;
import com.herveydaniel.model.Users;
import com.herveydaniel.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService{

    @Autowired
    private UsersRepository usersRepository;

//    @Override
//    public void setUserRole(String user, Role role) {
//        Users currentUser = usersRepository.findByUsername(user);
//        currentUser.setUserRole(role);
//    }
}
