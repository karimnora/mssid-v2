package dz.mssid.education.controller;
import dz.mssid.education.service.AiQuotaService;
import dz.mssid.education.service.GeminiAiService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
class GeminiV2ProfileTest {
 private final ApplicationContextRunner context = new ApplicationContextRunner()
  .withBean(GeminiAiService.class, () -> mock(GeminiAiService.class))
  .withBean(AiQuotaService.class, () -> mock(AiQuotaService.class))
  .withUserConfiguration(GeminiProxyController.class);
 @Test void childGeminiControllerIsAbsentInV2() {
  context.withPropertyValues("spring.profiles.active=v2").run(c -> assertThat(c).doesNotHaveBean(GeminiProxyController.class));
 }
 @Test void legacyProfileIsUnchanged() {
  context.withPropertyValues("spring.profiles.active=legacy").run(c -> assertThat(c).hasSingleBean(GeminiProxyController.class));
 }
}
