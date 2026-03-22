FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY src ./src
RUN chmod +x mvnw && ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser && \
    chown appuser:appgroup /app/app.jar
USER appuser
ENTRYPOINT ["java", "-jar", "/app/app.jar"]