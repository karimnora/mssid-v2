package dz.mssid.education.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @NotBlank(message = "L'e-mail est obligatoire")
    @Email(message = "Le format de l'e-mail est invalide")
    @Column(nullable = false, unique = true)
    private String email;

    // SEC: never let this reach a JSON response — entities like PaymentReceipt embed the full User
    // as a nested relation and get serialized directly (no DTO projection) on some admin endpoints.
    @JsonIgnore
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // SEC/BUG: same rationale as passwordHash above — PaymentReceipt embeds the full User and gets
    // serialized directly by PaymentController. This field only ever caused real trouble once
    // PaymentServiceImpl.verifyReceipt started actually populating a matching subscriptions row: at
    // that point Jackson tried to serialize the resulting Hibernate-proxied association mid-session
    // and failed with "Type definition error: ... ByteBuddyInterceptor" (no jackson-datatype-hibernate
    // module registered). UserProfileDto — the sanctioned way to expose user data — never included
    // this field anyway.
    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Subscription subscription;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "grade")
    private String grade;

    // Informational only — set at account creation, never re-checked afterwards (a Google-linked
    // account still logs in with a password too, if one gets set later). "LOCAL" or "GOOGLE".
    @Column(name = "provider", nullable = false)
    @Builder.Default
    private String provider = "LOCAL";

    // Google's stable per-account subject id ("sub" claim), set the first time this email signs in
    // with Google — either at account creation or to link an existing password-based account.
    @Column(name = "google_id", unique = true)
    private String googleId;

    // Minimal parental supervision (product decision, pre-launch audit): optional, no verification
    // flow — just lets an admin reach a parent later (payment issue, moderation) without gating
    // account creation on it.
    @Column(name = "parent_email")
    private String parentEmail;

    // Soft verification only — per product decision, an unverified account is never blocked from
    // using the app (isEnabled() below stays true regardless). This just drives a discreet reminder
    // in the UI and, later, gates anything that genuinely needs a confirmed email (password reset).
    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private boolean emailVerified = false;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "xp")
    @Builder.Default
    private Integer xp = 0;

    @Column(name = "level")
    @Builder.Default
    private Integer level = 1;

    @Column(name = "streak_days")
    @Builder.Default
    private Integer streakDays = 0;

    @Column(name = "last_active_date")
    private String lastActiveDate;

    @Column(name = "score")
    @Builder.Default
    private Integer score = 0;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "completed_lesson_ids", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> completedLessonIds = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "badges", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> badges = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "badge_unlocked_at", columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, String> badgeUnlockedAt = new HashMap<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "completed_exam_ids", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> completedExamIds = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "completed_challenge_ids", columnDefinition = "jsonb")
    @Builder.Default
    private List<String> completedChallengeIds = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "quiz_scores", columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Integer> quizScores = new HashMap<>();

    // "Didou Studio" cosmetic-shop currency — deliberately separate from xp/score/level (a spendable
    // balance, not a progression metric). Synced from the frontend's AuthService.syncGoldCoinsAndAvatar.
    @Column(name = "gold_coins")
    @Builder.Default
    private Integer goldCoins = 150;

    // Opaque to the backend on purpose: {activeOutfit, unlockedOutfits, mood} as defined by the
    // frontend's DidouAvatarConfig — stored/returned as-is, never inspected or validated server-side.
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "avatar_config", columnDefinition = "jsonb")
    private Map<String, Object> avatarConfig;

    // =========================================================================
    // Méthodes requises par UserDetails (Spring Security)
    // =========================================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == null || this.role.getName() == null) {
            return List.of(new SimpleGrantedAuthority("ROLE_FREE"));
        }
        return List.of(new SimpleGrantedAuthority(this.role.getName().name()));
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        // PERMET À SPRING SECURITY DE LIRE VOTRE CHAMP password_hash
        return this.passwordHash;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}