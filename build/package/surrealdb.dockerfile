FROM busybox:latest AS busybox
FROM surrealdb/surrealdb:latest

COPY --from=busybox /bin/sh /bin/sh
COPY --from=busybox /bin/mkdir /bin/mkdir
COPY --from=busybox /bin/cat /bin/cat
COPY --from=busybox /bin/chmod /bin/chmod
COPY --from=busybox /bin/ls /bin/ls
COPY --from=busybox /bin/rm /bin/rm
COPY --from=busybox /bin/mv /bin/mv
COPY --from=busybox /bin/cp /bin/cp
COPY --from=busybox /bin/clear /bin/clear
COPY --from=busybox /bin/sleep /bin/sleep

USER root

# Copy the SurrealDB initialization script
COPY ../../scripts/sdbstart.sh ./sdbstart.sh

# Make it executable
RUN chmod +x /sdbstart.sh

ENTRYPOINT ["/bin/sh", "/sdbstart.sh"]