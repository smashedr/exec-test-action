#!/usr/bin/env bash
# https://github.com/cssnr/docker-ssh-context-action

set -e

echo "Setup Context"

echo "::group::Verifying Docker Context"
ssh -o BatchMode=yes -o ConnectTimeout=30 -p "${INPUT_PORT}" \
    "${INPUT_USER}@${INPUT_HOST}" "docker info" > /dev/null
if ! docker context inspect remote >/dev/null 2>&1;then
    docker context create remote --docker "host=ssh://${INPUT_USER}@${INPUT_HOST}:${INPUT_PORT}"
fi
docker context use remote
docker context ls
echo "::endgroup::"

echo -e "🐳 \u001b[32;1m Setup Context Complete"
