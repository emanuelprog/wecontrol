package com.app.wecontrol.models.user;

import com.app.wecontrol.dtos.register.RegisterDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class User implements UserDetails {
    @Id
    private String id;
    private String login;
    private String password;
    private UserRole userRole;
    private String name;
    private String email;

    private String cellphone;

    public User(String login, String password, UserRole role, String name, String email, String cellphone) {
        this.login = login;
        this.password = password;
        this.userRole = role;
        this.name = name;
        this.email = email;
        this.cellphone = cellphone;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.userRole == UserRole.ADMIN) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    public static User fromRegisterDTOAndEncryptedPassword(RegisterDTO registerDTO, String encryptedPassword) {
        return new User(
                registerDTO.getLogin(),
                encryptedPassword,
                registerDTO.getRole(),
                registerDTO.getName(),
                registerDTO.getEmail(),
                registerDTO.getCellphone()
        );
    }
}
