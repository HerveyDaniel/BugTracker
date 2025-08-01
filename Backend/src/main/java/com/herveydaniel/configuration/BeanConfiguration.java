package com.herveydaniel.configuration;

import com.herveydaniel.demomodel.DemoUserDto;
import com.herveydaniel.demorepository.DemoUsersRepository;
import com.herveydaniel.model.UserDto;
import com.herveydaniel.repository.UsersRepository;
import com.herveydaniel.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;

@RequiredArgsConstructor
@Configuration
public class BeanConfiguration {
    private final UsersRepository repository;

    private final DemoUsersRepository demoRepository;

    @Autowired
    public CustomUserDetailsService customUserDetailsService;

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(new BCryptPasswordEncoder(10));
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(false));
    }

    @Bean
    public UserDto userDto() {
        return new UserDto();
    }

    @Bean
    public DemoUserDto demoUserDto() {
        return new DemoUserDto();
    }
}
