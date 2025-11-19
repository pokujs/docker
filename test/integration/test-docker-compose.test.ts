import { assert, describe, it, kill, skip, waitForPort } from 'poku';
import { isWindows } from '../__utils__/os.js';
import { docker } from '../../src/index.js';

if (isWindows) skip('External error: no matching manifest for windows/amd64');

describe('Docker Compose Service', async () => {
  await kill.port(6054);

  await it('Using all configs', async () => {
    const compose = docker.compose({
      file: 'docker-compose.yml',
      projectName: 'poku-test-docker-compose',
      cwd: 'test/__fixtures__/integration/docker',
      envFile: 'src/.some.env',
      build: true,
      serviceName: 'server',
      verbose: true,
    });

    await compose.up();
    await waitForPort(6054, { delay: 250, timeout: 150000 });

    const res = await fetch('http://localhost:6054');

    await compose.down();

    assert.strictEqual(res?.status, 200, 'Service is on');
    assert.strictEqual(
      JSON.stringify(await res?.text()),
      '"Hello, World!\\n"',
      'Service is online'
    );
  });

  await it('Using default configs', async () => {
    const compose = docker.compose({
      projectName: 'poku-test-docker-compose',
      cwd: 'test/__fixtures__/integration/docker',
    });

    await compose.up();
    await waitForPort(6054, { delay: 250, timeout: 150000 });

    const res = await fetch('http://localhost:6054');

    await compose.down();

    assert.strictEqual(res?.status, 200, 'Service is on');
    assert.strictEqual(
      JSON.stringify(await res?.text()),
      '"Hello, World!\\n"',
      'Service is online'
    );
  });
});
