import { Tree } from '../trees';
import { extractTestSteps } from './utils';

export function generateCypressTest(tree: Tree, testName: string, testDescription: string): string {
  const steps = extractTestSteps(tree);

  return `describe('${testName}', () => {
  it('${testDescription}', () => {
${steps.map(step => `    // ${step}`).join('\n')}
    
    // TODO: Implement test steps
    // This test was generated from tree: ${tree.id}
  });
});
`;
} 