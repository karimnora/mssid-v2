# Multi-stage build: compile with the full Maven+JDK image, ship only the slim JRE + jar so the
# final image (what Render actually pulls/runs) stays small and starts fast.

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
# Run the test suite as part of the build so a broken commit fails here instead of reaching
# production — this Docker build stage has no reachable Postgres, so EducationApplicationTests
# (the one @SpringBootTest that boots the full context against spring.datasource.url) is excluded;
# every other test in the suite is a plain Mockito unit test and runs normally. The GitHub Actions
# CI workflow (.github/workflows/ci.yml) runs the full suite, including that test, against a real
# Postgres service container.
RUN mvn -B -q clean package "-Dtest=!EducationApplicationTests"

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render injects $PORT and expects the container to listen on it — application.properties already
# reads server.port=${PORT:8080}, so no extra flag is needed here.
EXPOSE 8080
# Without -XX:MaxRAMPercentage, a container-aware JVM defaults to ~25% of the container's memory as
# its heap ceiling — on Render's 512MB Starter plan that's ~128MB, tight enough to risk GC thrashing
# under real traffic even though the container has far more memory available. 75% leaves ~128MB of
# headroom for metaspace/thread stacks/native memory, which is what actually matters on a small
# container. SerialGC over the JRE 21 default (G1) because G1's parallel collector threads compete
# for the Starter plan's 0.5 CPU instead of helping — Serial's single-threaded, lower-overhead
# collection is the better fit below ~1-2GB heaps on a CPU-constrained instance.
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
