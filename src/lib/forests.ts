import fs from 'fs';
import path from 'path';
import { getArborateConfig } from './config';

export interface Forest {
  name: string;
  path: string;
  treeCount: number;
}

function getTreeCount(forestPath: string): number {
  const treesPath = path.join(process.cwd(), forestPath, 'trees');
  
  if (!fs.existsSync(treesPath)) {
    return 0;
  }
  
  const treeFiles = fs.readdirSync(treesPath)
    .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));
  
  return treeFiles.length;
}

export function getForests(): Forest[] {
  const config = getArborateConfig();
  return (config.forests || []).map(forest => {
    const forestName = typeof forest === 'string' ? forest : forest.name;
    const forestPath = typeof forest === 'string' ? `forests/${forest}` : forest.path;
    
    return {
      name: forestName,
      path: forestPath,
      treeCount: getTreeCount(forestPath)
    };
  });
} 