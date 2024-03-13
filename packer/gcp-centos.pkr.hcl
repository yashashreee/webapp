packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "~> 1"
    }
  }
}

variable "project_id" { type = string }
variable "region" { type = string }
variable "image_family" { type = string }
variable "ssh_username" { type = string }
variable "image_name" { type = string }
variable "image_description" { type = string }
variable "network" { type = string }
variable "sa_email" { type = string }
variable "zip_source" { type = string }
variable "zip_destination" { type = string }
variable "service_source" { type = string }
variable "service_destination" { type = string }

source "googlecompute" "webapp" {
  project_id            = "${var.project_id}"
  source_image_family   = "${var.image_family}"
  zone                  = "${var.region}-b"
  ssh_username          = "${var.ssh_username}"
  image_name            = "${var.image_name}"
  image_description     = "${var.image_description}"
  network              = "${var.network}"
  service_account_email = "${var.sa_email}"
}

build {
  sources = ["source.googlecompute.webapp"]

  provisioner "file" {
    source      = "${var.zip_source}"
    destination = "${var.zip_destination}"
  }

  provisioner "file" {
    source      = "${var.service_source}"
    destination = "${var.service_destination}"
  }

  provisioner "shell" {
    script = "setup.sh"
  }
}
