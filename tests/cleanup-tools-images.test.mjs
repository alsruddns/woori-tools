import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const cleanupScript = path.join(repositoryRoot, "scripts", "cleanup-tools-images.sh");
const workflowPath = path.join(repositoryRoot, ".github", "workflows", "deploy.yml");
const toolsRepo = "ghcr.io/alsruddns/woori-tools";
const image = (n) => `sha256:${String(n).repeat(64)}`;
const current = image(1);
const previous = image(2);
const old = image(3);
const containerImage = image(4);
const shared = image(5);
const expectedDigest = `sha256:${"a".repeat(64)}`;
const bashCommand = process.env.BASH ?? (process.platform === "win32" ? "C:\\Program Files\\Git\\bin\\bash.exe" : "bash");
const bashAvailable = spawnSync(bashCommand, ["--version"], { encoding: "utf8" }).status === 0;
const bashCleanupPath = process.platform === "win32"
  ? spawnSync(path.join(path.dirname(bashCommand), "..", "usr", "bin", "cygpath.exe"), ["-u", cleanupScript], { encoding: "utf8" }).stdout.trim()
  : cleanupScript;

function row(id, repository = toolsRepo, tag = "latest") {
  return { id, repository, tag };
}

async function runCleanup({ rows = [], containers = {}, failRemove = [], running = current, previousImage = previous, digest = expectedDigest, dryRun = false } = {}) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "tools-image-cleanup-"));
  const fixturePath = path.join(directory, "fixture.json");
  const callsPath = path.join(directory, "calls.json");
  const removedPath = path.join(directory, "removed.json");
  const dockerPath = path.join(directory, "docker");
  await writeFile(fixturePath, JSON.stringify({ rows, containers, failRemove, running, digest, callsPath, removedPath }));
  await writeFile(dockerPath, `#!/usr/bin/env node
import fs from "node:fs";
const data = JSON.parse(fs.readFileSync(process.env.DOCKER_FIXTURE, "utf8"));
const args = process.argv.slice(2);
const calls = fs.existsSync(data.callsPath) ? JSON.parse(fs.readFileSync(data.callsPath, "utf8")) : [];
calls.push(args);
fs.writeFileSync(data.callsPath, JSON.stringify(calls));
const key = args.join(" ");
if (args[0] === "inspect" && args[1] === "tools") console.log(data.running);
else if (args[0] === "inspect") console.log(data.containers[args[1]]);
else if (args[0] === "image" && args[1] === "inspect") console.log(JSON.stringify(["${toolsRepo}@" + data.digest]));
else if (args[0] === "image" && args[1] === "ls") for (const row of data.rows) console.log([row.id,row.repository,row.tag ?? "latest","<none>"].join("\\t"));
else if (args[0] === "ps") console.log(Object.keys(data.containers).join("\\n"));
else if (args[0] === "system" && args[1] === "df") console.log("TYPE TOTAL ACTIVE SIZE RECLAIMABLE\\nImages 3 2 1GB 500MB");
else if (args[0] === "info") console.log(process.cwd());
else if (args[0] === "image" && args[1] === "rm") {
  if (data.failRemove.includes(args[2])) { console.error("mock image removal conflict"); process.exit(1); }
  const removed = fs.existsSync(data.removedPath) ? JSON.parse(fs.readFileSync(data.removedPath, "utf8")) : [];
  removed.push(args[2]); fs.writeFileSync(data.removedPath, JSON.stringify(removed)); console.log("Deleted: " + args[2]);
} else { console.error("Unexpected Docker call: " + key); process.exit(2); }
`);
  await chmod(dockerPath, 0o755);
  const result = spawnSync(bashCommand, [bashCleanupPath, current, previousImage, expectedDigest], {
    cwd: directory,
    encoding: "utf8",
    env: { ...process.env, PATH: `${directory}${path.delimiter}${process.env.PATH}`, DOCKER_FIXTURE: fixturePath, DRY_RUN: dryRun ? "1" : "0" },
  });
  const calls = await readFile(callsPath, "utf8").then(JSON.parse).catch(() => []);
  const removed = await readFile(removedPath, "utf8").then(JSON.parse).catch(() => []);
  await rm(directory, { recursive: true, force: true });
  return { ...result, calls, removed };
}

