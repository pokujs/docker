import type { DockerComposeConfigs } from '../@types/container.js';
import { runDockerCommand } from './run.js';

export class DockerCompose {
  private file;
  private envFile;
  private projectName;
  private cwd;
  private verbose;
  private build;
  private detach;
  private serviceName;

  constructor(configs: DockerComposeConfigs) {
    const {
      file,
      projectName,
      build,
      serviceName,
      envFile,
      detach,
      cwd,
      verbose,
    } = configs;

    this.file = file ?? './docker-compose.yml';
    this.build = build;
    this.serviceName = serviceName;
    this.envFile = envFile;
    this.projectName = projectName;
    this.detach = detach;
    this.cwd = cwd;
    this.verbose = verbose;
  }

  up() {
    const args: string[] = ['compose', '-f', this.file];

    if (this.envFile) args.push(...['--env-file', this.envFile]);
    if (this.projectName) args.push(...['-p', this.projectName]);

    args.push('up');
    args.push(this.detach !== false ? '-d' : '--abort-on-container-exit');

    if (this.build) args.push('--build');
    if (this.serviceName) args.push(this.serviceName);

    return runDockerCommand('docker', args, { cwd: this.cwd }, this.verbose);
  }

  down() {
    const args: string[] = ['-f', this.file];

    if (this.envFile) args.push(...['--env-file', this.envFile]);
    if (this.projectName) args.push(...['-p', this.projectName]);

    return runDockerCommand(
      'docker',
      ['compose', ...args, 'down'],
      { cwd: this.cwd },
      this.verbose
    );
  }
}
