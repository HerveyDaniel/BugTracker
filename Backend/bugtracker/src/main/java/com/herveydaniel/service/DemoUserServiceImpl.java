package com.herveydaniel.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.herveydaniel.demomodel.DemoProject;
import com.herveydaniel.demomodel.DemoRole;
import com.herveydaniel.demomodel.DemoUserDto;
import com.herveydaniel.demomodel.DemoUsers;
import com.herveydaniel.demorepository.DemoProjectRepository;
import com.herveydaniel.demorepository.DemoUsersRepository;
import com.herveydaniel.model.Project;
import com.herveydaniel.model.Role;
import com.herveydaniel.model.UserDto;
import com.herveydaniel.model.Users;
import com.herveydaniel.repository.UserRepository;
import com.herveydaniel.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Array;
import java.util.*;

import static com.herveydaniel.demomodel.DemoRole.DEMOADMIN;

@Service
public class DemoUserServiceImpl{

    @Autowired
    private DemoUserDto userDto;

    @Autowired
    private JwtServiceImpl jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ApplicationContext applicationContext;

    @Autowired
    private DemoUsersRepository userRepository;

    @Autowired
    private DemoProjectRepository projectRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    public List<DemoUsers> getAllUsers() {
        return userRepository.findAll();
    }

    //Will probably have to make this return a UserDto so sensitive info(like password) doesn't get exposed.
    public DemoUsers createUser(Map<String, String> requestData) {
        Long projectId = Long.valueOf(requestData.get("assignedproject"));

        Optional<DemoProject> assignedproject = projectRepository.findById(projectId);

        DemoUsers newUser = DemoUsers.builder()
                .username(requestData.get("username"))
                .password(encoder.encode(requestData.get("password")))
                .assignedproject(assignedproject.get())
                .assignedTickets(new ArrayList<>())
                .role(DemoRole.valueOf(requestData.get("role")))
                .build();

        return userRepository.save(newUser);
    }

    public DemoUserDto createDemoAdmin(Map<String, String> requestData) {//maybe pass Map with fields
        int i = userRepository.findAll().size();

        DemoUsers demoUser = DemoUsers.builder()
                .username(requestData.get("username") + i)
                .password(encoder.encode(requestData.get("password")))
                .assignedproject(null)
                .assignedTickets(null)
                .role(DEMOADMIN)
                .build();

        userRepository.save(demoUser);

        Optional<DemoUsers> retrieved = userRepository.findByUsername(requestData.get("username") + i);

        String jwt = jwtService.generateDemoToken(retrieved.get().getUsername());

        DemoUserDto dto = DemoUserDto.builder()
                .username(retrieved.get().getUsername())
                .password(retrieved.get().getPassword())
                .id(retrieved.get().getId())
                .token(jwt)
                .role(Collections.singletonList(DEMOADMIN))
                .build();

        return dto;

    }


    public DemoUsers findUserById(Long id) throws Exception{
        DemoUsers user = userRepository.findByIdIs(id);
        return user;
    }

    //public String verifyUser(){} MAKE THIS AFTER JWT STUFF IS IMPLEMENTED (IT WILL GIVE THE JWT TO CLIENT UPON LOGIN)
    //THIS WILL BE USED IN THE USERCONTROLLER LOGIN METHOD
    public String verify(DemoUsers user) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if(authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        } else {
            return "Authentication failed";
        }
    }

    public DemoUserDto getAuth(DemoUsers user) {

        userDto.setToken(verify(user));

        Optional<DemoUsers> currentUser = userRepository.findByUsername(user.getUsername());
        userDto.setRole(Collections.singletonList(currentUser.get().getRole()));
        userDto.setId(currentUser.get().getId());

        return userDto;
    }

    public DemoUsers editUser(Map<String, String> requestData) throws Exception{
        Long userId = Long.valueOf(requestData.get("id"));
        DemoUsers userToEdit = userRepository.findById(userId).orElseThrow(() ->  new Exception("User with this ID does not exist."));

        userToEdit.setUsername(requestData.get("username"));
        userToEdit.setPassword(encoder.encode(requestData.get("password")));
        userToEdit.setRole(DemoRole.valueOf(requestData.get("role")));

        return userRepository.save(userToEdit);
    }

    public void deleteUser(Long id) throws Exception{
        DemoUsers user = userRepository.findById(id).orElseThrow(() ->  new Exception("User with this ID does not exist."));
        userRepository.delete(user);
    }

    //create method where completed tickets are returned. Only the admin will be able to see
    //all completed tickets.
}
