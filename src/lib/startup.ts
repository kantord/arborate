import { compileAllForests } from './compiler';

let hasCompiled = false;

export function initializeCompilation() {
  if (hasCompiled) {
    console.log('🔄 Compilation already completed, skipping...');
    return; // Only compile once per server instance
  }

  try {
    console.log('🔄 Starting compilation of test forests...');
    console.log('🔄 Current working directory:', process.cwd());
    
    const results = compileAllForests();
    console.log('🔄 Compilation results:', results);
    
    let totalFiles = 0;
    let totalErrors = 0;
    
    results.forEach(result => {
      console.log(`🔄 Processing result for ${result.forestName}:`, result);
      
      if (result.generatedFiles.length > 0) {
        console.log(`✅ ${result.forestName}: Generated ${result.generatedFiles.length} test files`);
        console.log(`📁 Files:`, result.generatedFiles);
        totalFiles += result.generatedFiles.length;
      } else {
        console.log(`⚠️  ${result.forestName}: No files generated`);
      }
      
      if (result.errors.length > 0) {
        console.log(`❌ ${result.forestName}: ${result.errors.length} errors`);
        console.log(`🚨 Errors:`, result.errors);
        totalErrors += result.errors.length;
      }
    });
    
    console.log(`🎉 Compilation complete: ${totalFiles} files generated, ${totalErrors} errors`);
    hasCompiled = true;
  } catch (error) {
    console.error('❌ Failed to compile forests:', error);
    console.error('❌ Error details:', error);
  }
} 