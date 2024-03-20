#!/bin/bash

echo "-------------------------------------------------------------------------"
echo "Installing Ops Agent"
echo "-------------------------------------------------------------------------"
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

sudo cp -f tmp/config.yaml /etc/google-cloud-ops-agent/config.yaml


echo "-------------------------------------------------------------------------"
echo "Adding group csye6225 and user csye6225"
echo "-------------------------------------------------------------------------"
sudo groupadd csye6225
sudo useradd -g csye6225 -s /usr/sbin/nologin csye6225


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


echo "-------------------------------------------------------------------------"
echo "Enabling services"
echo "-------------------------------------------------------------------------"
sudo systemctl restart google-cloud-ops-agent
sudo systemctl status google-cloud-ops-agent
