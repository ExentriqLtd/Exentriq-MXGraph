#!/bin/bash

rm settings.env
touch settings.env
cat >./settings.env << EOL
PORT=80
METEOR_SETTINGS=$(cat settings.json | awk '{print}' ORS='')
MONGO_OPLOG_URL=mongodb://mongodb:27017/local?replicaSet=rs0
MONGO_URL=mongodb://mongodb:27017/mxgraph?replicaSet=rs0
ROOT_URL=https://mxgraph.exentriq.com
EOL
