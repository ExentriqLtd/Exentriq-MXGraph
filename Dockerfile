FROM adminexentriq/meteord:12.16.1
LABEL maintainer="Tomas Vesely <tomas@exentriq.com>"
RUN mkdir /built_app || true
COPY ./.build/bundle /built_app
RUN cd /built_app/programs/server && npm install
