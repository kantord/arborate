import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { getForests, Forest } from './forests';

export interface Tree {
  id: string;
  title: string;
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