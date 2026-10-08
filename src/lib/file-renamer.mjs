export function renameFileNames(names, { prefix = "", suffix = "", find = "", replace = "", startNumber = "", padding = "0" } = {}) {
  const first = Number.parseInt(startNumber, 10);
  const pad = Math.max(0, Math.min(12, Number.parseInt(padding, 10) || 0));
  const seen = new Set();
  return names.map((name, index) => {
    const dot = name.lastIndexOf(".");
    const stem = dot > 0 ? name.slice(0, dot) : name;
    const extension = dot > 0 ? name.slice(dot) : "";
    const replaced = find ? stem.replaceAll(find, replace) : stem;
    const number = Number.isFinite(first) ? String(first + index).padStart(pad, "0") : "";
    let next = `${prefix}${replaced}${suffix}${number ? `${number}` : ""}${extension}`
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
      .replace(/^[. ]+|[. ]+$/g, "") || `file-${index + 1}${extension}`;
    const dotIndex = next.lastIndexOf(".");
    const base = dotIndex > 0 ? next.slice(0, dotIndex) : next;
    const ext = dotIndex > 0 ? next.slice(dotIndex) : "";
    let unique = next, suffixIndex = 2;
    while (seen.has(unique.toLocaleLowerCase())) unique = `${base} (${suffixIndex++})${ext}`;
    seen.add(unique.toLocaleLowerCase());
    next = unique;
    return next;
  });
}

export function parseRenameOptions(text) {
  const [prefix = "", suffix = "", find = "", replace = "", startNumber = "", padding = "0"] = text.split("\n");
  return { prefix, suffix, find, replace, startNumber, padding };
}
