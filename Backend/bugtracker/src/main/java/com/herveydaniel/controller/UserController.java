package com.herveydaniel.controller;

import com.herveydaniel.demomodel.DemoUserDto;
import com.herveydaniel.demomodel.DemoUsers;
import com.herveydaniel.model.Project;
import com.herveydaniel.model.UserDto;
import com.herveydaniel.model.Users;
import com.herveydaniel.service.UserService;
import com.herveydaniel.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private UserServiceImpl userService;

    //Admin
    @GetMapping("/api/admin/users")
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    //Both
    @GetMapping("/api/users/{id}")
    public Users getUserById(@PathVariable Long id) throws Exception{
        return userService.findUserById(id);
    }

    //Admin
    @PostMapping("/api/admin/users")
    public Users createUser(@RequestBody Map<String, String> requestData) throws Exception{
        return userService.createUser(requestData);
    }

    //Anyone(not just admin or user)
    @PostMapping("/login")
    public UserDto login(@RequestBody Users users){ /*Will probably have to change request body to
    an instance of a "credentials" class (in order to get username and passwords)*/
        return userService.getAuth(users);
    }

    //Admin
    @PutMapping("/api/admin/users/edit")
    public Users editUser(@RequestBody Map<String,String> requestData) throws Exception {
        return userService.editUser(requestData);
    }

    //Admin
    @DeleteMapping("/api/admin/users/{id}")
    public void deleteUser(@PathVariable Long id) throws Exception{
        userService.deleteUser(id);
    }
}
