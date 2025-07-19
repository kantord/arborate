import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface ArborateConfig {
  forests: string[];
}

export function getArborateConfig(): ArborateConfig {
  const configPath = path.join(process.cwd(), 'arborate.yml');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(configFile) as ArborateConfig;
  
  return config;
}

export function getForests(): string[] {
  const config = getArborateConfig();
  return config.forests || [];
} 