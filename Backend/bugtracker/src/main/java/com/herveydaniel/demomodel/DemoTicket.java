package com.herveydaniel.demomodel;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "DEMOTICKETS")
public class DemoTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column (name = "ticketid")
    private Long ticketId;

    @Column (name = "tickettitle")
    private String ticketTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "prioritystatus", nullable = false)
    private DemoPriority priorityStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "tickettype", nullable = false)
    private DemoType ticketType;

    @Enumerated(EnumType.STRING)
    @Column(name = "ticketprogress", nullable = false)
    private DemoProgress ticketProgress;

    @Column(name = "ticketinfo")
    private String ticketInfo;

    @JsonBackReference(value = "demoproject-tickets")
    @JoinColumn(name = "project")
    @ManyToOne(optional = true, cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    private DemoProject project;


    @JoinColumn(name = "assigneduser")
    @ManyToOne(optional = true, cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private DemoUsers assignedUsers;

    @Column(name = "comments")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<DemoComment> ticketComments;

}
