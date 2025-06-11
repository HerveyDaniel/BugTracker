//package com.herveydaniel.service;
//
//
//import com.herveydaniel.model.Users;
//import com.herveydaniel.repository.UsersRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UserDetailsServiceImpl implements UserDetailsService {
//
//    @Autowired
//    private UsersRepository userRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        Users user = userRepository.findByUsername(username);
//
//        if(user == null) {
//            throw new UsernameNotFoundException("User not found.");
//        }
//
//        UserPrincipal userPrincipal = new UserPrincipal(user);
//        return userPrincipal;
//    }
//}
