
export interface ErrorDetail {
  type: string;
  message: string;
}

export interface Run {
  text: string;
  font: string;
  errors: ErrorDetail[];
}

export interface Paragraph {
  type: 'paragraph';
  text: string;
  style?: string;
  errors: ErrorDetail[];
  runs: Run[];
}

export interface AISuggestion {
  message: string;
}

export interface CheckResult {
  documentStructure: Paragraph[];
  aiSuggestions: AISuggestion[];
}
