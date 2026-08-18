package dz.mssid.education.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuickCheckOptionDto {
    private String labelAr;

    // Explicit @JsonProperty: Lombok's getter for a boolean field named "isCorrect" is isCorrect(),
    // which Jackson's default bean-introspection reads as property "correct" (strips the "is"
    // prefix) — without this, deserializing Gemini's {"isCorrect": true} would silently leave every
    // option false.
    @JsonProperty("isCorrect")
    private boolean isCorrect;
}
