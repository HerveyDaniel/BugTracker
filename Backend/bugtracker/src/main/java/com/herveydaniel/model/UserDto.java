package com.herveydaniel.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private String token;
    //change this to permissions. May not even need permissions tbh.
    //private Collection<? extends GrantedAuthority> permissions;
    private Long id;
    private List<Role> role;
}
