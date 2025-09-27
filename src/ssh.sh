#!/usr/bin/env bash
# https://github.com/cssnr/docker-context-action

set -e

## Setup SSH

echo "Docker Context - ${GITHUB_ACTION_REF} - Setup SSH"

SSH_DIR="${HOME}/.ssh"

echo "User: $(whoami)"
echo "Script: ${0}"
echo "Current Directory: $(pwd)"
echo "Home Directory: ${HOME}"
echo "SSH Directory: ${SSH_DIR}"

echo "INPUT_HOST: ${INPUT_HOST}"
echo "INPUT_PORT: ${INPUT_PORT}"
echo "INPUT_PASS: ${INPUT_PASS}"

mkdir -p "${SSH_DIR}" ~/.ssh
chmod 0700 "${SSH_DIR}" ~/.ssh
echo "Running: ssh-keyscan"
ssh-keyscan -p "${INPUT_PORT}" -H "${INPUT_HOST}" >> "${SSH_DIR}/known_hosts"

if [[ -z "${INPUT_SSH_KEY}" ]];then
    echo "::group::Copying SSH Key to Remote Host"
    ssh-keygen -q -f "${SSH_DIR}/id_rsa" -N "" -C "docker-stack-deploy-action"
    eval "$(ssh-agent -s)"
    ssh-add "${SSH_DIR}/id_rsa"
    sshpass -eINPUT_PASS \
        ssh-copy-id -i "${SSH_DIR}/id_rsa" -o ConnectTimeout=30 \
            -p "${INPUT_PORT}" "${INPUT_USER}@${INPUT_HOST}"
    echo "STATE_SSH_CLEANUP=true" >> "${GITHUB_ENV}"
else
    echo "::group::Adding SSH Key to SSH Agent"
    echo "${INPUT_SSH_KEY}" > "${SSH_DIR}/id_rsa"
    chmod 0600 "${SSH_DIR}/id_rsa"
    eval "$(ssh-agent -s)"
    ssh-add "${SSH_DIR}/id_rsa"
fi
echo "::endgroup::"

echo -e "📟 \u001b[32;1m Setup SSH Complete"

#echo "STATE_SSH_CLEANUP=true" >> "${GITHUB_ENV}"
