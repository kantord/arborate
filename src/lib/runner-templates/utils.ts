import { Tree } from '../trees';
import { Branch } from '../types';
import { StepDefinition, processStepsWithIndentation } from '../steps';

export function extractTestSteps(tree: Tree, stepDefinitions: StepDefinition[] = []): string[] {
  const steps: { text: string; indent: string }[] = [];

  const processBranches = (branches: Branch[], level: number = 0) => {
    branches.forEach(branch => {
      const indent = '  '.repeat(level);
      steps.push({ text: branch.text, indent });

      if (branch.branches && branch.branches.length > 0) {
        processBranches(branch.branches, level + 1);
      }
    });
  };

  if (tree.branches && tree.branches.length > 0) {
    processBranches(tree.branches);
  }

  // Process steps with step definitions if provided
  if (stepDefinitions.length > 0) {
    return processStepsWithIndentation(steps, stepDefinitions);
  }

  return steps.map(step => `${step.indent}${step.text}`);
} 