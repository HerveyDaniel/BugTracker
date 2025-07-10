package com.herveydaniel.controller;

import com.herveydaniel.model.UserDto;
import com.herveydaniel.model.Users;
import com.herveydaniel.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/api/admin/users")
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/api/users/{id}")
    public Users getUserById(@PathVariable Long id) throws Exception{
        return userService.findUserById(id);
    }

    @PostMapping("/api/admin/users")
    public Users createUser(@RequestBody Map<String, String> requestData) throws Exception{
        return userService.createUser(requestData);
    }

    @PostMapping("/login")
    public UserDto login(@RequestBody Users users){
        return userService.getAuth(users);
    }

    @PutMapping("/api/admin/users/edit")
    public Users editUser(@RequestBody Map<String,String> requestData) throws Exception {
        return userService.editUser(requestData);
    }

    @DeleteMapping("/api/admin/users/{id}")
    public void deleteUser(@PathVariable Long id) throws Exception{
        userService.deleteUser(id);
    }
}
