import { readFile } from "fs/promises";
import path from "path";
import GitTestClient from "src/GitTestClient";
import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";

describe("Create GitTestClient", () => {
  test("Creates a new repository with a main branch in the given directory", async () => {
    await temporaryDirectoryTask(async (temporaryDirectory) => {
      const gitTestClient = await GitTestClient.create(temporaryDirectory);
      const { stdout: currentBranch } = await gitTestClient.run("git", [
        "branch",
        "--show-current",
      ]);
      expect(currentBranch).toBe("main");
    });
  });
  test("Creates an initial commit with a default message if not provided", async () => {
    await temporaryDirectoryTask(async (temporaryDirectory) => {
      const gitTestClient = await GitTestClient.create(temporaryDirectory);
      const { stdout: logs } = await gitTestClient.run("git", ["log"]);
      expect(logs).toContain("Initial commit");
    });
  });
  test("Creates an initial commit with the provided message if given", async () => {
    await temporaryDirectoryTask(async (temporaryDirectory) => {
      const gitTestClient = await GitTestClient.create(temporaryDirectory, {
        initialCommitMessage: "Different initial commit",
      });
      const { stdout: logs } = await gitTestClient.run("git", ["log"]);
      expect(logs).toContain("Different initial commit");
      expect(logs).not.toContain("Initial commit");
    });
  });
  test("Creates a README.md file by default", async () => {
    await temporaryDirectoryTask(async (temporaryDirectory) => {
      const gitTestClient = await GitTestClient.create(temporaryDirectory);
      const filePath = path.join(gitTestClient.repository, "README.md");
      const content = await readFile(filePath, "utf-8");
      expect(content).toBe("");
    });
  });
  test("Creates a file with the specified file name if given", async () => {
    await temporaryDirectoryTask(async (temporaryDirectory) => {
      const gitTestClient = await GitTestClient.create(temporaryDirectory, {
        initialFileName: "test-file.js",
      });
      const filePath = path.join(gitTestClient.repository, "test-file.js");
      const content = await readFile(filePath, "utf-8");
      expect(content).toBe("");
    });
  });
});
