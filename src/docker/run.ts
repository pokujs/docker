import type { SpawnOptionsWithoutStdio } from 'node:child_process';
import { spawn } from 'node:child_process';
import { stdout } from 'node:process';

const log = (data: string | Uint8Array) => stdout.write(`${String(data)}\n`);

export const runDockerCommand = (
  command: string,
  args: string[],
  options?: SpawnOptionsWithoutStdio,
  verbose?: boolean
): Promise<boolean> =>
  new Promise((resolve) => {
    const dockerProcess = spawn(command, args, {
      ...options,
      shell: false,
    });

    if (verbose) {
      dockerProcess.stdout.setEncoding('utf8');
      dockerProcess.stderr.setEncoding('utf8');
      dockerProcess.stdout.on('data', log);
      dockerProcess.stderr.on('data', log);
    }

    dockerProcess.on('close', (code) => resolve(code === 0));
    dockerProcess.on('error', () => resolve(false));
  });
