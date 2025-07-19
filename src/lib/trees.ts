import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { getForests, Forest } from './forests';
import { Tree, Branch } from './types';

export { Tree, Branch } from './types';

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
      const treeData = yaml.load(treeFileContent) as Tree;
      
      return {
        id: treeId,
        title: treeData.title || treeId,
        description: treeData.description,
        branches: treeData.branches || []
      };
    });
  
  return treeFiles;
}

export function getTree(forestName: string, treeName: string): Tree | null {
  const forests = getForests();
  const forest = forests.find(f => f.name === forestName);
  
  if (!forest) {
    return null;
  }
  
  const treeFilePath = path.join(process.cwd(), forest.path, 'trees', `${treeName}.yml`);
  
  if (!fs.existsSync(treeFilePath)) {
    return null;
  }
  
  const treeFileContent = fs.readFileSync(treeFilePath, 'utf8');
  const treeData = yaml.load(treeFileContent) as Tree;
  
  return {
    id: treeName,
    title: treeData.title || treeName,
    description: treeData.description,
    branches: treeData.branches || []
  };
} 