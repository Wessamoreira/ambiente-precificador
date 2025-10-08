# Multi-stage build para otimizar tamanho da imagem

# Stage 1: Build
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Copia arquivos do Maven
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Download das dependências (cache layer)
RUN ./mvnw dependency:go-offline -B

# Copia código fonte
COPY src ./src

# Build da aplicação
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

# Copia JAR do stage anterior
COPY --from=builder /app/target/*.jar app.jar

# Muda para usuário não-root
USER appuser

# Expõe porta da aplicação
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Configurações de JVM otimizadas para containers
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-XX:+UseG1GC", \
    "-XX:+OptimizeStringConcat", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", \
    "app.jar"]
