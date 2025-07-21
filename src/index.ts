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
  ) {
    const client = new GitTestClient(directory);
    const originDirectory = path.join(client.directory, "origin.git");
    await execa("git", ["init", "--bare", originDirectory]);
    await execa("mkdir", ["test-repository"], { cwd: client.directory });
    await client.run("git", ["init"]);
    await client.run("git", ["checkout", "-b", "main"]);
    await client.run("git", ["remote", "add", "origin", originDirectory]);
    const testFilePath = path.join(client.repository, initialFileName);
    await writeFile(testFilePath, "");
    await client.run("git", ["add", "."]);
    await client.run("git", ["commit", "-m", "Initial commit"]);
    await client.run("git", ["push", "origin", "main"]);
  }
}

export default GitTestClient;
