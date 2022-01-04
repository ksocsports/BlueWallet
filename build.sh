#!/bin/bash

if [ -z $KEY_STORE_PASS ]; then
    echo "Please set KEY_STORE_PASS environment variable."
    echo "$ KEY_STORE_PASS=123 build.sh"
    exit 1
fi


#set -x;
TASKID="docker_%COIN_FULLNAME_LOWERCASE%_build"
RESULT_DIR="docker_result/"
COIN_FULLNAME_LOWERCASE=%COIN_FULLNAME_LOWERCASE%

function drun {
   docker exec -it $TASKID /bin/bash -c "set -x && $1"
}

function dstop {
    if [ $? != 0 ]; then
        docker stop $TASKID
        docker container rm $TASKID
		exit 1
	fi
    docker stop $TASKID
    docker container rm $TASKID
}


docker run -v $PWD:/app -d --name $TASKID androidsdk/android-29 sleep infinity
sleep 3

# set variables
JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64 
SIGNED_APK=/app/.tmp/%COIN_FULLNAME_LOWERCASE%-signed.apk 
UNSIGNED_APK=/app/wallet/build/outputs/apk/release/wallet-release-unsigned.apk 
OUT_APK=/app/docker_result/$COIN_FULLNAME_LOWERCASE.apk
KEY_STORE_FILE=/app/keys/$COIN_FULLNAME_LOWERCASE.jks 
ANDROID_HOME=/opt/android-sdk-linux


# prepare environment
mkdir -p $OUTDIR $PWD/$RESULT_DIR
drun '
  cd /tmp && \
  wget https://services.gradle.org/distributions/gradle-4.6-bin.zip && \
  mkdir -p /opt/gradle && 
  unzip -d /opt/gradle gradle-4.6-bin.zip
'

# Build + sign
drun "
  cd /app && rm -rf $OUT_APK $SIGNED_APK $UNSIGNED_APK && mkdir -p ./.tmp && \ 
  /opt/gradle/gradle-4.6/bin/gradle assemble && \
  $JAVA_HOME/bin/jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $KEY_STORE_FILE  -storepass $KEY_STORE_PASS -keypass $KEY_STORE_PASS -tsa http://sha256timestamp.ws.symantec.com/sha256/timestamp -signedjar $SIGNED_APK $UNSIGNED_APK $COIN_FULLNAME_LOWERCASE && \
  $ANDROID_HOME/build-tools/28.0.3/zipalign -v 4 $SIGNED_APK $OUT_APK && \
  /opt/gradle/gradle-4.6/bin/gradle/gradle cleanBuildCache
"


echo "##############################################"
echo "Your apk here: $PWD/docker_result/%COIN_FULLNAME_LOWERCASE%.apk"
echo "##############################################"

dstop
