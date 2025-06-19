/**
 * 分析配置接口
 */
export interface AnalysisConfig {
  /** 项目目录 */
  projectDir: string;
  /** 飞书 webhook 地址 */
  feishuWebhook?: string;
  /** AI API Key */
  apiKey?: string;
  /** 百炼应用 ID */
  bailianAppId?: string;
}

/**
 * 源码分析信息接口
 */
export interface SourceAnalysis {
  /** 目录结构树 */
  directoryTree: string;
  /** 文件统计信息 */
  fileStats: FileStats;
  /** 主要文件内容（入口文件、路由等） */
  keyFiles: KeyFileContent[];
  /** 技术栈分析 */
  techStack: TechStackInfo;
}

/**
 * 文件统计信息接口
 */
export interface FileStats {
  /** 总文件数 */
  totalFiles: number;
  /** 各类型文件数量 */
  fileTypeCount: Record<string, number>;
  /** 总代码行数 */
  totalLines: number;
  /** 平均文件大小 */
  averageFileSize: number;
  /** 最大文件信息 */
  largestFiles: FileInfo[];
}

/**
 * 关键文件内容接口
 */
export interface KeyFileContent {
  /** 文件路径 */
  path: string;
  /** 文件内容 */
  content: string;
  /** 文件类型 */
  type: 'entry' | 'router' | 'store' | 'config' | 'component' | 'util';
  /** 文件描述 */
  description: string;
}

/**
 * 技术栈信息接口
 */
export interface TechStackInfo {
  /** 框架类型 */
  framework: string;
  /** UI 组件库 */
  uiLibrary: string[];
  /** 状态管理 */
  stateManagement: string[];
  /** 路由库 */
  router: string[];
  /** CSS 解决方案 */
  cssFramework: string[];
  /** 构建工具 */
  buildTool: string[];
  /** 开发工具 */
  devTools: string[];
}

/**
 * 项目信息接口
 */
export interface ProjectInfo {
  /** package.json 内容 */
  packageJson: any;
  /** dist 目录文件信息 */
  distFiles: FileInfo[];
  /** vite.config.ts 内容 */
  viteConfig?: string;
  /** pnpm 依赖树信息 */
  pnpmDependencies?: string;
  /** src 目录分析 */
  sourceAnalysis?: SourceAnalysis;
}

/**
 * 文件信息接口
 */
export interface FileInfo {
  /** 文件相对路径 */
  path: string;
  /** 文件大小（字节） */
  size: number;
  /** 文件大小（可读格式） */
  sizeFormatted: string;
  /** 代码行数（可选） */
  lines?: number;
}

/**
 * 分析报告接口
 */
export interface AnalysisReport {
  /** 报告标题 */
  title: string;
  /** 项目概述 */
  /** 构建产物分析 */
  buildAnalysis: string;
  /** 改进建议 */
  suggestions: string;
  /** 生成时间 */
  generatedAt: string;
} 
