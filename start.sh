#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

APP=data-viewer
COMMIT_ID=$(git rev-parse --verify HEAD)
VERSION="${VERSION:-"${COMMIT_ID:0:8}"}"

function build() {
  echo "Build"
  docker build -t ${APP}:${VERSION} --platform linux/amd64 -f Dockerfile .
  docker push ${APP}:${VERSION}
  echo "End....."
};

function build_nginx() {
  echo "Build"
  docker build -t "${APP}-nginx:${VERSION}" -f Dockerfile.nginx .
  docker push ${APP}-nginx:${VERSION}
  echo "End....."
}

function run(){
  echo "Running"
  docker rm -f data-viewer && \
	docker run --name data-viewer --restart=always -itd ${APP}:${VERSION}
  docker rm -f data-viewer-nginx && \
  docker run --name data-viewer-nginx --restart=always -itd \
    --link data-viewer:data-viewer \
    -e API_HOST=${CLOUD_URL} \
    -e API_PORT=8080    \
    -e NEXTJS_SERVER=data-viewer \
    -p 5000:80 \
    ${APP}-nginx:${VERSION}

  echo "End....."
}

while true
do
  case "$1" in
  build-nginx)
      build_nginx
      shift
      ;;
  build)
      build
      build_nginx
      shift
      ;;
  run)
      run
      shift
      ;;
  -h|--help)
      usage
      ;;
  esac
shift
done