import GitTestClient from "src/GitTestClient";
import { type DirectoryOptions, temporaryDirectoryTask } from "tempy";

export interface RepositoryOptions extends DirectoryOptions {
  initialFileName?: string;
  initialCommitMessage?: string;
}

function repositoryTask(
  taskFunction: (gitTestClient: GitTestClient) => Promise<void>,
  options?: RepositoryOptions,
) {
  return temporaryDirectoryTask(async (temporaryDirectory) => {
    const gitTestClient = await GitTestClient.create(
      temporaryDirectory,
      options?.initialFileName,
      options?.initialCommitMessage,
    );
    await taskFunction(gitTestClient);
  }, options);
}

export default repositoryTask;
