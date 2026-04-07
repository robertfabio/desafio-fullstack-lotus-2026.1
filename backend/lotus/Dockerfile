# Multi-stage build for Java Spring Boot application
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copy maven wrapper and pom.xml
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .
COPY src src

# Make mvnw executable and build without tests
RUN chmod +x ./mvnw && \
    ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built jar from builder stage
COPY --from=build /app/target/*.jar app.jar

# Create data directory for H2
RUN mkdir -p /app/data

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/h2-console || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

