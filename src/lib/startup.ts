import { compileAllForests } from './compiler';

let hasCompiled = false;

export function initializeCompilation() {
  if (hasCompiled) {
    return; // Only compile once per server instance
  }

  try {
    const results = compileAllForests();
    
    let totalFiles = 0;
    let totalErrors = 0;
    
    results.forEach(result => {
      totalFiles += result.generatedFiles.length;
      totalErrors += result.errors.length;
    });
    
    if (totalFiles > 0) {
      console.log(`✅ Generated ${totalFiles} test files${totalErrors > 0 ? `, ${totalErrors} errors` : ''}`);
    }
    
    hasCompiled = true;
  } catch (error) {
    console.error('❌ Failed to compile forests:', error);
  }
} 