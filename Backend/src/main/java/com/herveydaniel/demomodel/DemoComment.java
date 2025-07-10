package com.herveydaniel.demomodel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemoComment {
    private String createdBy;
    private String content;
    private String createdOn;
}
