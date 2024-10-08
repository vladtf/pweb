# Web Programming - Project

## Table of Contents

- [Web Programming - Project](#web-programming---project)
  - [Table of Contents](#table-of-contents)
  - [Run Docker Compose](#run-docker-compose)
  - [Stop Docker Compose](#stop-docker-compose)
  - [Swagger](#swagger)
  - [Kubernetes](#kubernetes)
  - [Skaffold](#skaffold)

## Run Docker Compose

You need docker and docker-compose installed on your machine.

```bash
# check if docker is installed
❯ docker --version

# check if docker-compose is installed
❯ docker-compose --version

# check if docker is running
❯ docker ps

# run docker-compose
❯ docker-compose up --build -d
```
## Stop Docker Compose

```bash
# stop docker-compose
❯ docker-compose down -v
```

## Swagger

Navigate to [http://localhost:8090/swagger-ui](http://localhost:8090/swagger-ui) to see the Swagger documentation.


## Kubernetes

- Start minikube
```bash
❯ minikube start
```

- Deploy the application
```bash
❯ kubectl apply -f kubernetes-deployment.yaml
```

- Check the status of the pods
```bash
❯ kubectl get pods
```

- Get the ip address of the minikube
```bash
❯ minikube ip
```

- Open the application in the browser
```bash
❯ minikube service frontend-servic
```

- Stop deployment
```bash
❯ kubectl delete -f kubernetes-deployment.yaml
```

- Stop minikube
```bash
❯ minikube stop
```

## Skaffold

- Start minikube
```bash
❯ minikube start
```

- Deploy the application
```bash
❯ skaffold dev
```

- Stop deployment
```bash 
❯ skaffold delete
```

- Stop minikube
```bash
❯ minikube stop
```