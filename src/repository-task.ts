import GitTestClient, { InitialSetupOptions } from "src/GitTestClient";
import { type DirectoryOptions, temporaryDirectoryTask } from "tempy";

export type RepositoryOptions = InitialSetupOptions & DirectoryOptions;

function repositoryTask(
  taskFunction: (gitTestClient: GitTestClient) => Promise<void>,
  options?: RepositoryOptions,
) {
  return temporaryDirectoryTask(async (temporaryDirectory) => {
    const gitTestClient = await GitTestClient.create(
      temporaryDirectory,
      options,
    );
    await taskFunction(gitTestClient);
  }, options);
}

export default repositoryTask;
