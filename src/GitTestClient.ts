import path from "path";
import { execa, type Options } from "execa";
import { writeFile } from "fs/promises";

export interface InitialSetupOptions {
  initialFileName?: string;
  initialCommitMessage?: string;
}

class GitTestClient {
  private homeDirectory: string;
  repository: string;

  private constructor(homeDirectory: string) {
    this.homeDirectory = homeDirectory;
    this.repository = path.resolve(this.homeDirectory, "test-repository");
  }

  async run(command: string, args?: string[], options?: Omit<Options, "cwd">) {
    return await execa(command, args, { ...options, cwd: this.repository });
  }

  static async create(
    directory: string,
    initialSetupOptions?: InitialSetupOptions,
  ) {
    const gitTestClient = new GitTestClient(directory);
    await execa(
      "git",
      ["config", "--global", "user.email", "test@example.com"],
      {
        env: {
          HOME: gitTestClient.homeDirectory,
        },
      },
    );
    await execa("git", ["config", "--global", "user.name", "Test User"], {
      env: {
        HOME: gitTestClient.homeDirectory,
      },
    });
    const originDirectory = path.join(
      gitTestClient.homeDirectory,
      "origin.git",
    );
    await execa("git", ["init", "--bare", originDirectory]);
    await execa("mkdir", ["test-repository"], {
      cwd: gitTestClient.homeDirectory,
    });
    await gitTestClient.run("git", ["init"]);
    await gitTestClient.run("git", ["checkout", "-b", "main"]);
    await gitTestClient.run("git", [
      "remote",
      "add",
      "origin",
      originDirectory,
    ]);
    const testFilePath = path.join(
      gitTestClient.repository,
      initialSetupOptions?.initialFileName ?? "README.md",
    );
    await writeFile(testFilePath, "");
    await gitTestClient.run("git", ["add", "."]);
    await gitTestClient.run("git", [
      "commit",
      "-m",
      initialSetupOptions?.initialCommitMessage ?? "Initial commit",
    ]);
    await gitTestClient.run("git", ["push", "origin", "main"]);
    return gitTestClient;
  }
}

export default GitTestClient;
