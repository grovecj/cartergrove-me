terraform {
  required_version = ">= 1.5"
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

provider "github" {
  token = var.github_token
  owner = "grovecj"
}

# --- Variables ---

variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "github_token" {
  description = "GitHub personal access token"
  type        = string
  sensitive   = true
}

variable "ssh_key_name" {
  description = "Name of the SSH key registered with DigitalOcean"
  type        = string
}

variable "domain" {
  description = "Root domain"
  type        = string
  default     = "cartergrove.me"
}

# --- GitHub Repository ---
# The repo already exists at github.com/grovecj/cartergrove-me.
# Use a data source to reference it without trying to create it.

data "github_repository" "site" {
  full_name = "grovecj/cartergrove-me"
}

resource "github_branch_protection" "main" {
  repository_id = data.github_repository.site.node_id
  pattern       = "main"

  required_pull_request_reviews {
    required_approving_review_count = 1
    require_code_owner_reviews      = true
  }

  enforce_admins = false
}

# --- SSH Key ---

data "digitalocean_ssh_key" "main" {
  name = var.ssh_key_name
}

# --- DigitalOcean Droplet ---

resource "digitalocean_droplet" "web" {
  name     = "cartergrove-me"
  region   = "nyc1"
  size     = "s-1vcpu-1gb"
  image    = "ubuntu-24-04-x64"
  ssh_keys = [data.digitalocean_ssh_key.main.id]

  tags = ["cartergrove", "web"]
}

# --- Firewall ---

resource "digitalocean_firewall" "web" {
  name        = "cartergrove-me-fw"
  droplet_ids = [digitalocean_droplet.web.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "all"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "all"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# --- DNS ---
# The domain already exists in DigitalOcean.

data "digitalocean_domain" "root" {
  name = var.domain
}

resource "digitalocean_record" "a_root" {
  domain = data.digitalocean_domain.root.id
  type   = "A"
  name   = "@"
  value  = digitalocean_droplet.web.ipv4_address
  ttl    = 300
}

resource "digitalocean_record" "a_www" {
  domain = data.digitalocean_domain.root.id
  type   = "CNAME"
  name   = "www"
  value  = "${var.domain}."
  ttl    = 300
}

# NOTE: gif.cartergrove.me and stats.cartergrove.me DNS records
# are managed by their respective project repositories.

# --- Outputs ---

output "droplet_ip" {
  value = digitalocean_droplet.web.ipv4_address
}
