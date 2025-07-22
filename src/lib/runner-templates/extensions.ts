export function getFileExtension(runner: string): string {
  const extensions: Record<string, string> = {
    'playwright': '.test.ts',
    'pytest': '.py',
    'cypress': '.test.ts',
    'jest': '.test.ts',
    'generic': '.test.ts'
  };
  
  return extensions[runner] || '.test.ts';
} 