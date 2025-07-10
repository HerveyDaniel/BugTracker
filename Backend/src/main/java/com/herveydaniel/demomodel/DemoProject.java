package com.herveydaniel.demomodel;

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
@Table(name = "DEMOPROJECTS")
public class DemoProject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "projectid")
    private Long projectId;

    @Column(name = "projectname")
    private String projectName;

    @Column(name = "projectdescription")
    private String projectDescription;

    @JsonManagedReference(value = "demoproject-tickets")
    @Column(name = "projecttickets")
    @OneToMany(mappedBy = "project", cascade = CascadeType.DETACH, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<DemoTicket> projectTickets;

    @JsonManagedReference(value = "demouser-project")
    @Column(name = "assignedusers")
    @OneToMany(mappedBy = "assignedproject", cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private List<DemoUsers> assignedUsers;

    @PreRemove
    private void preRemove() {
        projectTickets.forEach(ticket -> ticket.setProject(null));
        assignedUsers.forEach(user -> user.setAssignedproject(null));
    }
}
