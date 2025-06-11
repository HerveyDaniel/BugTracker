package com.herveydaniel.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.herveydaniel.demomodel.DemoUserDto;
import com.herveydaniel.demomodel.DemoUsers;
import com.herveydaniel.model.Project;
import com.herveydaniel.model.UserDto;
import com.herveydaniel.model.Users;
import com.herveydaniel.service.DemoUserServiceImpl;
import com.herveydaniel.service.UserService;
import com.herveydaniel.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class DemoUserController {
    @Autowired
    private DemoUserServiceImpl userService; //This is probably gonna have to be an instance of UserServiceImpl

    @GetMapping("/demo/api/admin/users")
    public List<DemoUsers> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/demo/api/users/{id}")
    public DemoUsers getUserById(@PathVariable Long id) throws Exception{
        return userService.findUserById(id);
    }

    @PostMapping("/demo/api/admin/users")
    public DemoUsers createUser(@RequestBody Map<String, String> requestData) {
        return userService.createUser(requestData);
    }

    @PostMapping("/demoadmin")
    public DemoUserDto createDemoAdmin(@RequestBody Map<String, String> requestData) {
        return userService.createDemoAdmin(requestData);
    }

//    @PostMapping("/demo/login")
//    public DemoUserDto login(@RequestBody DemoUsers users){ /*Will probably have to change request body to
//    an instance of a "credentials" class (in order to get username and passwords)*/
//        return userService.getAuth(users);
//    }

    @PutMapping("/demo/api/admin/users/edit")
    public DemoUsers editUser(@RequestBody Map<String,String> requestData) throws Exception {
        return userService.editUser(requestData);
    }

    @DeleteMapping("/demo/api/admin/users/{id}")
    public void deleteUser(@PathVariable Long id) throws Exception{
        userService.deleteUser(id);
    }
}
