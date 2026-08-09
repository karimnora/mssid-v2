package dz.mssid.education.repository;

import dz.mssid.education.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    // Recherche d'un rôle par son nom énuméré (ex: ROLE_STUDENT, ROLE_PREMIUM, ROLE_ADMIN)
    Optional<Role> findByName(Role.RoleName name);
}