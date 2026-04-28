FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
# Copie le .jar généré par Maven
COPY target/*.jar app.jar
# Exécute l'application
ENTRYPOINT ["java","-jar","/app.jar"]