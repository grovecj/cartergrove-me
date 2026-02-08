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

variable "ssh_key_fingerprint" {
  description = "SSH key fingerprint registered with DigitalOcean"
  type        = string
}

variable "domain" {
  description = "Root domain"
  type        = string
  default     = "cartergrove.me"
}

# --- GitHub Repository ---

resource "github_repository" "site" {
  name        = "cartergrove-me"
  description = "Personal website — cartergrove.me"
  visibility  = "public"

  has_issues   = true
  has_projects = false
  has_wiki     = false

  lifecycle {
    prevent_destroy = true
  }
}

resource "github_branch_protection" "main" {
  repository_id = github_repository.site.node_id
  pattern       = "main"

  required_pull_request_reviews {
    required_approving_review_count = 0
  }

  enforce_admins = false
}

# --- DigitalOcean Droplet ---

resource "digitalocean_droplet" "web" {
  name     = "cartergrove-me"
  region   = "nyc1"
  size     = "s-1vcpu-1gb"
  image    = "ubuntu-24-04-x64"
  ssh_keys = [var.ssh_key_fingerprint]

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

resource "digitalocean_domain" "root" {
  name = var.domain
}

resource "digitalocean_record" "a_root" {
  domain = digitalocean_domain.root.id
  type   = "A"
  name   = "@"
  value  = digitalocean_droplet.web.ipv4_address
  ttl    = 300
}

resource "digitalocean_record" "a_www" {
  domain = digitalocean_domain.root.id
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
