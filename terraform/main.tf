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

variable "auth_secret" {
  description = "NextAuth.js secret for session encryption"
  type        = string
  sensitive   = true
}

variable "github_client_id" {
  description = "GitHub OAuth App client ID (production)"
  type        = string
}

variable "github_client_secret" {
  description = "GitHub OAuth App client secret (production)"
  type        = string
  sensitive   = true
}

variable "admin_ip" {
  description = "IP address allowed to connect directly to the managed database (for local dev/debugging)"
  type        = string
  default     = ""
}

# --- GitHub Repository ---
# Import: terraform import github_repository.site cartergrove-me

resource "github_repository" "site" {
  name        = "cartergrove-me"
  description = "Personal website — resume, portfolio, and blog"
  homepage_url = "https://cartergrove.me"

  visibility = "public"

  has_issues   = true
  has_projects = false
  has_wiki     = false

  delete_branch_on_merge = true
}

resource "github_branch_protection" "main" {
  repository_id = github_repository.site.node_id
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

# --- Reserved (Static) IP ---

resource "digitalocean_reserved_ip" "web" {
  region = "nyc1"
}

resource "digitalocean_reserved_ip_assignment" "web" {
  ip_address = digitalocean_reserved_ip.web.ip_address
  droplet_id = digitalocean_droplet.web.id
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
  value  = digitalocean_reserved_ip.web.ip_address
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

resource "digitalocean_database_firewall" "cartergrove" {
  cluster_id = data.digitalocean_database_cluster.postgres.id

  rule {
    type  = "droplet"
    value = digitalocean_droplet.web.id
  }

  dynamic "rule" {
    for_each = var.admin_ip != "" ? [var.admin_ip] : []
    content {
      type  = "ip_addr"
      value = rule.value
    }
  }
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
  repository      = github_repository.site.name
  secret_name     = "DROPLET_IP"
  plaintext_value = digitalocean_reserved_ip.web.ip_address
}

resource "github_actions_secret" "deploy_ssh_key" {
  repository      = github_repository.site.name
  secret_name     = "DEPLOY_SSH_KEY"
  plaintext_value = tls_private_key.deploy.private_key_openssh
}

resource "github_actions_secret" "database_url" {
  repository      = github_repository.site.name
  secret_name     = "DATABASE_URL"
  plaintext_value = local.database_url
}

resource "github_actions_secret" "auth_secret" {
  repository      = github_repository.site.name
  secret_name     = "AUTH_SECRET"
  plaintext_value = var.auth_secret
}

resource "github_actions_secret" "github_client_id" {
  repository      = github_repository.site.name
  secret_name     = "OAUTH_GITHUB_CLIENT_ID"
  plaintext_value = var.github_client_id
}

resource "github_actions_secret" "github_client_secret" {
  repository      = github_repository.site.name
  secret_name     = "OAUTH_GITHUB_CLIENT_SECRET"
  plaintext_value = var.github_client_secret
}

# --- Outputs ---

output "droplet_ip" {
  value = digitalocean_reserved_ip.web.ip_address
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
