import { getArborateConfig } from './config';

export interface Forest {
  name: string;
  path: string;
}

export function getForests(): Forest[] {
  const config = getArborateConfig();
  return (config.forests || []).map(forest => {
    if (typeof forest === 'string') {
      return {
        name: forest,
        path: `forests/${forest}`
      };
    }
    return forest;
  });
} 