package com.herveydaniel.model;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "USERS")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Users implements UserDetails {
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    @Column (name = "ID")
    private Long id;

    @Column (name = "USERNAME")
    private String username;

    @Column (name = "PASSWORD")
    private String password;

    @JsonBackReference(value = "user-project")
    @ManyToOne(optional = true, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "assignedProject")
    private Project assignedProject;

    @JsonIgnore
    @Column(name= "ASSIGNEDTICKETS")
    @OneToMany(mappedBy = "assignedUsers", cascade = CascadeType.DETACH, fetch = FetchType.LAZY)
    private List<Ticket> assignedTickets;

    @Enumerated(EnumType.STRING)
    @Column(name = "ROLE")
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @PreRemove
    private void preRemove() {
        assignedTickets.forEach(ticket -> ticket.setAssignedUsers(null));
    }
}
