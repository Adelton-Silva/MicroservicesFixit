#!/bin/bash
echo "Initializing MongoDB with Users data..."

mongoimport --host mongodb \
            --port 27017 \
            --db UserManagementDB \
            --collection Users \
            --file /docker-entrypoint-initdb.d/Users.json \
            --jsonArray
