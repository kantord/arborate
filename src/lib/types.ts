export interface Branch {
  text: string;
  branches?: Branch[];
}

export interface Tree {
  id: string;
  title: string;
  description?: string;
  branches: Branch[];
} 