//package com.herveydaniel.model;
//
//
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//
//import java.util.ArrayList;
//import java.util.Collection;
//import java.util.List;
//import java.util.Set;
//
//
//public class UserPrincipal implements UserDetails {
//
//    private Users user;
//
//    public UserPrincipal(Users user) {
//        this.user = user;
//    }
//
////    @Override
////    public Collection<? extends GrantedAuthority> getAuthorities() {
////        return user.getUserRole().getAuthorities(); //IMPLEMENT
////    }
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        final List<GrantedAuthority> authList = new ArrayList<>();
//        authList.add(new SimpleGrantedAuthority("ROLE_" + user.getUserRole()));
//        return authList;
//    }
//
//    @Override
//    public String getPassword() {
//        return user.getPassword();
//    }
//
//    @Override
//    public String getUsername() {
//        return user.getusername();
//    }
//
//    @Override
//    public boolean isAccountNonExpired() {
//        return true; //IMPLEMENT
//    }
//
//    @Override
//    public boolean isAccountNonLocked() {
//        return true; //IMPLEMENT
//    }
//
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return true; //IMPLEMENT
//    }
//
//    @Override
//    public boolean isEnabled() {
//        return true; //IMPLEMENT
//    }
//
//}
