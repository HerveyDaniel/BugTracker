FROM openjdk:17-jdk-alpine

WORKDIR /app

COPY target/bugtracker-0.0.1-SNAPSHOT.jar bugtracker-0.0.1-SNAPSHOT.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "bugtracker-0.0.1-SNAPSHOT.jar"]