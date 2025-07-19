import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface Tree {
  id: string;
  title: string;
}

interface Forest {
  name: string;
  path: string;
}

interface ArborateConfig {
  forests: (Forest | string)[];
}

export function getArborateConfig(): ArborateConfig {
  const configPath = path.join(process.cwd(), 'arborate.yml');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(configFile) as ArborateConfig;
  
  return config;
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

export function getTrees(forestName: string): Tree[] {
  const forests = getForests();
  const forest = forests.find(f => f.name === forestName);
  
  if (!forest) {
    return [];
  }
  
  const treesPath = path.join(process.cwd(), forest.path, 'trees');
  
  if (!fs.existsSync(treesPath)) {
    return [];
  }
  
  const treeFiles = fs.readdirSync(treesPath)
    .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
    .map(file => {
      const treeId = path.basename(file, path.extname(file));
      const treeFilePath = path.join(treesPath, file);
      const treeFileContent = fs.readFileSync(treeFilePath, 'utf8');
      const treeData = yaml.load(treeFileContent) as { title: string };
      
      return {
        id: treeId,
        title: treeData.title || treeId
      };
    });
  
  return treeFiles;
} 