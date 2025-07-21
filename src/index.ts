import path from "path";
import { execa, type Options } from "execa";
import { writeFile } from "fs/promises";

class GitTestClient {
  private directory: string;
  repository: string;
  constructor(directory: string) {
    this.directory = directory;
    this.repository = path.resolve(this.directory, "test-repository");
  }

  async run(command: string, args?: string[], options?: Omit<Options, "cwd">) {
    return await execa(command, args, { ...options, cwd: this.repository });
  }

  async setup(initialFileName: string = "README.md") {
    const originDirectory = path.join(this.directory, "origin.git");
    await execa("git", ["init", "--bare", originDirectory]);
    await execa("mkdir", ["test-repository"], { cwd: this.directory });
    await this.run("git", ["init"]);
    await this.run("git", ["checkout", "-b", "main"]);
    await this.run("git", ["remote", "add", "origin", originDirectory]);
    const testFilePath = path.join(this.repository, initialFileName);
    await writeFile(testFilePath, "");
    await this.run("git", ["add", "."]);
    await this.run("git", ["commit", "-m", "Initial commit"]);
    await this.run("git", ["push", "origin", "main"]);
  }
}

export default GitTestClient;
