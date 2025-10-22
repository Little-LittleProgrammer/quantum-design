builder-image-claude:
	docker build ./ -f ./DockerfileBuildClaude -t registry.cn-shanghai.aliyuncs.com/7mao_sh/front-env:node22-claude
	docker push registry.cn-shanghai.aliyuncs.com/7mao_sh/front-env:node22-claude

docker-run-claude:
	docker run registry.cn-shanghai.aliyuncs.com/7mao_sh/front-env:node22-claude claude -v