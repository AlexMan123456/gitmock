import { readFile, writeFile } from "fs/promises";
import { describe } from "node:test";
import path from "path";
import repositoryTask from "src/repository-task";
import { expect, test } from "vitest";

describe("mergeChanges", () => {
  test("Merges changes from specified branch into main", async () => {
    await repositoryTask(
      async (gitTestClient) => {
        await gitTestClient.run("git", ["checkout", "-b", "test-branch"]);
        const testFilePath = path.join(
          gitTestClient.repository,
          "test-file.js",
        );
        await writeFile(testFilePath, 'console.log("This is a test");');
        await gitTestClient.run("git", ["add", "test-file.js"]);
        await gitTestClient.run("git", ["commit", "-m", "This is a test"]);
        await gitTestClient.run("git", ["push", "origin", "test-branch"]);

        await gitTestClient.mergeChanges("test-branch");

        await gitTestClient.run("git", ["checkout", "main"]);
        const fileContentsBefore = await readFile(testFilePath, "utf-8");
        expect(fileContentsBefore).toBe("");

        await gitTestClient.run("git", ["pull", "origin", "main"]);

        const fileContentsAfter = await readFile(testFilePath, "utf-8");
        expect(fileContentsAfter).toContain('console.log("This is a test");');
      },
      { initialFileName: "test-file.js" },
    );
  });
});
