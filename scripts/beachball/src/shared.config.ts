import { execSync } from 'child_process';

import type { BeachballConfig } from 'beachball';

import { renderEntry, renderHeader } from './customRenderers';
import * as baseConfig from './base.config';

/**
 * Shared Beachball release config.
 */
export const config: typeof baseConfig & Required<Pick<BeachballConfig, 'branch' | 'changelog' | 'hooks'>> = {
  ...baseConfig,
  branch: 'origin/master',
  changelog: {
    customRenderers: {
      renderHeader,
      renderEntry,
    },
  },
  hooks: {
    precommit: () => {
      try {
        const generators = [
          // Fixes any dependency mismatches caused by beachball scoping
          'dependency-mismatch',
          // Fixes unwanted pre-release dependency bumps caused by beachball
          'normalize-package-dependencies',
        ];

        generators.forEach(generator => {
          const cmd = `yarn nx g @fluentui/workspace-plugin:${generator}`;
          execSync(cmd, { stdio: 'inherit' });
        });

        execSync('yarn install --mode=update-lockfile', { stdio: 'inherit' });
      } catch (err) {
        console.error(err);
      }
    },
  },
};
