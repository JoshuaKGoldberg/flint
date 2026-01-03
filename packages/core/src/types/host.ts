export interface LinterHostDirectoryEntry {
	type: "file" | "directory";
	name: string;
}

export type LinterHostFileWatcherEvent = "created" | "changed" | "deleted";
export type LinterHostFileWatcher = (event: LinterHostFileWatcherEvent) => void;

export type LinterHostDirectoryWatcher = (filePathAbsolute: string) => void;

export interface LinterHost {
	getCurrentDirectory(): string;
	stat(pathAbsolute: string): "file" | "directory" | undefined;
	readFile(filePathAbsolute: string): string | undefined;
	readDirectory(directoryPathAbsolute: string): LinterHostDirectoryEntry[];
	watchFile(
		filePathAbsolute: string,
		callback: LinterHostFileWatcher,
	): Disposable;
	watchDirectory(
		directoryPathAbsolute: string,
		recursive: boolean,
		callback: LinterHostDirectoryWatcher,
	): Disposable;
}

export interface VFSLinterHost extends LinterHost {
	vfsUpsertFile(filePathAbsolute: string, content: string): void;
	vfsDeleteFile(filePathAbsolute: string): void;
	vfsListFiles(): ReadonlyMap<string, string>;
}
