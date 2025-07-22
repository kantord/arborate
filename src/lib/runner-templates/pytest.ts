import { Tree } from '../trees';
import { extractTestSteps } from './utils';
import { TestFile } from './types';

export function generatePytestTest(tree: Tree, testName: string, testDescription: string): TestFile {
  const steps = extractTestSteps(tree);

  const content = `import pytest

def test_${tree.id.replace(/[^a-zA-Z0-9]/g, '_')}():
    """${testDescription}"""
    
${steps.map(step => `    # ${step}`).join('\n')}
    
    # TODO: Implement test steps
    # This test was generated from tree: ${tree.id}
    assert True
`;

  return {
    path: `${tree.id}.py`,
    content
  };
} 