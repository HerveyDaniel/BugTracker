package com.herveydaniel.demomodel;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "DEMOUSERS")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DemoUsers implements UserDetails {
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)
    @Column (name = "id")
    private Long id;

    @Column (name = "username")
    private String username;

    @Column (name = "password")
    private String password;

    @JsonBackReference(value = "demouser-project")
    @ManyToOne(optional = true, cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "assignedproject")
    private DemoProject assignedproject;

    @JsonIgnore
    @Column(name= "assignedtickets")
    @OneToMany(mappedBy = "assignedUsers", cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    private List<DemoTicket> assignedTickets;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private DemoRole role;

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
