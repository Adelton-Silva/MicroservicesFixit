db = db.getSiblingDB('UserManagementDB');
db.Users.insertMany(require('/docker-entrypoint-initdb.d/Users.json'));