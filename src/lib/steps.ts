import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface StepDefinition {
  step: string;
  code: string;
}

interface StepsConfig {
  steps: StepDefinition[];
}

interface MatchedStep {
  code: string;
  matches: string[];
}

export function getStepsForForest(forestPath: string): StepDefinition[] {
  const stepsFilePath = path.join(process.cwd(), forestPath, 'steps.yml');
  
  if (!fs.existsSync(stepsFilePath)) {
    return [];
  }

  try {
    const stepsFile = fs.readFileSync(stepsFilePath, 'utf8');
    const stepsConfig = yaml.load(stepsFile) as StepsConfig;
    return stepsConfig.steps || [];
  } catch (error) {
    console.warn(`Failed to parse steps.yml for forest at ${forestPath}:`, error);
    return [];
  }
}

function matchStep(stepText: string, stepDefinitions: StepDefinition[]): MatchedStep | null {
  for (const stepDef of stepDefinitions) {
    const regex = new RegExp(stepDef.step, 'i');
    const match = stepText.match(regex);
    
    if (match) {
      // Replace ${1}, ${2}, etc. with captured groups
      let code = stepDef.code;
      for (let i = 1; i < match.length; i++) {
        code = code.replace(new RegExp(`\\$\\{${i}\\}`, 'g'), match[i]);
      }
      
      return {
        code,
        matches: match.slice(1) // Return captured groups without the full match
      };
    }
  }
  
  return null;
}

export function processStepsWithIndentation(steps: { text: string; indent: string }[], stepDefinitions: StepDefinition[]): string[] {
  return steps.map(step => {
    const stepText = step.text.trim();
    const matched = matchStep(stepText, stepDefinitions);
    if (matched) {
      return `${step.indent}${matched.code}`;
    }
    // If no match found, return as comment with original indentation
    return `${step.indent}// ${step.text}`;
  });
} 