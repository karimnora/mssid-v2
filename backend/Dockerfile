# Multi-stage build: compile with the full Maven+JDK image, ship only the slim JRE + jar so the
# final image (what Render actually pulls/runs) stays small and starts fast.

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render injects $PORT and expects the container to listen on it — application.properties already
# reads server.port=${PORT:8080}, so no extra flag is needed here.
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
