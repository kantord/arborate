import { Tree } from '../trees';
import { extractTestSteps } from './utils';
import { TestFile } from './types';
import { StepDefinition } from '../steps';

export function generatePlaywrightTest(tree: Tree, testName: string, testDescription: string, stepDefinitions: StepDefinition[] = []): TestFile {
  const steps = extractTestSteps(tree, stepDefinitions);

  const content = `import { test, expect } from '@playwright/test';

test('${testName}', async ({ page }) => {
  // ${testDescription}
  
${steps.map(step => `  ${step}`).join('\n')}
  
  // This test was generated from tree: ${tree.id}
});
`;

  return {
    path: `${tree.id}.test.ts`,
    content
  };
} 