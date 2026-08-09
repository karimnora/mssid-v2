package dz.mssid.education.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false, unique = true)
    private RoleName name; // ROLE_FREE, ROLE_PREMIUM, ROLE_ADMIN

    public enum RoleName {
        ROLE_FREE,
        ROLE_PREMIUM,
        ROLE_TEACHER,
        ROLE_ADMIN
    }
}