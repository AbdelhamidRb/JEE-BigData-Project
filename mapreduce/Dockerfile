FROM bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 AS hadoop-source

FROM maven:3.8.6-openjdk-11

WORKDIR /mapreduce

COPY --from=hadoop-source /opt/hadoop-3.2.1 /opt/hadoop

ENV HADOOP_HOME=/opt/hadoop
ENV PATH=$PATH:$HADOOP_HOME/bin
ENV JAVA_HOME=/usr/local/openjdk-11

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src/ src/
RUN mvn clean package -DskipTests