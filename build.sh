#!/bin/bash
echo "Entering app directory..."
cd walk_x_app

echo "Cloning Flutter SDK..."
git clone https://github.com/flutter/flutter.git -b stable

echo "Adding Flutter to PATH..."
export PATH="$PATH:`pwd`/flutter/bin"

echo "Building Flutter Web App..."
flutter build web
