#!/usr/bin/env bash
function join { local IFS="$1"; shift; echo "$*"; }

packages=("meteor-easy-search/packages/" "Exentriq-MSP/packages/" "meteor-streamer/packages" "jalik-ufs/packages" "exentriq-packages/" "Meteor-CollectionFS/packages");
packagesAbs=()
for f in ${packages[@]}; do
    packagesAbs+=("$PWD/../$f")
    if [ ! -d "$PWD/../$f" ]; then
        echo "Package $f not found"
        exit
    fi
done
PACKAGE_DIRS=$(join : ${packagesAbs[@]});
echo $PACKAGE_DIRS
