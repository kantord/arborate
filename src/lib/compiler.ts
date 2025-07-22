import fs from 'fs';
import path from 'path';
import { getForests, Forest } from './forests';
import { getTrees, Tree } from './trees';
import {
  generatePlaywrightTest,
  generatePytestTest,
  generateGenericTest,
  TestFile
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
      const testFile = generateTestFile(tree, forest);
      const testFilePath = path.join(targetDir, testFile.path);

      fs.writeFileSync(testFilePath, testFile.content, 'utf8');

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

function generateTestFile(tree: Tree, forest: Forest): TestFile {
  const testName = tree.title;
  const testDescription = tree.description || `Test for ${tree.title}`;

  // Generate test structure based on runner type
  switch (forest.runner) {
    case 'playwright':
      return generatePlaywrightTest(tree, testName, testDescription);
    case 'pytest':
      return generatePytestTest(tree, testName, testDescription);
    default:
      return generateGenericTest(tree, testName, testDescription);
  }
} 
// test comment
