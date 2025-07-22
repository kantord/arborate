import { Tree } from '../trees';
import { Branch } from '../types';

export function extractTestSteps(tree: Tree): string[] {
  const steps: string[] = [];

  const processBranches = (branches: Branch[], level: number = 0) => {
    branches.forEach(branch => {
      const indent = '  '.repeat(level);
      steps.push(`${indent}${branch.text}`);

      if (branch.branches && branch.branches.length > 0) {
        processBranches(branch.branches, level + 1);
      }
    });
  };

  if (tree.branches && tree.branches.length > 0) {
    processBranches(tree.branches);
  }

  return steps;
} 