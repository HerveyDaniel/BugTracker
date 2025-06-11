package com.herveydaniel.service;
import java.util.List;
import java.util.Map;

import com.herveydaniel.model.Users;

public interface UserService {

    List<Users> getAllUsers();
    Users createUser(Map<String, String> requestData) throws Exception;
    void deleteUser(Long id) throws Exception;
}
