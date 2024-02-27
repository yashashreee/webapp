# Webapp

This repository houses the source code for webapp, developed using Node.js with MySQL/MariaDB.

## Quick Start

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-webapp.git
    cd your-webapp
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the application:**
    ```bash
    npm start
    ```

The web application will be accessible at [http://localhost:3000](http://localhost:3000).

## Packer Custom Image

### Prerequisites

- Install [Packer](https://www.packer.io/).

### Building the Image

1. **Navigate to the Packer directory:**
    ```bash
    cd packer
    ```

2. **Create a variable file (e.g., `variables.pkr.hcl`) and build the image:**
    ```bash
    packer build gcp-centos.pkr.hcl
    ```

### Notes

- Ensure correct GCP credentials (`GOOGLE_APPLICATION_CREDENTIALS`).
