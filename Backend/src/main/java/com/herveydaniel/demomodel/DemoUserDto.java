package com.herveydaniel.demomodel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DemoUserDto {

    private String username;
    private String password;
    private String token;
    private Long id;
    private List<DemoRole> role;
}
