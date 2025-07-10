package com.herveydaniel.model;

import com.fasterxml.jackson.annotation.*;
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
@Table(name = "TICKETS")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column (name = "TICKETID")
    private Long ticketId;

    @Column (name = "TICKETTITLE")
    private String ticketTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "PRIORITYSTATUS", nullable = false)
    private Priority priorityStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "TICKETTYPE", nullable = false)
    private Type ticketType;

    @Enumerated(EnumType.STRING)
    @Column(name = "TICKETPROGRESS", nullable = false)
    private Progress ticketProgress;

    @Column(name = "TICKETINFO")
    private String ticketInfo;

    @JsonBackReference(value = "project-tickets")
    @JoinColumn(name = "PROJECT")
    @ManyToOne(optional = true, cascade = CascadeType.PERSIST)
    private Project project;


    @JoinColumn(name = "ASSIGNEDUSER")
    @ManyToOne(optional = true, cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    private Users assignedUsers;

    @Column(name = "COMMENTS")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<Comment> ticketComments;

}
