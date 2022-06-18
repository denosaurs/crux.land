export interface Module {
  name: string;
  repo: string;
  version: string;
  creation_date: Date;
  release_type: ModuleReleaseType;
}

export type ModuleReleaseType = "push" | "pull";

export interface PullReleaseOptions {
  webhook: string;
}
