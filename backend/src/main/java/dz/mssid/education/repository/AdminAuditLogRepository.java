package dz.mssid.education.repository;

import dz.mssid.education.entity.AdminAuditLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long>, JpaSpecificationExecutor<AdminAuditLog> {

    List<AdminAuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByActionTypeIn(Collection<String> actionTypes);

    long deleteByActionTypeIn(Collection<String> actionTypes);
}
