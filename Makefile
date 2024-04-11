NAME   := exentriq/graph
TAG    := $(shell git log -1 --pretty=%h)
IMG    := ${NAME}:${TAG}
LATEST := ${NAME}:latest
#TMPDIR := $(shell mktemp -d /tmp/meteor.ema.XXXXXXX)
NODE_VERSION := ${shell meteor node -v}
NVM_DIR := ${HOME}/.nvm
METEOR_PACKAGE_DIRS := $(shell .helpers/get_package_dirs.sh)

build:
	[ -s "${NVM_DIR}/nvm.sh" ] && . "${NVM_DIR}/nvm.sh" && nvm install ${NODE_VERSION} && nvm use ${NODE_VERSION}; \
	npm install --production; \
	rm -rf .build; \
	NODE_TLS_REJECT_UNAUTHORIZED=0;
	METEOR_PACKAGE_DIRS=${METEOR_PACKAGE_DIRS} meteor build --directory ./.build --architecture os.linux.x86_64 --allow-superuser;
	docker build -t ${IMG} .
	docker tag ${IMG} ${LATEST}

deploy:
	.helpers/update-env.sh
	docker-compose down && docker-compose up -d

deploy_stage:
	.helpers/update-env-stage.sh
	docker-compose down && docker-compose up -d

deploy_dev:
	.helpers/update-env-dev.sh
	docker-compose down && docker-compose up -d
