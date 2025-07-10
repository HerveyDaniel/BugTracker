package com.herveydaniel.demomodel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemoCommentDto {
    private DemoTicket selectedTicket;
    private String createdBy;
    private String content;
}
