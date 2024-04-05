#!/bin/bash

FILE=./settings-local.json
if [ ! -f "$FILE" ]; then
    echo "\033[0;31msettings-local.json file doesn't exist. You need to create a new one based on 'settings-development.json'. For more details check README.md\033[0m"
    exit 0
fi

osName=$(uname -s | tr "[:lower:]" "[:upper:]")
divider=":"
# if OS is Windows
if [ $osName == "CYGWIN" ] || [ $osName == "MINGW" ] || [ $osName == "MINGW32" ] || [ $osName == "MSYS" ]; then
  divider=";"
fi

function join { local IFS="$1"; shift; echo "$*"; }

packages=("Exentriq-MSP/packages/");
packagesAbs=()
for f in ${packages[@]}; do
    packagesAbs+=("$PWD/../$f")
    if [ ! -d "$PWD/../$f" ]; then
        echo "Package $f not found"
        exit
    fi
done
#Meteor < 1.9 gives cert expired error without NODE_TLS_REJECT_UNAUTHORIZED
#export APP_ID=$(jq -r '.public.appId' settings-local.json);
export NODE_TLS_REJECT_UNAUTHORIZED=0;
export METEOR_PACKAGE_DIRS=$(join $divider ${packagesAbs[@]});
#export ROOT_URL="http://localhost:3002";
export MONGO_URL="mongodb://localhost:27017/ema-boards";
export MXGRAPH_URL=localhost:3000

meteor --settings settings-stage.json -p 3000
