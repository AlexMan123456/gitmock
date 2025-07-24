import GitTestClient from "src/GitTestClient";
import { type DirectoryOptions, temporaryDirectoryTask } from "tempy";

function repositoryTask(
  taskFunction: (gitTestClient: GitTestClient) => Promise<void>,
  options?: DirectoryOptions,
) {
  return temporaryDirectoryTask(async (temporaryDirectory) => {
    const gitTestClient = await GitTestClient.create(temporaryDirectory);
    await taskFunction(gitTestClient);
  }, options);
}

export default repositoryTask;
