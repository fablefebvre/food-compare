#!/bin/sh
docker run -p 27017:27017 -v /home/freebox/Dev/mongodb/foodcompare:/data/db --name mongodb -d mongo mongod