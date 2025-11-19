import type {
  DockerComposeConfigs,
  DockerfileConfigs,
} from './@types/container.js';
import { DockerCompose } from './docker/compose.js';
import { DockerContainer } from './docker/file.js';

/** A minimal API to assist tests that require containers or tests that run inside containers using a **Dockerfile**. */
const dockerfile = (configs: DockerfileConfigs) => new DockerContainer(configs);

/** A minimal API to assist tests that require containers or tests that run inside containers using a **docker-compose.yml**. */
const compose = (configs: DockerComposeConfigs) => new DockerCompose(configs);

export const docker = { dockerfile, compose };

export type {
  DockerComposeConfigs,
  DockerfileConfigs,
} from './@types/container.js';
