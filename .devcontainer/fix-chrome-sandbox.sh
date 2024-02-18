#!/bin/bash
set -e

sudo chown root: node_modules/electron/bin/chrome-sandbox
sudo chmod 4755 node_modules/electron/bin/chrome-sandbox
