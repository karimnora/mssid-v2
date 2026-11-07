package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChildProgressRequest {
    private Map<String, Object> competenceStats;
    private List<Map<String, Object>> lessonSessions;
    private List<Map<String, Object>> villageSummaries;
}
