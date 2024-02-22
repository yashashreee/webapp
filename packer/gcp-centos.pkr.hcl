packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1"
    }
  }
}

variable "project_id" {
  default = "yash-cloud"
}

variable "region" {
  default = "us-east1"
}

variable "image_family" {
  default = "centos-stream-8"
}

variable "ssh_username" {
  default = "csye6225"
}

variable "image_name" {
  default = "csye6225-custom-image"
}

variable "image_description" {
  default = "Custom image for CSYE6225"
}

variable "network" {
  default = "default"
}

variable "sa_email" {
  default = "sa-webapp-packer-vm@yash-cloud.iam.gserviceaccount.com"
}

source "googlecompute" "webapp" {
  project_id            = "${var.project_id}"
  source_image_family   = "${var.image_family}"
  zone                  = "${var.region}-b"
  ssh_username          = "${var.ssh_username}"
  image_name            = "${var.image_name}"
  image_description     = "${var.image_description}"
  network               = "${var.network}"
  service_account_email = "${var.sa_email}"
}

build {
  sources = ["source.googlecompute.webapp"]

  provisioner "shell" {
    script = "install.sh"
  }
}