test("first deployment with no previous image only keeps the current image", { skip: !bashAvailable }, async () => {
  const result = await runCleanup({ rows: [row(current)], previousImage: "" });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.removed, []);
});

test("multiple old Tools images are removed while current and previous normal images remain", { skip: !bashAvailable }, async () => {
  const result = await runCleanup({ rows: [row(current), row(previous), row(old), row(image(6))] });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(new Set(result.removed), new Set([old, image(6)]));
});

test("duplicate Tools tags for the same image ID yield one removal", { skip: !bashAvailable }, async () => {
  const result = await runCleanup({ rows: [row(current), row(previous), row(old, toolsRepo, "sha-a"), row(old, toolsRepo, "sha-b")] });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.removed, [old]);
});

test("images used by running or stopped containers are excluded", { skip: !bashAvailable }, async () => {
  const result = await runCleanup({ rows: [row(current), row(previous), row(containerImage)], containers: { stopped_container: containerImage } });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.removed, []);
  assert.match(result.stdout, /referenced by container stopped_container/u);
});

test("IDs also referenced by another service repository are excluded", { skip: !bashAvailable }, async () => {
  const result = await runCleanup({ rows: [row(current), row(previous), row(shared), row(shared, "ghcr.io/alsruddns/woori-portal", "stable")] });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.removed, []);
  assert.match(result.stdout, /non-Tools repository ghcr.io\/alsruddns\/woori-portal/u);
});

test("dry run logs candidates but does not call Docker image removal", { skip: !bashAvailable }, async () => {
  const result = await runCleanup({ rows: [row(current), row(previous), row(old)], dryRun: true });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.removed, []);
  assert.match(result.stdout, new RegExp(`DRY RUN: would remove Tools-only image ${old}`, "u"));
  assert.equal(result.calls.some((args) => args[0] === "image" && args[1] === "rm"), false);
});

test("removal failures are logged and returned as cleanup errors", { skip: !bashAvailable }, async () => {
  const result = await runCleanup({ rows: [row(current), row(previous), row(old)], failRemove: [old] });
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /Failed to remove Tools image/u);
  assert.match(result.stderr, /deployment remains healthy/u);
});

test("cleanup aborts if the Tools container ID changed after health validation", { skip: !bashAvailable }, async () => {
  const result = await runCleanup({ rows: [row(current), row(previous), row(old)], running: image(7) });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /image changed before cleanup/u);
  assert.deepEqual(result.removed, []);
});

test("cleanup aborts when the running image digest does not match the built release", { skip: !bashAvailable }, async () => {
  const result = await runCleanup({ rows: [row(current), row(previous), row(old)], digest: `sha256:${"b".repeat(64)}` });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not carry expected digest/u);
  assert.deepEqual(result.removed, []);
});

test("cleanup aborts if it cannot verify the previous rollback image", { skip: !bashAvailable }, async () => {
  const result = await runCleanup({ rows: [row(current), row(old)] });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Previous rollback image.*refusing cleanup/u);
  assert.deepEqual(result.removed, []);
});

test("deployment workflow uses image digest and only reaches cleanup after health and SEO", async () => {
  const workflow = await readFile(workflowPath, "utf8");
  const health = workflow.indexOf("- name: Check production health and SEO");
  const cleanup = workflow.indexOf("- name: Clean up old Tools-only Docker images");
  const rollback = workflow.indexOf("- name: Roll back Tools if deployment health check fails");
  assert.ok(health >= 0 && cleanup > health && rollback > cleanup);
  assert.match(workflow, /image="\$\{repository\}@\$\{image_digest\}"/u);
  assert.match(workflow.slice(cleanup, rollback), /scripts\/cleanup-tools-images\.sh/u);
  assert.match(workflow.slice(cleanup, rollback), /EXPECTED_IMAGE_DIGEST/u);
  assert.match(workflow, /docker inspect tools --format/u);
});
