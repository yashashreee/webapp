#!/bin/bash

# sudo groupadd csye6225
# sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

export MYSQL_ROOT_PASSWORD="yash1234"

# sudo yum update -y

# Install Google Cloud CLI (gcloud)
# sudo tee /etc/yum.repos.d/google-cloud-sdk.repo <<EOL
# [google-cloud-sdk]
# name=Google Cloud SDK
# baseurl=https://packages.cloud.google.com/yum/repos/cloud-sdk-el8-x86_64
# enabled=1
# gpgcheck=1
# repo_gpgcheck=1
# gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
# EOL

# sudo yum install google-cloud-sdk -y

sudo yum install epel-release -y
sudo yum install nodejs npm -y

sudo yum install mariadb-server -y

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

sudo yum install -y unzip zip

sudo npm install -g nodemon

sudo zip --version
sudo unzip --version

sudo mkdir -p /opt/csye6225/webapp
sudo mv webapp.zip /opt/csye6225/webapp/
cd /opt/csye6225/
sudo unzip webapp.zip
sudo npm install

sudo mv webapp.service /etc/systemd/system/webapp.service

sudo chown -R csye6225:csye6225 /opt/csye6225/
sudo chmod -R 750 /opt/csye6225/

sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp