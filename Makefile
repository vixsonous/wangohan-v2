.PHONY: docker docker_build docker_push build clean_build deploy clean_deploy clear_db

build: docker-compose.dev.yaml
	docker compose -f docker-compose.dev.yaml up --build

clean_build: docker-compose.dev.yaml
	docker container prune
	docker volume rm wangohan-v2_server_node_modules wangohan-v2_web_node_modules
	docker compose -f docker-compose.dev.yaml up --build

deploy: docker-compose.prod.yaml
	docker builder prune
	docker compose -f docker-compose.prod.yaml up --build -d

clean_deploy: docker-compose.prod.yaml
	docker container prune
	docker volume rm wangohan-v2_server_node_modules wangohan-v2_web_node_modules
	docker compose -f docker-compose.prod.yaml up --build -d

clear_db: docker-compose.dev.yaml
	docker container prune
	docker volume rm wangohan-v2_wangohan_data

REGISTRY ?= docker.io
NAMESPACE ?= dasdasd443

BACKEND_IMAGE := $(REGISTRY)/${NAMESPACE}/wangohan-backend
FRONTEND_IMAGE := $(REGISTRY)/${NAMESPACE}/wangohan-web

TAG ?= latest

docker: docker_build docker_push

docker_build:
	sudo docker build -t $(BACKEND_IMAGE):$(TAG) -f backend/Dockerfile backend
	sudo docker build -t $(FRONTEND_IMAGE):$(TAG) -f web/Dockerfile web

docker_push:
	sudo docker push $(BACKEND_IMAGE):$(TAG)
	sudo docker push $(FRONTEND_IMAGE):$(TAG)
