// Prometheus ConfigMap
resource "kubernetes_config_map" "prometheus_config" {
  metadata {
    name = "prometheus-config"
  }

  data = {
    "prometheus.yml" = <<YAML
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: .+
  - job_name: 'kube-state-metrics'
    static_configs:
      - targets: ['kube-state-metrics:8080']
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor-service:8080']
    metrics_path: /metrics
    scheme: http
YAML
  }
}



// Prometheus Deployment
resource "kubernetes_deployment" "prometheus" {
  metadata {
    name = "prometheus-deployment"
    labels = {
      app = "prometheus"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "prometheus"
      }
    }

    template {
      metadata {
        labels = {
          app = "prometheus"
        }
      }

      spec {
        container {
          name  = "prometheus"
          image = "prom/prometheus:latest"

          args = [
            "--config.file=/etc/prometheus/prometheus.yml",
          ]

          port {
            container_port = 9090
          }

          resources {
            limits = {
              memory = "512Mi"
              cpu    = "500m"
            }
            requests = {
              memory = "256Mi"
              cpu    = "250m"
            }
          }

          volume_mount {
            mount_path = "/etc/prometheus/"
            name       = "prometheus-config-volume"
          }
        }

        volume {
          name = "prometheus-config-volume"

          config_map {
            name = kubernetes_config_map.prometheus_config.metadata[0].name
          }
        }
      }
    }
  }

  depends_on = [
    kubernetes_config_map.prometheus_config
  ]
}

// Prometheus Service
resource "kubernetes_service" "prometheus_service" {
  metadata {
    name = "prometheus-service"
  }

  spec {
    selector = {
      app = "prometheus"
    }

    port {
      protocol    = "TCP"
      port        = 9090
      target_port = 9090
    }
  }
}