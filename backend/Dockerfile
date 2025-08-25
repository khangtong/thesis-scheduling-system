# Sử dụng OpenJDK 17 (hoặc 11/8 tùy theo version Java của project)
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven wrapper và pom.xml trước để cache dependencies
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (sẽ được cache nếu pom.xml không thay đổi)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build application
RUN ./mvnw clean package -DskipTests

# Copy JAR file to root
RUN cp target/*.jar app.jar

# Expose port (Render/Railway sẽ override bằng $PORT)
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]