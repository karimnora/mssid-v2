package dz.mssid.education.service;

import dz.mssid.education.dto.ChildProfileDto;
import dz.mssid.education.dto.ChildProfileRequest;
import dz.mssid.education.entity.ChildProfile;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.ChildProfileRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ChildProfileService {

    public static final int MAX_PROFILES_PER_ACCOUNT = 6;
    public static final String PRESCHOOL_GRADE = "PRESCHOOL";
    public static final Set<String> ALLOWED_GRADES;

    static {
        Set<String> grades = new HashSet<>(ProgressGuard.ALLOWED_GRADES);
        grades.add(PRESCHOOL_GRADE);
        ALLOWED_GRADES = Set.copyOf(grades);
    }

    private final ChildProfileRepository childProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ChildProfileDto> list(String email) {
        return childProfileRepository.findAllByUserEmailOrderByCreatedAtAsc(email).stream()
                .map(ChildProfileDto::from)
                .toList();
    }

    @Transactional
    public ChildProfileDto create(String email, ChildProfileRequest request) {
        if (childProfileRepository.countByUserEmail(email) >= MAX_PROFILES_PER_ACCOUNT) {
            throw new RuntimeException("Nombre maximal de profils atteint (" + MAX_PROFILES_PER_ACCOUNT + ")");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        ChildProfile profile = ChildProfile.builder()
                .user(user)
                .displayName(cleanName(request.getDisplayName()))
                .grade(checkGrade(request.getGrade()))
                .avatar(cleanAvatar(request.getAvatar()))
                .build();
        return ChildProfileDto.from(childProfileRepository.save(profile));
    }

    @Transactional
    public ChildProfileDto update(String email, Long id, ChildProfileRequest request) {
        ChildProfile profile = findOwned(email, id);
        profile.setDisplayName(cleanName(request.getDisplayName()));
        profile.setGrade(checkGrade(request.getGrade()));
        profile.setAvatar(cleanAvatar(request.getAvatar()));
        profile.setUpdatedAt(LocalDateTime.now());
        return ChildProfileDto.from(childProfileRepository.save(profile));
    }

    @Transactional
    public void delete(String email, Long id) {
        childProfileRepository.delete(findOwned(email, id));
    }

    private ChildProfile findOwned(String email, Long id) {
        return childProfileRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Profil introuvable"));
    }

    private static String cleanName(String name) {
        String trimmed = name == null ? "" : name.strip().replaceAll("\\s+", " ");
        if (trimmed.isEmpty()) {
            throw new RuntimeException("Le prénom est obligatoire");
        }
        if (trimmed.length() > 40) {
            throw new RuntimeException("Le prénom ne doit pas dépasser 40 caractères");
        }
        return trimmed;
    }

    private static String checkGrade(String grade) {
        if (grade == null || !ALLOWED_GRADES.contains(grade)) {
            throw new RuntimeException("Niveau invalide");
        }
        return grade;
    }

    private static String cleanAvatar(String avatar) {
        if (avatar == null || avatar.isBlank()) {
            return null;
        }
        String trimmed = avatar.strip();
        if (trimmed.length() > 16) {
            throw new RuntimeException("Avatar invalide");
        }
        return trimmed;
    }
}
