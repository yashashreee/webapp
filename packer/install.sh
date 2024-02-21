#!/bin/bash

sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

# Install MariaDB
sudo dnf install mariadb-server
echo "Maria DB server is installed"
echo "------------------------------"

sudo systemctl start mariadb
sudo systemctl status mariadb
sudo systemctl enable mariadb
echo "Maria DB server is enabled"
echo "------------------------------"

echo "mysql_secure_installation"
echo "------------------------------"
sudo mysql_secure_installation
mysqladmin -u root -p version

echo "Create 'cloud' database"
echo "------------------------------"
mysql -u root -p -e "CREATE DATABASE cloud;"

# Install Node.js
sudo dnf module enable nodejs:18
sudo dnf install nodejs
node --version
npm --version
echo "Node is installed"
echo "------------------------------"

# Install unzip
sudo dnf install unzip

# Install curl
sudo dnf install curl

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Note: The script installs NVM but doesn't activate it for the current session.
# To use NVM in the current session, run: source ~/.bashrc
# Or for Zsh users: source ~/.zshrc

echo "Installation complete."

# Reload and enable systemd service
sudo systemctl daemon-reload
