#!/bin/bash

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

export MYSQL_ROOT_PASSWORD="yash1234"

sudo dnf module enable nodejs:18 -y
sudo dnf install nodejs -y
sudo dnf install npm unzip -y
npm install -g npm@10.4.0 -y

sudo dnf install mariadb-server -y
sudo systemctl start mariadb
sudo systemctl status mariadb

mysql_secure_installation <<EOF

y
${MYSQL_ROOT_PASSWORD}
${MYSQL_ROOT_PASSWORD}
y
y
y
y
EOF

sudo mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "CREATE DATABASE cloud;"

sudo mkdir -p /opt/csye6225/webapp/
sudo mv /tmp/webapp.zip /opt/csye6225/webapp/
cd /opt/csye6225/webapp/
sudo unzip webapp.zip
sudo npm install

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service

sudo chown -R csye6225:csye6225 /opt/csye6225/
# sudo chmod -R 750 /opt/csye6225/

sudo systemctl daemon-reload
sudo systemctl enable mariadb
sudo systemctl start mariadb
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp
