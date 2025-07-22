import { Tree } from '../trees';
import { extractTestSteps } from './utils';
import { TestFile } from './types';

export function generateGenericTest(tree: Tree, testName: string, testDescription: string): TestFile {
  const steps = extractTestSteps(tree);

  const content = `// ${testName}
// ${testDescription}

${steps.map(step => `// ${step}`).join('\n')}

// TODO: Implement test steps
// This test was generated from tree: ${tree.id}
`;

  return {
    path: `${tree.id}.test.ts`,
    content
  };
} 