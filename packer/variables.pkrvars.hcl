project_id          = "yash-cloud"
sa_email            = "sa-webapp-tf-actions@yash-cloud.iam.gserviceaccount.com"
region              = "us-east1"
image_family        = "centos-stream-8"
ssh_username        = "csye6225"
image_name          = "csye6225-custom-image"
image_description   = "Custom image for CSYE6225"
network             = "default"
zip_source          = "../webapp.zip"
zip_destination     = "/tmp/webapp.zip"
service_source      = "../webapp.service"
service_destination = "/tmp/webapp.service"
yaml_source         = "../config.yaml"
yaml_destination    = "/tmp/config.yaml"