import fs from 'fs';
import path from 'path';
import { getForests, Forest } from './forests';
import { getTrees, Tree } from './trees';
import { Branch } from './types';

export interface CompilationResult {
  forestName: string;
  generatedFiles: string[];
  errors: string[];
}

export function compileForest(forestName: string): CompilationResult {
  const forests = getForests();
  const forest = forests.find(f => f.name === forestName);
  
  if (!forest) {
    return {
      forestName,
      generatedFiles: [],
      errors: [`Forest '${forestName}' not found`]
    };
  }

  const trees = getTrees(forestName);
  const generatedFiles: string[] = [];
  const errors: string[] = [];

  // Ensure target directory exists
  const targetDir = path.join(process.cwd(), forest.target);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  trees.forEach(tree => {
    try {
      // Determine file extension based on forest type
      let fileExtension = '.test.ts';
      if (forest.name === 'pytest-backend') {
        fileExtension = '.py';
      }
      
      const testFileName = `${tree.id}${fileExtension}`;
      const testFilePath = path.join(targetDir, testFileName);
      
      const testContent = generateTestContent(tree, forest);
      fs.writeFileSync(testFilePath, testContent, 'utf8');
      
      generatedFiles.push(testFilePath);
    } catch (error) {
      errors.push(`Failed to generate test for tree '${tree.id}': ${error}`);
    }
  });

  return {
    forestName,
    generatedFiles,
    errors
  };
}

export function compileAllForests(): CompilationResult[] {
  const forests = getForests();
  return forests.map(forest => compileForest(forest.name));
}

function generateTestContent(tree: Tree, forest: Forest): string {
  const testName = tree.title;
  const testDescription = tree.description || `Test for ${tree.title}`;
  
  // Generate test structure based on forest type
  switch (forest.name) {
    case 'playwright-frontend':
      return generatePlaywrightTest(tree, testName, testDescription);
    case 'pytest-backend':
      return generatePytestTest(tree, testName, testDescription);
    case 'cypress-e2e':
      return generateCypressTest(tree, testName, testDescription);
    case 'jest-unit':
      return generateJestTest(tree, testName, testDescription);
    default:
      return generateGenericTest(tree, testName, testDescription);
  }
}

function generatePlaywrightTest(tree: Tree, testName: string, testDescription: string): string {
  const steps = extractTestSteps(tree);
  
  return `import { test, expect } from '@playwright/test';

test('${testName}', async ({ page }) => {
  // ${testDescription}
  
${steps.map(step => `  // ${step}`).join('\n')}
  
  // TODO: Implement test steps
  // This test was generated from tree: ${tree.id}
});
`;
}

function generatePytestTest(tree: Tree, testName: string, testDescription: string): string {
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

function generateCypressTest(tree: Tree, testName: string, testDescription: string): string {
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

function generateJestTest(tree: Tree, testName: string, testDescription: string): string {
  const steps = extractTestSteps(tree);
  
  return `describe('${testName}', () => {
  test('${testDescription}', () => {
${steps.map(step => `    // ${step}`).join('\n')}
    
    // TODO: Implement test steps
    // This test was generated from tree: ${tree.id}
  });
});
`;
}

function generateGenericTest(tree: Tree, testName: string, testDescription: string): string {
  const steps = extractTestSteps(tree);
  
  return `// ${testName}
// ${testDescription}

${steps.map(step => `// ${step}`).join('\n')}

// TODO: Implement test steps
// This test was generated from tree: ${tree.id}
`;
}

function extractTestSteps(tree: Tree): string[] {
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