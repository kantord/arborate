export function getFileExtension(runner: string): string {
  const extensions: Record<string, string> = {
    'playwright': '.test.ts',
    'pytest': '.py',
    'generic': '.test.ts'
  };
  
  return extensions[runner] || '.test.ts';
} 