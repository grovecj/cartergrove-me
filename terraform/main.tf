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
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
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

variable "database_cluster_name" {
  description = "Name of the existing DigitalOcean managed PostgreSQL cluster"
  type        = string
  default     = "mlb-stats-db"
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

# --- Managed Database ---
# The PostgreSQL cluster already exists in DigitalOcean (shared with other projects).

data "digitalocean_database_cluster" "postgres" {
  name = var.database_cluster_name
}

resource "digitalocean_database_db" "cartergrove" {
  cluster_id = data.digitalocean_database_cluster.postgres.id
  name       = "cartergrove"
}

resource "digitalocean_database_user" "cartergrove" {
  cluster_id = data.digitalocean_database_cluster.postgres.id
  name       = "cartergrove"
}

locals {
  database_url = "postgresql://${digitalocean_database_user.cartergrove.name}:${digitalocean_database_user.cartergrove.password}@${data.digitalocean_database_cluster.postgres.host}:${data.digitalocean_database_cluster.postgres.port}/${digitalocean_database_db.cartergrove.name}?sslmode=require"
}

# --- Deploy Key (for GitHub Actions → Droplet) ---

resource "tls_private_key" "deploy" {
  algorithm = "ED25519"
}

# --- GitHub Actions Secrets ---

resource "github_actions_secret" "droplet_ip" {
  repository      = data.github_repository.site.name
  secret_name     = "DROPLET_IP"
  plaintext_value = digitalocean_droplet.web.ipv4_address
}

resource "github_actions_secret" "deploy_ssh_key" {
  repository      = data.github_repository.site.name
  secret_name     = "DEPLOY_SSH_KEY"
  plaintext_value = tls_private_key.deploy.private_key_openssh
}

resource "github_actions_secret" "database_url" {
  repository      = data.github_repository.site.name
  secret_name     = "DATABASE_URL"
  plaintext_value = local.database_url
}

# --- Outputs ---

output "droplet_ip" {
  value = digitalocean_droplet.web.ipv4_address
}

output "deploy_public_key" {
  description = "Add this to the deploy user's authorized_keys on the droplet"
  value       = tls_private_key.deploy.public_key_openssh
}

output "database_url" {
  description = "Production PostgreSQL connection string (for droplet .env)"
  value       = local.database_url
  sensitive   = true
}
