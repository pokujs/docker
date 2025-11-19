import { assert, describe, it, kill, skip, waitForPort } from 'poku';
import { isWindows } from '../__utils__/os.js';
import { docker } from '../../src/index.js';

if (isWindows) skip('External error: no matching manifest for windows/amd64');

describe('Docker Service', async () => {
  await kill.port(6053);

  await it('Using custom configs', async () => {
    const dockerfile = docker.dockerfile({
      tagName: 'poku-test-dockerfile',
      containerName: 'poku-test-dockerfile-server',
      ports: ['6053:6053'],
      file: 'test/__fixtures__/integration/docker/Dockerfile',
      context: 'test/__fixtures__/integration/docker',
      environments: ['NODE_ENV=build'],
      envFile: 'test/__fixtures__/integration/docker/src/.some.env',
      cache: false,
      verbose: true,
    });

    await dockerfile.remove();

    await dockerfile.build();
    await dockerfile.start();

    await waitForPort(6053, { delay: 250, timeout: 150000 });

    const res = await fetch('http://localhost:6053');

    await dockerfile.stop();
    await dockerfile.remove();

    assert.strictEqual(res?.status, 200, 'Service is on');
    assert.strictEqual(
      JSON.stringify(await res?.text()),
      '"Hello, World!\\n"',
      'Service is online'
    );
  });

  await it('Using default configs', async () => {
    const dockerfile = docker.dockerfile({
      tagName: 'poku-test-dockerfile',
      containerName: 'poku-test-dockerfile-server',
      cwd: 'test/__fixtures__/integration/docker',
    });

    await dockerfile.remove();

    await dockerfile.build();
    await dockerfile.start();

    await dockerfile.stop();
    await dockerfile.remove();
  });
});
