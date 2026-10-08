import assert from "node:assert/strict";
import test from "node:test";
import { parseRenameOptions, renameFileNames } from "../src/lib/file-renamer.mjs";

test("renames a preview list with replacement, numbering, padding, and unique names", () => {
  const options = parseRenameOptions("IMG_\n_\nphoto\nimage\n1\n3");
  assert.deepEqual(renameFileNames(["photo.jpg", "photo.png", "cover.png"], options), ["IMG_image_001.jpg", "IMG_image_002.png", "IMG_cover_003.png"]);
});

test("keeps extensions and avoids unsafe and colliding output names", () => {
  assert.deepEqual(renameFileNames(["a?.txt", "a?.txt"], { prefix: "copy/" }), ["copy_a_.txt", "copy_a_ (2).txt"]);
});
