package com.herveydaniel.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PROJECTS")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "PROJECTID")
    private Long projectId;

    @Column(name = "PROJECTNAME")
    private String projectName;

    @Column(name = "PROJECTDESCRIPTION")
    private String projectDescription;

    @JsonManagedReference(value = "project-tickets")
    @Column(name = "PROJECTTICKETS")
    @OneToMany(mappedBy = "project", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<Ticket> projectTickets;

    @JsonManagedReference(value = "user-project")
    @Column(name = "ASSIGNEDUSERS")
    @OneToMany(mappedBy = "assignedProject")
    private List<Users> assignedUsers;

    @PreRemove
    private void preRemove() {
        projectTickets.forEach(ticket -> ticket.setProject(null));
        assignedUsers.forEach(user -> user.setAssignedProject(null));
    }
}
