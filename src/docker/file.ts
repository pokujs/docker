import type { DockerfileConfigs } from '../@types/container.js';
import { runDockerCommand } from './run.js';

export class DockerContainer {
  private file;
  private context;
  private tagName;
  private containerName;
  private ports;
  private environments;
  private cache;
  private envFile;
  private detach;
  private cwd;
  private verbose;

  constructor(configs: DockerfileConfigs) {
    const {
      context,
      file,
      tagName,
      containerName,
      ports,
      environments,
      cache,
      detach,
      envFile,
      cwd,
      verbose,
    } = configs;

    this.tagName = tagName;
    this.containerName = containerName;
    this.file = file || './Dockerfile';
    this.context = context || '.';
    this.ports = ports ?? [];
    this.cache = cache;
    this.environments = environments ?? [];
    this.envFile = envFile;
    this.detach = detach;
    this.cwd = cwd;
    this.verbose = verbose;
  }

  async build() {
    const args: string[] = ['build'];

    if (this.cache === false) args.push('--no-cache');

    await runDockerCommand(
      'docker',
      [...args, '-t', this.tagName, '-f', this.file, this.context],
      { cwd: this.cwd },
      this.verbose
    );
  }

  start() {
    const args: string[] = ['run'];

    args.push(this.detach !== false ? '-d' : '--init');
    args.push(...['--name', this.containerName]);

    for (const port of this.ports) args.push(...['-p', port]);
    for (const environment of this.environments)
      args.push(...['-e', environment]);

    if (this.envFile) args.push(...['--env-file', this.envFile]);

    return runDockerCommand(
      'docker',
      [...args, this.tagName],
      { cwd: this.cwd },
      this.verbose
    );
  }

  stop() {
    return runDockerCommand(
      'docker',
      ['stop', this.containerName],
      { cwd: this.cwd },
      this.verbose
    );
  }

  async remove() {
    await runDockerCommand(
      'docker',
      ['rm', '-f', this.containerName],
      { cwd: this.cwd },
      this.verbose
    );
    await runDockerCommand(
      'docker',
      ['image', 'rm', '-f', this.tagName],
      { cwd: this.cwd },
      this.verbose
    );
  }
}
