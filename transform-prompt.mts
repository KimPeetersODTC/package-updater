import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { glob } from "node:fs/promises";

const templateName = process.argv[2];
const issueArg = process.argv[3];
if (!issueArg) {
  console.error(
    "Usage: tsx transform-prompt.mts <template-name> <issue-number>",
  );
  process.exit(1);
}

const issueNum = issueArg.padStart(2, "0");

// Find the issue file
const matches: string[] = [];
for await (const file of glob(`docs/issues/${issueNum}-*.md`)) {
  matches.push(file);
}

if (matches.length === 0) {
  console.error(`No issue file found matching docs/issues/${issueNum}-*.md`);
  process.exit(1);
}

const issuePath = matches[0];
const issueContent = readFileSync(issuePath, "utf-8");

// Extract first # heading as title
const titleMatch = issueContent.match(/^#\s+(.+)$/m);
const rawTitle = titleMatch ? titleMatch[1].trim() : `Issue ${issueNum}`;
const issueTitle = rawTitle.replace(/^\d+\s*[—–-]\s*/, "");

const placeholders: Record<string, string> = {
  TASK_ID: issueNum,
  ISSUE_TITLE: issueTitle,
  VIEW_TASK_COMMAND: `cat ${issuePath}`,
  ISSUE_PATH: issuePath,
};

const template = readFileSync(`${templateName}-prompt.md`, "utf-8");

// Replace {{PLACEHOLDER}} tokens
let output = template.replace(/\{\{([^}]+)\}\}/g, (match, key: string) => {
  return key in placeholders ? placeholders[key] : match;
});

// Execute !`command` blocks, replacing them with command output
output = output.replace(/!`([^`]+)`/g, (_match, command: string) => {
  try {
    return execSync(command, { encoding: "utf-8" }).trimEnd();
  } catch (err: unknown) {
    const error = err as { stderr?: Buffer | string; message?: string };
    const detail =
      error.stderr?.toString().trim() || error.message || String(err);
    console.error(`Warning: command failed: ${command}\n  ${detail}`);
    return `(command failed: ${command})`;
  }
});

process.stdout.write(output);
