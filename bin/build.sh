#!/usr/bin/env bash

# Production build.
# Usage example: bin/build.sh

cd app
npm run build

cd ..
bin/hugo

cd app
npm run build:html
