import type { InitialSetupOptions } from "src/GitClient";

import { type DirectoryOptions, temporaryDirectoryTask } from "tempy";

import GitClient from "src/GitClient";

export type RepositoryOptions = InitialSetupOptions & DirectoryOptions;

async function repositoryTask(
  taskFunction: (gitTestClient: GitClient) => Promise<void>,
  options?: RepositoryOptions,
) {
  return await temporaryDirectoryTask(async (temporaryDirectory) => {
    const gitTestClient = await GitClient.create(temporaryDirectory, options);
    await taskFunction(gitTestClient);
  }, options);
}

export default repositoryTask;
