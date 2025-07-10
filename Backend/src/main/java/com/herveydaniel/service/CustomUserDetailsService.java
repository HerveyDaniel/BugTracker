package com.herveydaniel.service;

import com.herveydaniel.demomodel.DemoUsers;
import com.herveydaniel.demorepository.DemoUsersRepository;
import com.herveydaniel.model.Users;
import com.herveydaniel.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private DemoUsersRepository demoUsersRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<Users> user = usersRepository.findByUsername(username);

        if(user.isEmpty()) {
            Optional<DemoUsers> demoUser = demoUsersRepository.findByUsername(username);
            if(demoUser.isPresent()) {
                return demoUser.get();
            } else {
                throw new UsernameNotFoundException("User not found");
            }
        }
        return user.get();
    }
}
