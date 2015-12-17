#!/bin/bash
export NODE_PATH=/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript
export NVM_DIR=/root/.nvm
export NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dist
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/opt/pig-0.15.0/bin:/usr/share/cassandra:/usr/share/cassandra/lib
set > /root/demo2/set.log
/usr/bin/node /root/demo2/meteor-demo-system-monitor-2/bin/collector.js >> /root/demo2/test1.log
