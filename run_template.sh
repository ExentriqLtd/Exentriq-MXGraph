#!/bin/bash

source .helpers/get_package_dirs.sh

FILE=./settings-local.json
if [ ! -f "$FILE" ]; then
    echo "\033[0;31msettings-local.json file doesn't exist. You need to create a new one based on 'settings-development.json'. For more details check README.md\033[0m"
    exit 0
fi

export ROOT_URL="http://localhost:3004";

meteor --settings settings-local.json -p 3004 --mobile-server http://localhost:3004 --exclude-archs "web.browser.legacy, web.cordova"
