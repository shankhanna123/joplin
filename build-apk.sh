#!/bin/bash
# Simple APK Build Script for Joplin Android
# This script builds the APK directly without full monorepo setup

set -e

echo "🚧 Joplin Android APK Builder"
echo "=============================="

# Check requirements
echo "📋 Checking requirements..."

# Check Java
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Installing..."
    sudo apt-get update
    sudo apt-get install -y openjdk-20-jdk
fi

echo "✅ Java version: $(java --version | head -n1)"

# Check Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME not set. Setting up Android SDK..."
    
    # Download and setup Android command line tools
    mkdir -p ~/android-sdk/cmdline-tools
    cd ~/android-sdk/cmdline-tools
    
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
    unzip -q commandlinetools-linux-9477386_latest.zip
    mv cmdline-tools latest
    
    export ANDROID_HOME=~/android-sdk
    export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
    
    # Accept licenses and install required packages
    yes | sdkmanager --licenses
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
fi

echo "✅ Android SDK: $ANDROID_HOME"

# Go to mobile app directory
cd /home/runner/work/joplin/joplin/packages/app-mobile

# Install minimal dependencies for mobile app only
echo "📦 Installing mobile app dependencies..."
npm install --legacy-peer-deps --ignore-scripts

# Build APK
echo "🔨 Building APK..."
cd android

# Modify build.gradle to use debug signing (redundant but safe)
echo "🔧 Configuring debug signing..."
sed -i 's/signingConfig signingConfigs.release/signingConfig signingConfigs.debug/' app/build.gradle

# Build the APK with retry logic
echo "🏗️ Building release APK with debug signing..."
for i in {1..3}; do
    if ./gradlew assembleRelease --no-daemon --stacktrace --max-workers=2; then
        echo "✅ Build successful on attempt $i"
        break
    else
        echo "❌ Build failed on attempt $i"
        if [ $i -eq 3 ]; then
            echo "💥 Build failed after 3 attempts"
            exit 1
        fi
        echo "⏳ Waiting 30 seconds before retry..."
        sleep 30
    fi
done

# Check if APK was created
APK_FILE="./app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_FILE" ]; then
    echo "✅ APK built successfully!"
    echo "📍 APK location: $APK_FILE"
    echo "📏 APK size: $(du -h "$APK_FILE" | cut -f1)"
    
    # Copy to easy access location
    cp "$APK_FILE" /home/runner/work/joplin/joplin/joplin-android.apk
    echo "📱 APK copied to: /home/runner/work/joplin/joplin/joplin-android.apk"
    
    echo ""
    echo "🎉 BUILD SUCCESSFUL!"
    echo "=================="
    echo "Your Joplin APK is ready for installation on your Android device!"
    echo ""
    echo "📱 To install on your device:"
    echo "1. Download: /home/runner/work/joplin/joplin/joplin-android.apk"
    echo "2. Transfer to your Android device"
    echo "3. Enable 'Install from unknown sources' in Settings"
    echo "4. Install Joplin"
    echo ""
else
    echo "❌ APK build failed!"
    echo "📍 Expected location: $APK_FILE"
    exit 1
fi