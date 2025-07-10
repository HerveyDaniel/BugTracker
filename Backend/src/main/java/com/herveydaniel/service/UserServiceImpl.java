package com.herveydaniel.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.herveydaniel.demorepository.DemoUsersRepository;
import com.herveydaniel.model.Project;
import com.herveydaniel.model.Role;
import com.herveydaniel.model.UserDto;
import com.herveydaniel.model.Users;
import com.herveydaniel.repository.ProjectRepository;
import com.herveydaniel.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.herveydaniel.demomodel.DemoRole.DEMOADMIN;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserDto userDto;

    @Autowired
    private JwtServiceImpl jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ApplicationContext applicationContext;

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private DemoUsersRepository demoUsersRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    @Override
    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Users createUser(Map<String, String> requestData) throws Exception{
        for(String key : requestData.keySet()) {
            if(requestData.get(key).isEmpty()){
                throw new Exception("All fields must be filled out.");
            }
        }

        Long projectId = Long.valueOf(requestData.get("assignedProject"));

        Optional<Project> assignedProject = projectRepository.findById(projectId);

        Users newUser = Users.builder()
                .username(requestData.get("username"))
                .password(encoder.encode(requestData.get("password")))
                .assignedProject(assignedProject.get())
                .assignedTickets(new ArrayList<>())
                .role(Role.valueOf(requestData.get("role")))
                .build();

        return userRepository.save(newUser);
    }

    public Users findUserById(Long id) throws Exception{
        Users user = userRepository.findByIdIs(id);
        return user;
    }

    public String verify(Users user) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if(authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getUsername());
        } else {
            return "Authentication failed";
        }
    }

    public UserDto getAuth(Users user) {

        userDto.setToken(verify(user));

        Optional<Users> currentUser = userRepository.findByUsername(user.getUsername());
        userDto.setRole(Collections.singletonList(currentUser.get().getRole()));
        userDto.setId(currentUser.get().getId());

        return userDto;
    }

    public Users editUser(Map<String, String> requestData) throws Exception{
        Long userId = Long.valueOf(requestData.get("id"));
        Users userToEdit = userRepository.findById(userId).orElseThrow(() ->  new Exception("User with this ID does not exist."));

        Users editedUser = Users.builder()
                .id(userToEdit.getId())
                .username(requestData.get("username"))
                .password(encoder.encode(requestData.get("password")))
                .assignedProject(userToEdit.getAssignedProject())
                .assignedTickets(userToEdit.getAssignedTickets())
                .role(Role.valueOf(requestData.get("role")))
                .build();

        userRepository.save(editedUser);
        return editedUser;
    }

    @Override
    public void deleteUser(Long id) throws Exception{
        Users user = userRepository.findById(id).orElseThrow(() ->  new Exception("User with this ID does not exist."));
        userRepository.delete(user);
    }
}
