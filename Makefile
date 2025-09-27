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