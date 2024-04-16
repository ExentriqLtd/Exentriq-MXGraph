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

export METEOR_PACKAGE_DIRS=$(join $divider ${packagesAbs[@]});
export ROOT_URL="http://localhost:3000";
export MONGO_URL="mongodb://localhost:27017/ema-boards";

meteor --settings settings-stage.json -p 3000
