import { describe, it, expect, vi } from "vitest";
import { createVFSLinterHost } from "./createVFSLinterHost.js";

describe(createVFSLinterHost, () => {
	it("normalizes cwd", () => {
		const host = createVFSLinterHost("/root/../root2/", true);

		expect(host.getCurrentDirectory()).toEqual("/root2");
		expect(host.isCaseSensitiveFS()).toEqual(true);
	});

	it("normalizes cwd case-insensitively", () => {
		const host = createVFSLinterHost("C:\\HELLO\\world\\", false);

		expect(host.getCurrentDirectory()).toEqual("c:/hello/world");
		expect(host.isCaseSensitiveFS()).toEqual(false);
	});

	it("inherits cwd and case sensitivity from base host", () => {
		const baseHost = createVFSLinterHost("/root", true);
		const host = createVFSLinterHost(baseHost);

		expect(host.getCurrentDirectory()).toEqual("/root");
		expect(host.isCaseSensitiveFS()).toEqual(true);
	});

	it("stats files and directories from the vfs", () => {
		const host = createVFSLinterHost("/root", true);

		host.vfsUpsertFile("/root/file.ts", "content");
		host.vfsUpsertFile("/root/nested/file.ts", "content");

		expect(host.stat("/root/file.ts")).toEqual("file");
		expect(host.stat("/root/nested")).toEqual("directory");
		expect(host.stat("/root/missing")).toEqual(undefined);
	});

	it("returns undefined when reading a missing file", () => {
		const host = createVFSLinterHost("/root", true);

		expect(host.readFile("/root/missing.txt")).toEqual(undefined);
	});

	it("falls back to the base host for stat and readFile", () => {
		const baseHost = createVFSLinterHost("/root", true);
		baseHost.vfsUpsertFile("/root/base.txt", "base");

		const host = createVFSLinterHost(baseHost);

		expect(host.stat("/root/base.txt")).toEqual("file");
		expect(host.readFile("/root/base.txt")).toEqual("base");
	});

	it("prefers vfs contents over the base host for readFile", () => {
		const baseHost = createVFSLinterHost("/root", true);
		baseHost.vfsUpsertFile("/root/file.txt", "base");

		const host = createVFSLinterHost(baseHost);
		host.vfsUpsertFile("/root/file.txt", "vfs");

		expect(host.readFile("/root/file.txt")).toEqual("vfs");
	});

	it("skips non-matching files when reading a directory", () => {
		const host = createVFSLinterHost("/root", true);
		host.vfsUpsertFile("/root/other/file.txt", "content");

		expect(host.readDirectory("/root/dir")).toEqual([]);
	});

	it("reads directories from vfs and base host without duplicates", () => {
		const baseHost = createVFSLinterHost("/root", true);
		baseHost.vfsUpsertFile("/root/dir/base.txt", "base");
		baseHost.vfsUpsertFile("/root/dir/shared.txt", "base");

		const host = createVFSLinterHost(baseHost);
		host.vfsUpsertFile("/root/dir/file.txt", "vfs");
		host.vfsUpsertFile("/root/dir/shared.txt", "vfs");
		host.vfsUpsertFile("/root/dir/sub/child.txt", "vfs");

		const entries = host.readDirectory("/root/dir");
		const asMap = new Map(entries.map((entry) => [entry.name, entry.type]));

		expect(asMap.get("file.txt")).toEqual("file");
		expect(asMap.get("shared.txt")).toEqual("file");
		expect(asMap.get("base.txt")).toEqual("file");
		expect(asMap.get("sub")).toEqual("directory");
		expect(asMap.size).toEqual(4);
	});

	it("does not notify directory watchers for paths without a slash", () => {
		const host = createVFSLinterHost("/root", true);
		const fileWatcher = vi.fn();
		const dirWatcher = vi.fn();

		host.watchFile("file.ts", fileWatcher);
		host.watchDirectory("file.ts", false, dirWatcher);
		host.vfsUpsertFile("file.ts", "content");

		expect(fileWatcher).toHaveBeenCalledWith("created");
		expect(dirWatcher).not.toHaveBeenCalled();
	});

	it("sends file watcher events for create, change, and delete", () => {
		const host = createVFSLinterHost("/root", true);
		const watcher = vi.fn();

		host.watchFile("/root/file.ts", watcher);
		host.vfsUpsertFile("/root/file.ts", "content");
		host.vfsUpsertFile("/root/file.ts", "next");
		host.vfsDeleteFile("/root/file.ts");

		expect(watcher).toHaveBeenNthCalledWith(1, "created");
		expect(watcher).toHaveBeenNthCalledWith(2, "changed");
		expect(watcher).toHaveBeenNthCalledWith(3, "deleted");
	});

	it("does not notify file watchers when deleting a missing file", () => {
		const host = createVFSLinterHost("/root", true);
		const watcher = vi.fn();

		host.watchFile("/root/missing.ts", watcher);
		host.vfsDeleteFile("/root/missing.ts");

		expect(watcher).not.toHaveBeenCalled();
	});

	it("notifies non-recursive directory watchers for direct children", () => {
		const host = createVFSLinterHost("/root", true);
		const watcher = vi.fn();

		host.watchDirectory("/root/dir", false, watcher);
		host.vfsUpsertFile("/root/dir/file.ts", "content");
		host.vfsUpsertFile("/root/dir/sub/file.ts", "content");

		expect(watcher).toHaveBeenCalledTimes(1);
		expect(watcher).toHaveBeenCalledWith("/root/dir/file.ts");
	});

	it("notifies recursive directory watchers for nested children", () => {
		const host = createVFSLinterHost("/root", true);
		const watcher = vi.fn();

		host.watchDirectory("/root", true, watcher);
		host.vfsUpsertFile("/root/dir/sub/file.ts", "content");

		expect(watcher).toHaveBeenCalledTimes(1);
		expect(watcher).toHaveBeenCalledWith("/root/dir/sub/file.ts");
	});

	it("disposes directory watchers and stops base forwarding", () => {
		const baseHost = createVFSLinterHost("/root", true);
		const host = createVFSLinterHost(baseHost);
		const watcher = vi.fn();

		const disposable = host.watchDirectory("/root", true, watcher);
		disposable[Symbol.dispose]();

		baseHost.vfsUpsertFile("/root/file.ts", "content");

		expect(watcher).not.toHaveBeenCalled();
	});

	it("disposes watchers and stops notifications", () => {
		const host = createVFSLinterHost("/root", true);
		const watcher = vi.fn();

		const disposable = host.watchFile("/root/file.ts", watcher);
		disposable[Symbol.dispose]();

		host.vfsUpsertFile("/root/file.ts", "content");

		expect(watcher).not.toHaveBeenCalled();
	});

	it("proxies watchers to the base host", () => {
		const baseHost = createVFSLinterHost("/root", true);
		const host = createVFSLinterHost(baseHost);
		const watcher = vi.fn();

		host.watchFile("/root/file.ts", watcher);
		baseHost.vfsUpsertFile("/root/file.ts", "content");

		expect(watcher).toHaveBeenCalledWith("created");
	});

	it("lists vfs files", () => {
		const host = createVFSLinterHost("/root", true);

		host.vfsUpsertFile("/root/file.ts", "content");

		expect([...host.vfsListFiles().entries()]).toEqual([
			["/root/file.ts", "content"],
		]);
	});
});
