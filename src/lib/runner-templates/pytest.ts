import { Tree } from '../trees';
import { extractTestSteps } from './utils';
import { TestFile } from './types';
import { StepDefinition } from '../steps';

export function generatePytestTest(tree: Tree, testName: string, testDescription: string, stepDefinitions: StepDefinition[] = []): TestFile {
  const steps = extractTestSteps(tree, stepDefinitions);

  const content = `import pytest

def test_${tree.id.replace(/[^a-zA-Z0-9]/g, '_')}():
    """${testDescription}"""
    
${steps.map(step => `    ${step}`).join('\n')}
    
    # This test was generated from tree: ${tree.id}
    assert True
`;

  return {
    path: `${tree.id}.py`,
    content
  };
} 