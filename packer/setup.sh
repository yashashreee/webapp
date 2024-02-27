#!/bin/bash

echo "-------------------------------------------------------------------------"
echo "Adding group csye6225 and user csye6225"
echo "-------------------------------------------------------------------------"
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225


echo "-------------------------------------------------------------------------"
echo "Installing Node and Dependecies"
echo "-------------------------------------------------------------------------"
sudo dnf module enable nodejs:18 -y
sudo dnf install nodejs -y
sudo dnf install npm unzip -y
npm install -g npm@10.4.0 -y

sudo mkdir -p /opt/csye6225/webapp/
sudo mv /tmp/webapp.zip /opt/csye6225/webapp/
cd /opt/csye6225/webapp/
sudo unzip webapp.zip
sudo npm install

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service


echo "-------------------------------------------------------------------------"
echo "Changing user csye6225's permission"
echo "-------------------------------------------------------------------------"
sudo chown -R csye6225:csye6225 /opt/csye6225/
sudo chmod -R 750 /opt/csye6225/

sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp
