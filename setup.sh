#/bin/bash

sudo apt install -y git nodejs
git clone https://github.com/sal2993/hackernews-apiRequests.git
cd ./hackernews-apiRequests
git pull origin dev
git checkout dev

npm instal
