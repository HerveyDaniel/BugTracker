package com.herveydaniel.controller;

import com.herveydaniel.demomodel.DemoUserDto;
import com.herveydaniel.demomodel.DemoUsers;
import com.herveydaniel.service.DemoUserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class DemoUserController {

    @Autowired
    private DemoUserServiceImpl userService;

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

    @PutMapping("/demo/api/admin/users/edit")
    public DemoUsers editUser(@RequestBody Map<String,String> requestData) throws Exception {
        return userService.editUser(requestData);
    }

    @DeleteMapping("/demo/api/admin/users/{id}")
    public void deleteUser(@PathVariable Long id) throws Exception{
        userService.deleteUser(id);
    }
}
