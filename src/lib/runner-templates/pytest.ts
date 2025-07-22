import { Tree } from '../trees';
import { extractTestSteps } from './utils';

export function generatePytestTest(tree: Tree, testName: string, testDescription: string): string {
  const steps = extractTestSteps(tree);

  return `import pytest

def test_${tree.id.replace(/[^a-zA-Z0-9]/g, '_')}():
    """${testDescription}"""
    
${steps.map(step => `    # ${step}`).join('\n')}
    
    # TODO: Implement test steps
    # This test was generated from tree: ${tree.id}
    assert True
`;
} 