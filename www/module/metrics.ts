/**
 * Module metrics used to estimate a modules quality and create recommendations
 */
export interface ModuleMetrics {
  user: UserMetrics;
  dependencies: DependencyMetrics;
  documentation: DocumentationMetrics;
  structure: StructureMetrics;
  formatting: FormattingMetrics;
  linting: LintingMetrics;
  coverage: CoverageMetrics;
  testing: TestingMetrics;
  duplicate: DuplicateCodeMetrics;
}

/**
 * Metrics related to users and the modules usage
 */
export interface UserMetrics {
  /**
   * The number of modules on mod.land (may be extended to x, nest, crux, npm,
   * github, gitlab, etcetera in the future) which are dependent upon this module
   */
  dependents: number;
  /**
   * The number of total downloads this package has
   */
  downloads: number;
  /**
   * The number of user given likes this module has
   */
  likes: number;
}

/**
 * Metrics related to dependencies
 */
export interface DependencyMetrics {
  /**
   * The number of dependencies
   */
  dependencies: number;
  /**
   * Issues that have been found regarding dependencies used
   */
  issues: DependencyIssue[];
}

export interface Dependency {
  name: string;
  url: string;
}

export type DependencyIssue =
  | OutdatedDependecy
  | UnversionedDependency
  | DeprecatedDependency
  | DangerousDependency
  | UnknownRegistry;

export interface OutdatedDependecy extends Dependency {
  /**
   * The current version of the dependency which this module is dependent on
   */
  current_version: string;
  /**
   * The latest version of the dependency which has been released
   */
  latest_version: string;
}

export interface UnversionedDependency extends Dependency {
  /**
   * The latest version of the dependency
   */
  latest_version: string;
}

/**
 * A deprecated dependecy which this module is dependent on
 */
export type DeprecatedDependency = Dependency;

/**
 * A dependency which has been marked as dangerous which this module is dependent on
 */
export type DangerousDependency = Dependency;

/**
 * A dependency hosted on an unknown module registry
 */
export interface UnknownRegistry extends Dependency {
  registry: string;
}

export interface FormattingMetrics {
}

export interface LintingMetrics {
}

export interface CoverageMetrics {
}

export interface TestingMetrics {
}

export interface DuplicateCodeMetrics {
}

export interface DocumentationMetrics {
  coverage: number;
}

export interface StructureMetrics {
  readme: boolean;
  changelog: boolean;
  license: boolean;
}
