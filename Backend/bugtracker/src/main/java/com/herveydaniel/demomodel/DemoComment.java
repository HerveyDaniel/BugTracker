package com.herveydaniel.demomodel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemoComment {
    private String createdBy;
    private String content;
    private String createdOn;
}
