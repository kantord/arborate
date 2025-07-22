import fs from 'fs';
import path from 'path';
import { getForests, Forest } from './forests';
import { getTrees, Tree } from './trees';
import {
  generatePlaywrightTest,
  generatePytestTest,
  generateCypressTest,
  generateJestTest,
  generateGenericTest,
  getFileExtension
} from './runner-templates';

interface CompilationResult {
  forestName: string;
  generatedFiles: string[];
  errors: string[];
}

function compileForest(forestName: string): CompilationResult {
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
      // Determine file extension based on runner type
      const fileExtension = getFileExtension(forest.runner);

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

  // Generate test structure based on runner type
  switch (forest.runner) {
    case 'playwright':
      return generatePlaywrightTest(tree, testName, testDescription);
    case 'pytest':
      return generatePytestTest(tree, testName, testDescription);
    case 'cypress':
      return generateCypressTest(tree, testName, testDescription);
    case 'jest':
      return generateJestTest(tree, testName, testDescription);
    default:
      return generateGenericTest(tree, testName, testDescription);
  }
} 
