[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/docker-context-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/docker-context-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/docker-context-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/docker-context-action/releases)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/docker-context-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/docker-context-action/releases/latest)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/docker-context-action/release.yaml?logo=cachet&label=release)](https://github.com/cssnr/docker-context-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/docker-context-action/test.yaml?logo=cachet&label=test)](https://github.com/cssnr/docker-context-action/actions/workflows/test.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/docker-context-action/lint.yaml?logo=cachet&label=lint)](https://github.com/cssnr/docker-context-action/actions/workflows/lint.yaml)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/docker-context-action?logo=github&label=updated)](https://github.com/cssnr/docker-context-action/pulse)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/docker-context-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/docker-context-action)
[![Docs Last Commit](https://img.shields.io/github/last-commit/cssnr/stack-deploy-docs?logo=vitepress&logoColor=white&label=docs)](https://docker-deploy.cssnr.com/)
[![GitHub Contributors](https://img.shields.io/github/contributors/cssnr/docker-context-action?logo=github)](https://github.com/cssnr/docker-context-action/graphs/contributors)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/cssnr/docker-context-action?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/cssnr/docker-context-action?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/docker-context-action?logo=sharp&logoColor=white)](https://github.com/cssnr/docker-context-action)
[![GitHub Discussions](https://img.shields.io/github/discussions/cssnr/docker-context-action?logo=github)](https://github.com/cssnr/docker-context-action/discussions)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/docker-context-action?style=flat&logo=github)](https://github.com/cssnr/docker-context-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/docker-context-action?style=flat&logo=github)](https://github.com/cssnr/docker-context-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# Docker Context Action

- [Features](#Features)
- [Inputs](#Inputs)
- [Examples](#Examples)

Set up a Remote Docker Context over SSH using Password or Keyfile Authentication.

```yaml
- name: 'Docker Context'
  uses: cssnr/docker-context-action@v1
  with:
    host: ${{ secrets.DOCKER_HOST }}
    user: ${{ secrets.DOCKER_USER }}
    port: 22 # 22 is the default value
    pass: ${{ secrets.DOCKER_PASS }} # or ssh_key
    ssh_key: ${{ secrets.DOCKER_SSH_KEY }} # or pass

- name: 'Inspect Docker'
  runs: |
    docker context ls
    docker context inspect
    docker ps
```

**Make sure to review the [Inputs](#inputs).**

_Portainer Users: You can deploy directly to Portainer with: [cssnr/portainer-stack-deploy-action](https://github.com/cssnr/portainer-stack-deploy-action)_

## Features

- Configure SSH using keyfile or password, [src/ssh.sh](src/ssh.sh)
- Creates and uses a remote docker context, [src/context.sh](src/context.sh)
- Option to run Docker login for any registry, [src/login.sh](src/login.sh)
- Cleans up the authorized_keys file if using password, [src/cleanup.sh](src/cleanup.sh)

Don't see your feature here? Please help by submitting a [Feature Request](https://github.com/cssnr/docker-context-action/discussions/categories/feature-requests).

## Inputs

| Input&nbsp;Name                              |                 Required                 | Default&nbsp;Value | Description&nbsp;of&nbsp;the&nbsp;Input |
| :------------------------------------------- | :--------------------------------------: | :----------------- | :-------------------------------------- |
| [host](#host)                                |                 **Yes**                  | -                  | Remote Docker Hostname or IP            |
| `port`                                       |                    -                     | `22`               | Remote Docker Port                      |
| `user`                                       |                 **Yes**                  | -                  | Remote Docker Username                  |
| [pass](#passssh_key)                         |        [see below](#passssh_key)         | -                  | Remote Docker Password                  |
| [ssh_key](#passssh_key)                      |        [see below](#passssh_key)         | -                  | Remote SSH Key File                     |
| [registry_user](#registry_userregistry_pass) | [see below](#registry_userregistry_pass) | -                  | Registry Authentication Username        |
| [registry_pass](#registry_userregistry_pass) | [see below](#registry_userregistry_pass) | -                  | Registry Authentication Password        |
| [registry_host](#registry_host)              |                    -                     | `docker.io`        | Registry Authentication Host            |

```yaml
- name: 'Docker Context'
  uses: cssnr/docker-context-action@v1
  with:
    host: ${{ secrets.DOCKER_HOST }}
    user: ${{ secrets.DOCKER_USER }}
    port: 22 # 22 is default, you can remove or change this
    pass: ${{ secrets.DOCKER_PASS }} # not needed with ssh_key
    ssh_key: ${{ secrets.DOCKER_SSH_KEY }} # not needed with pass
```

#### host

The hostname or IP address of the remote docker server.  
If your hostname is behind a proxy like Cloudflare you will need to use the IP address.

#### pass/ssh_key

Required to set up the SSH, otherwise this must be done in a previous step.

#### registry_user/registry_pass

Only set these to run `docker login`. This can also be run in a subsequent step.

#### registry_host

To run `docker login` on another registry. Example: `ghcr.io`.

## Examples

With all inputs (not all required).

```yaml
- name: 'Docker Context'
  uses: cssnr/docker-context-action@v1
  with:
    host: ${{ secrets.DOCKER_HOST }}
    user: ${{ secrets.DOCKER_USER }}
    port: 22 # 22 is default, you can remove or change this
    pass: ${{ secrets.DOCKER_PASS }} # not needed with ssh_key
    ssh_key: ${{ secrets.DOCKER_SSH_KEY }} # not needed with pass
    registry_host: 'ghcr.io'
    registry_user: ${{ vars.GHCR_USER }}
    registry_pass: ${{ secrets.GHCR_PASS }}
```

Example workflow.

```yaml
- name: 'Docker Context'
  uses: cssnr/docker-context-action@v1
  with:
    host: ${{ secrets.DOCKER_HOST }}
    user: ${{ secrets.DOCKER_USER }}
    ssh_key: ${{ secrets.DOCKER_SSH_KEY }}

- name: 'Stack Deploy'
  runs: docker stack deploy -c docker-compose.yaml stack-name
```
