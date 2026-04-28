FROM probablyfine/flume:latest

RUN rm -f /opt/flume/lib/guava-*.jar

COPY --from=bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
     /opt/hadoop-3.2.1/share/hadoop/common/hadoop-common-3.2.1.jar \
     /opt/flume/lib/

COPY --from=bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
     /opt/hadoop-3.2.1/share/hadoop/hdfs/hadoop-hdfs-client-3.2.1.jar \
     /opt/flume/lib/

COPY --from=bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
     /opt/hadoop-3.2.1/share/hadoop/hdfs/hadoop-hdfs-3.2.1.jar \
     /opt/flume/lib/

COPY --from=bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
     /opt/hadoop-3.2.1/share/hadoop/common/lib/guava-27.0-jre.jar \
     /opt/flume/lib/

COPY --from=bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
     /opt/hadoop-3.2.1/share/hadoop/common/lib/woodstox-core-5.0.3.jar \
     /opt/flume/lib/

COPY --from=bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
     /opt/hadoop-3.2.1/share/hadoop/common/lib/stax2-api-3.1.4.jar \
     /opt/flume/lib/

COPY --from=bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
     /opt/hadoop-3.2.1/share/hadoop/common/lib/hadoop-auth-3.2.1.jar \
     /opt/flume/lib/

COPY --from=bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
     /opt/hadoop-3.2.1/share/hadoop/common/lib/commons-configuration2-2.1.1.jar \
     /opt/flume/lib/

COPY --from=bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
     /opt/hadoop-3.2.1/share/hadoop/common/lib/commons-lang3-3.7.jar \
     /opt/flume/lib/

COPY --from=bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
     /opt/hadoop-3.2.1/share/hadoop/common/lib/protobuf-java-2.5.0.jar \
     /opt/flume/lib/

COPY --from=bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
     /opt/hadoop-3.2.1/share/hadoop/common/lib/htrace-core4-4.1.0-incubating.jar \
     /opt/flume/lib/

RUN rm -f /opt/flume/lib/slf4j-log4j12-1.7.25.jar