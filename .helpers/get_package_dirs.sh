#!/usr/bin/env bash
osName=$(uname -s | tr "[:lower:]" "[:upper:]")
divider=":"
# if OS is Windows
if [[ $osName == "CYGWIN" || $osName == "MINGW" || $osName == "MINGW32" || $osName == "MSYS" ]]; then
  divider=";"
fi

function join { local IFS="$1"; shift; echo "$*"; }

packages=("meteor-easy-search/packages/" "Exentriq-MSP/packages/" "meteor-streamer/packages" "exentriq-packages/");
packagesAbs=()
for f in ${packages[@]}; do
    packagesAbs+=("$PWD/../$f")
    if [ ! -d "$PWD/../$f" ]; then
        echo "Package $f not found"
        exit
    fi
done
METEOR_PACKAGE_DIRS=$(join $divider ${packagesAbs[@]});
echo $METEOR_PACKAGE_DIRS
