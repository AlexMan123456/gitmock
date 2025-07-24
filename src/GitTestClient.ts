import path from "path";
import { execa, type Options } from "execa";
import { writeFile } from "fs/promises";

class GitTestClient {
  private directory: string;
  repository: string;

  private constructor(directory: string) {
    this.directory = directory;
    this.repository = path.resolve(this.directory, "test-repository");
  }

  async run(command: string, args?: string[], options?: Omit<Options, "cwd">) {
    return await execa(command, args, { ...options, cwd: this.repository });
  }

  static async create(
    directory: string,
    initialFileName: string = "README.md",
    initialCommitMessage: string = "Initial commit",
  ) {
    const gitTestClient = new GitTestClient(directory);
    await execa(
      "git",
      ["config", "--global", "user.email", "test@example.com"],
      {
        env: {
          HOME: gitTestClient.directory,
        },
      },
    );
    await execa("git", ["config", "--global", "user.name", "Test User"], {
      env: {
        HOME: gitTestClient.directory,
      },
    });
    const originDirectory = path.join(gitTestClient.directory, "origin.git");
    await execa("git", ["init", "--bare", originDirectory]);
    await execa("mkdir", ["test-repository"], { cwd: gitTestClient.directory });
    await gitTestClient.run("git", ["init"]);
    await gitTestClient.run("git", ["checkout", "-b", "main"]);
    await gitTestClient.run("git", [
      "remote",
      "add",
      "origin",
      originDirectory,
    ]);
    const testFilePath = path.join(gitTestClient.repository, initialFileName);
    await writeFile(testFilePath, "");
    await gitTestClient.run("git", ["add", "."]);
    await gitTestClient.run("git", ["commit", "-m", initialCommitMessage]);
    await gitTestClient.run("git", ["push", "origin", "main"]);
    return gitTestClient;
  }
}

export default GitTestClient;
