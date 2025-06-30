import { LanguageType } from '@/types/snippet';

interface LanguagePattern {
  language: LanguageType;
  patterns: RegExp[];
  extensions?: string[];
  keywords?: string[];
  weight: number;
}

const languagePatterns: LanguagePattern[] = [
  {
    language: 'javascript',
    patterns: [
      /\b(function|const|let|var|=>|import|export|require)\b/g,
      /\b(console\.log|document\.|window\.)/g,
      /\.(js|jsx|mjs)$/i,
    ],
    keywords: ['function', 'const', 'let', 'var', 'import', 'export', 'require'],
    weight: 1,
  },
  {
    language: 'typescript',
    patterns: [
      /\b(interface|type|enum|implements|extends)\b/g,
      /:\s*(string|number|boolean|object|any|unknown|void)/g,
      /\.(ts|tsx)$/i,
    ],
    keywords: ['interface', 'type', 'enum', 'implements', 'extends'],
    weight: 2,
  },
  {
    language: 'python',
    patterns: [
      /\b(def|class|import|from|if __name__|print|len|range)\b/g,
      /\.(py|pyw)$/i,
      /^\s*#.*$/m,
    ],
    keywords: ['def', 'class', 'import', 'from', 'print', 'len', 'range'],
    weight: 1,
  },
  {
    language: 'java',
    patterns: [
      /\b(public|private|protected|class|interface|extends|implements)\b/g,
      /\b(System\.out\.println|String|int|void|main)\b/g,
      /\.(java)$/i,
    ],
    keywords: ['public', 'private', 'protected', 'class', 'interface'],
    weight: 1,
  },
  {
    language: 'go',
    patterns: [
      /\b(package|import|func|var|const|type|struct)\b/g,
      /\b(fmt\.Print|make|len|cap)\b/g,
      /\.(go)$/i,
    ],
    keywords: ['package', 'import', 'func', 'var', 'const', 'type', 'struct'],
    weight: 1,
  },
  {
    language: 'rust',
    patterns: [
      /\b(fn|let|mut|struct|enum|impl|trait|use|mod)\b/g,
      /\b(println!|vec!|String|i32|u32)\b/g,
      /\.(rs)$/i,
    ],
    keywords: ['fn', 'let', 'mut', 'struct', 'enum', 'impl', 'trait'],
    weight: 1,
  },
  {
    language: 'cpp',
    patterns: [
      /\b(#include|using namespace|std::|cout|cin|endl)\b/g,
      /\b(int|float|double|char|void|class|template)\b/g,
      /\.(cpp|hpp|cc|h)$/i,
    ],
    keywords: ['include', 'using', 'namespace', 'std', 'cout', 'cin'],
    weight: 1,
  },
  {
    language: 'c',
    patterns: [
      /\b(#include|printf|scanf|malloc|free|struct)\b/g,
      /\b(int|float|double|char|void)\b/g,
      /\.(c|h)$/i,
    ],
    keywords: ['include', 'printf', 'scanf', 'malloc', 'free', 'struct'],
    weight: 1,
  },
  {
    language: 'csharp',
    patterns: [
      /\b(using|namespace|class|interface|public|private|static|void)\b/g,
      /\b(Console\.WriteLine|string|int|bool|var)\b/g,
      /\.(cs)$/i,
    ],
    keywords: ['using', 'namespace', 'class', 'interface', 'Console'],
    weight: 1,
  },
  {
    language: 'php',
    patterns: [
      /\<\?php/g,
      /\b(echo|print|var_dump|isset|function|class)\b/g,
      /\$\w+/g,
      /\.(php|phtml)$/i,
    ],
    keywords: ['echo', 'print', 'var_dump', 'isset', 'function', 'class'],
    weight: 1,
  },
  {
    language: 'ruby',
    patterns: [
      /\b(def|class|module|end|puts|print|require)\b/g,
      /\b(attr_accessor|attr_reader|attr_writer)\b/g,
      /\.(rb)$/i,
    ],
    keywords: ['def', 'class', 'module', 'end', 'puts', 'print', 'require'],
    weight: 1,
  },
  {
    language: 'swift',
    patterns: [
      /\b(func|var|let|class|struct|enum|protocol|import)\b/g,
      /\b(print|String|Int|Bool|Array|Dictionary)\b/g,
      /\.(swift)$/i,
    ],
    keywords: ['func', 'var', 'let', 'class', 'struct', 'enum', 'protocol'],
    weight: 1,
  },
  {
    language: 'kotlin',
    patterns: [
      /\b(fun|val|var|class|interface|object|companion)\b/g,
      /\b(println|String|Int|Boolean|List|Map)\b/g,
      /\.(kt|kts)$/i,
    ],
    keywords: ['fun', 'val', 'var', 'class', 'interface', 'object'],
    weight: 1,
  },
  {
    language: 'dart',
    patterns: [
      /\b(void|main|class|extends|implements|import|library)\b/g,
      /\b(print|String|int|bool|List|Map)\b/g,
      /\.(dart)$/i,
    ],
    keywords: ['void', 'main', 'class', 'extends', 'implements', 'import'],
    weight: 1,
  },
  {
    language: 'bash',
    patterns: [
      /^#!/g,
      /\b(echo|cd|ls|grep|awk|sed|curl|wget)\b/g,
      /\$\{?\w+\}?/g,
      /\.(sh|bash)$/i,
    ],
    keywords: ['echo', 'cd', 'ls', 'grep', 'awk', 'sed', 'curl', 'wget'],
    weight: 1,
  },
  {
    language: 'powershell',
    patterns: [
      /\b(Get-|Set-|New-|Remove-|Write-Host|Write-Output)\b/g,
      /\$\w+/g,
      /\.(ps1|psm1)$/i,
    ],
    keywords: ['Get-', 'Set-', 'New-', 'Remove-', 'Write-Host'],
    weight: 1,
  },
  {
    language: 'sql',
    patterns: [
      /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/gi,
      /\b(JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|GROUP BY|ORDER BY)\b/gi,
      /\.(sql)$/i,
    ],
    keywords: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE'],
    weight: 1,
  },
  {
    language: 'html',
    patterns: [
      /<\/?[a-z][\s\S]*>/gi,
      /<!DOCTYPE html>/gi,
      /<(div|span|p|h[1-6]|body|head|html)/gi,
      /\.(html|htm)$/i,
    ],
    keywords: ['div', 'span', 'body', 'head', 'html'],
    weight: 1,
  },
  {
    language: 'css',
    patterns: [
      /\{[^}]*\}/g,
      /\.[a-zA-Z][\w-]*\s*\{/g,
      /#[a-zA-Z][\w-]*\s*\{/g,
      /\.(css)$/i,
    ],
    keywords: ['color', 'background', 'margin', 'padding', 'border'],
    weight: 1,
  },
  {
    language: 'scss',
    patterns: [
      /\$\w+:/g,
      /@import|@mixin|@include|@extend/g,
      /\.(scss|sass)$/i,
    ],
    keywords: ['import', 'mixin', 'include', 'extend'],
    weight: 1,
  },
  {
    language: 'json',
    patterns: [
      /^\s*\{[\s\S]*\}\s*$/,
      /^\s*\[[\s\S]*\]\s*$/,
      /"[^"]*"\s*:\s*(".*"|[\d.]+|true|false|null)/g,
      /\.(json)$/i,
    ],
    keywords: [],
    weight: 1,
  },
  {
    language: 'yaml',
    patterns: [
      /^\s*[\w-]+:\s*[\w\s\-\.]*$/m,
      /^\s*-\s+/m,
      /\.(yaml|yml)$/i,
    ],
    keywords: [],
    weight: 1,
  },
  {
    language: 'xml',
    patterns: [
      /<\?xml/gi,
      /<\/?[a-z][\s\S]*>/gi,
      /\.(xml|xsd|xsl)$/i,
    ],
    keywords: [],
    weight: 1,
  },
  {
    language: 'markdown',
    patterns: [
      /^#{1,6}\s+/m,
      /\*\*.*\*\*|\*.*\*/g,
      /\[.*\]\(.*\)/g,
      /```[\s\S]*```/g,
      /\.(md|markdown)$/i,
    ],
    keywords: [],
    weight: 1,
  },
];

export const detectLanguage = (code: string, filename?: string): LanguageType => {
  if (!code || code.trim().length === 0) {
    return 'plaintext';
  }

  const scores = new Map<LanguageType, number>();

  // Check filename extension first if provided
  if (filename) {
    for (const pattern of languagePatterns) {
      for (const extensionPattern of pattern.patterns) {
        if (extensionPattern.test(filename)) {
          scores.set(pattern.language, (scores.get(pattern.language) || 0) + pattern.weight * 3);
        }
      }
    }
  }

  // Analyze code content
  for (const pattern of languagePatterns) {
    let score = 0;
    
    for (const regex of pattern.patterns) {
      const matches = code.match(regex);
      if (matches) {
        score += matches.length * pattern.weight;
      }
    }

    if (score > 0) {
      scores.set(pattern.language, (scores.get(pattern.language) || 0) + score);
    }
  }

  // Special case for JSON - must be valid JSON structure
  if (code.trim().startsWith('{') || code.trim().startsWith('[')) {
    try {
      JSON.parse(code);
      scores.set('json', (scores.get('json') || 0) + 10);
    } catch {
      // Not valid JSON
    }
  }

  // Find the language with the highest score
  let bestLanguage: LanguageType = 'plaintext';
  let bestScore = 0;

  for (const [language, score] of scores.entries()) {
    if (score > bestScore) {
      bestScore = score;
      bestLanguage = language;
    }
  }

  return bestLanguage;
};

export const getSupportedLanguages = (): LanguageType[] => {
  return languagePatterns.map(p => p.language);
};

export const getLanguageDisplayName = (language: LanguageType): string => {
  const displayNames: Record<LanguageType, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    java: 'Java',
    go: 'Go',
    rust: 'Rust',
    cpp: 'C++',
    c: 'C',
    csharp: 'C#',
    php: 'PHP',
    ruby: 'Ruby',
    swift: 'Swift',
    kotlin: 'Kotlin',
    dart: 'Dart',
    bash: 'Bash',
    powershell: 'PowerShell',
    sql: 'SQL',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    json: 'JSON',
    yaml: 'YAML',
    xml: 'XML',
    markdown: 'Markdown',
    plaintext: 'Plain Text',
  };

  return displayNames[language] || language;
}; 