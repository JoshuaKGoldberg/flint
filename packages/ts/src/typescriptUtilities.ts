interface FileSystemEntries {
	readonly files: readonly string[];
	readonly directories: readonly string[];
}

const directorySeparator = "/";
const altDirectorySeparator = "\\";
const urlSchemeSeparator = "://";
const backslashRegExp = /\\/g;

function getFileUrlVolumeSeparatorEnd(url: string, start: number) {
	const ch0 = url.charCodeAt(start);
	if (ch0 === CharacterCodes.colon) {
		return start + 1;
	}
	if (
		ch0 === CharacterCodes.percent &&
		url.charCodeAt(start + 1) === CharacterCodes._3
	) {
		const ch2 = url.charCodeAt(start + 2);
		if (ch2 === CharacterCodes.a || ch2 === CharacterCodes.A) {
			return start + 3;
		}
	}
	return -1;
}

function normalizeSlashes(path: string): string {
	return path.includes("\\")
		? path.replace(backslashRegExp, directorySeparator)
		: path;
}

function getRootLength(path: string): number {
	const rootLength = getEncodedRootLength(path);
	return rootLength < 0 ? ~rootLength : rootLength;
}

const enum CharacterCodes {
	EOF = -1,
	nullCharacter = 0,
	maxAsciiCharacter = 0x7f,

	lineFeed = 0x0a, // \n
	carriageReturn = 0x0d, // \r
	lineSeparator = 0x2028,
	paragraphSeparator = 0x2029,
	nextLine = 0x0085,

	// Unicode 3.0 space characters
	space = 0x0020, // " "
	nonBreakingSpace = 0x00a0, //
	enQuad = 0x2000,
	emQuad = 0x2001,
	enSpace = 0x2002,
	emSpace = 0x2003,
	threePerEmSpace = 0x2004,
	fourPerEmSpace = 0x2005,
	sixPerEmSpace = 0x2006,
	figureSpace = 0x2007,
	punctuationSpace = 0x2008,
	thinSpace = 0x2009,
	hairSpace = 0x200a,
	zeroWidthSpace = 0x200b,
	narrowNoBreakSpace = 0x202f,
	ideographicSpace = 0x3000,
	mathematicalSpace = 0x205f,
	ogham = 0x1680,

	// Unicode replacement character produced when a byte sequence is invalid
	replacementCharacter = 0xfffd,

	_ = 0x5f,
	$ = 0x24,

	_0 = 0x30,
	_1 = 0x31,
	_2 = 0x32,
	_3 = 0x33,
	_4 = 0x34,
	_5 = 0x35,
	_6 = 0x36,
	_7 = 0x37,
	_8 = 0x38,
	_9 = 0x39,

	a = 0x61,
	b = 0x62,
	c = 0x63,
	d = 0x64,
	e = 0x65,
	f = 0x66,
	g = 0x67,
	h = 0x68,
	i = 0x69,
	j = 0x6a,
	k = 0x6b,
	l = 0x6c,
	m = 0x6d,
	n = 0x6e,
	o = 0x6f,
	p = 0x70,
	q = 0x71,
	r = 0x72,
	s = 0x73,
	t = 0x74,
	u = 0x75,
	v = 0x76,
	w = 0x77,
	x = 0x78,
	y = 0x79,
	z = 0x7a,

	A = 0x41,
	B = 0x42,
	C = 0x43,
	D = 0x44,
	E = 0x45,
	F = 0x46,
	G = 0x47,
	H = 0x48,
	I = 0x49,
	J = 0x4a,
	K = 0x4b,
	L = 0x4c,
	M = 0x4d,
	N = 0x4e,
	O = 0x4f,
	P = 0x50,
	Q = 0x51,
	R = 0x52,
	S = 0x53,
	T = 0x54,
	U = 0x55,
	V = 0x56,
	W = 0x57,
	X = 0x58,
	Y = 0x59,
	Z = 0x5a,

	ampersand = 0x26, // &
	asterisk = 0x2a, // *
	at = 0x40, // @
	backslash = 0x5c, // \
	backtick = 0x60, // `
	bar = 0x7c, // |
	caret = 0x5e, // ^
	closeBrace = 0x7d, // }
	closeBracket = 0x5d, // ]
	closeParen = 0x29, // )
	colon = 0x3a, // :
	comma = 0x2c, // ,
	dot = 0x2e, // .
	doubleQuote = 0x22, // "
	equals = 0x3d, // =
	exclamation = 0x21, // !
	greaterThan = 0x3e, // >
	hash = 0x23, // #
	lessThan = 0x3c, // <
	minus = 0x2d, // -
	openBrace = 0x7b, // {
	openBracket = 0x5b, // [
	openParen = 0x28, // (
	percent = 0x25, // %
	plus = 0x2b, // +
	question = 0x3f, // ?
	semicolon = 0x3b, // ;
	singleQuote = 0x27, // '
	slash = 0x2f, // /
	tilde = 0x7e, // ~

	backspace = 0x08, // \b
	formFeed = 0x0c, // \f
	byteOrderMark = 0xfeff,
	tab = 0x09, // \t
	verticalTab = 0x0b, // \v
}

function isVolumeCharacter(charCode: number) {
	return (
		(charCode >= CharacterCodes.a && charCode <= CharacterCodes.z) ||
		(charCode >= CharacterCodes.A && charCode <= CharacterCodes.Z)
	);
}

function getEncodedRootLength(path: string): number {
	if (!path) {
		return 0;
	}
	const ch0 = path.charCodeAt(0);

	// POSIX or UNC
	if (ch0 === CharacterCodes.slash || ch0 === CharacterCodes.backslash) {
		if (path.charCodeAt(1) !== ch0) {
			return 1;
		} // POSIX: "/" (or non-normalized "\")

		const p1 = path.indexOf(
			ch0 === CharacterCodes.slash ? directorySeparator : altDirectorySeparator,
			2,
		);
		if (p1 < 0) {
			return path.length;
		} // UNC: "//server" or "\\server"

		return p1 + 1; // UNC: "//server/" or "\\server\"
	}

	// DOS
	if (isVolumeCharacter(ch0) && path.charCodeAt(1) === CharacterCodes.colon) {
		const ch2 = path.charCodeAt(2);
		if (ch2 === CharacterCodes.slash || ch2 === CharacterCodes.backslash) {
			return 3;
		} // DOS: "c:/" or "c:\"
		if (path.length === 2) {
			return 2;
		} // DOS: "c:" (but not "c:d")
	}

	// URL
	const schemeEnd = path.indexOf(urlSchemeSeparator);
	if (schemeEnd !== -1) {
		const authorityStart = schemeEnd + urlSchemeSeparator.length;
		const authorityEnd = path.indexOf(directorySeparator, authorityStart);
		if (authorityEnd !== -1) {
			// URL: "file:///", "file://server/", "file://server/path"
			// For local "file" URLs, include the leading DOS volume (if present).
			// Per https://www.ietf.org/rfc/rfc1738.txt, a host of "" or "localhost" is a
			// special case interpreted as "the machine from which the URL is being interpreted".
			const scheme = path.slice(0, schemeEnd);
			const authority = path.slice(authorityStart, authorityEnd);
			if (
				scheme === "file" &&
				(authority === "" || authority === "localhost") &&
				isVolumeCharacter(path.charCodeAt(authorityEnd + 1))
			) {
				const volumeSeparatorEnd = getFileUrlVolumeSeparatorEnd(
					path,
					authorityEnd + 2,
				);
				if (volumeSeparatorEnd !== -1) {
					if (path.charCodeAt(volumeSeparatorEnd) === CharacterCodes.slash) {
						// URL: "file:///c:/", "file://localhost/c:/", "file:///c%3a/", "file://localhost/c%3a/"
						return ~(volumeSeparatorEnd + 1);
					}
					if (volumeSeparatorEnd === path.length) {
						// URL: "file:///c:", "file://localhost/c:", "file:///c$3a", "file://localhost/c%3a"
						// but not "file:///c:d" or "file:///c%3ad"
						return ~volumeSeparatorEnd;
					}
				}
			}
			return ~(authorityEnd + 1); // URL: "file://server/", "http://server/"
		}
		return ~path.length; // URL: "file://server", "http://server"
	}

	// relative
	return 0;
}

function isAnyDirectorySeparator(charCode: number): boolean {
	return (
		charCode === CharacterCodes.slash || charCode === CharacterCodes.backslash
	);
}

function hasTrailingDirectorySeparator(path: string): boolean {
	return (
		path.length > 0 && isAnyDirectorySeparator(path.charCodeAt(path.length - 1))
	);
}

type Path = string & { __pathBrand: any };

function ensureTrailingDirectorySeparator(path: Path): Path;
function ensureTrailingDirectorySeparator(path: string): string;
function ensureTrailingDirectorySeparator(path: string) {
	if (!hasTrailingDirectorySeparator(path)) {
		return path + directorySeparator;
	}

	return path;
}

function combinePaths(path: string, ...paths: (string | undefined)[]): string {
	if (path) {
		path = normalizeSlashes(path);
	}
	for (let relativePath of paths) {
		if (!relativePath) {
			continue;
		}
		relativePath = normalizeSlashes(relativePath);
		if (!path || getRootLength(relativePath) !== 0) {
			path = relativePath;
		} else {
			path = ensureTrailingDirectorySeparator(path) + relativePath;
		}
	}
	return path;
}

function getNormalizedAbsolutePath(
	path: string,
	currentDirectory: string | undefined,
): string {
	let rootLength = getRootLength(path);
	if (rootLength === 0 && currentDirectory) {
		path = combinePaths(currentDirectory, path);
		rootLength = getRootLength(path);
	} else {
		// combinePaths normalizes slashes, so not necessary in the other branch
		path = normalizeSlashes(path);
	}

	const simpleNormalized = simpleNormalizePath(path);
	if (simpleNormalized !== undefined) {
		return simpleNormalized.length > rootLength
			? removeTrailingDirectorySeparator(simpleNormalized)
			: simpleNormalized;
	}

	const length = path.length;
	const root = path.substring(0, rootLength);
	// `normalized` is only initialized once `path` is determined to be non-normalized
	let normalized;
	let index = rootLength;
	let segmentStart = index;
	let normalizedUpTo = index;
	let seenNonDotDotSegment = rootLength !== 0;
	while (index < length) {
		// At beginning of segment
		segmentStart = index;
		let ch = path.charCodeAt(index);
		while (ch === CharacterCodes.slash && index + 1 < length) {
			index++;
			ch = path.charCodeAt(index);
		}
		if (index > segmentStart) {
			// Seen superfluous separator
			normalized ??= path.substring(0, segmentStart - 1);
			segmentStart = index;
		}
		// Past any superfluous separators
		let segmentEnd = path.indexOf(directorySeparator, index + 1);
		if (segmentEnd === -1) {
			segmentEnd = length;
		}
		const segmentLength = segmentEnd - segmentStart;
		if (segmentLength === 1 && path.charCodeAt(index) === CharacterCodes.dot) {
			// "." segment (skip)
			normalized ??= path.substring(0, normalizedUpTo);
		} else if (
			segmentLength === 2 &&
			path.charCodeAt(index) === CharacterCodes.dot &&
			path.charCodeAt(index + 1) === CharacterCodes.dot
		) {
			// ".." segment
			if (!seenNonDotDotSegment) {
				if (normalized !== undefined) {
					normalized += normalized.length === rootLength ? ".." : "/..";
				} else {
					normalizedUpTo = index + 2;
				}
			} else if (normalized === undefined) {
				if (normalizedUpTo - 2 >= 0) {
					normalized = path.substring(
						0,
						Math.max(
							rootLength,
							path.lastIndexOf(directorySeparator, normalizedUpTo - 2),
						),
					);
				} else {
					normalized = path.substring(0, normalizedUpTo);
				}
			} else {
				const lastSlash = normalized.lastIndexOf(directorySeparator);
				if (lastSlash !== -1) {
					normalized = normalized.substring(0, Math.max(rootLength, lastSlash));
				} else {
					normalized = root;
				}
				if (normalized.length === rootLength) {
					seenNonDotDotSegment = rootLength !== 0;
				}
			}
		} else if (normalized !== undefined) {
			if (normalized.length !== rootLength) {
				normalized += directorySeparator;
			}
			seenNonDotDotSegment = true;
			normalized += path.substring(segmentStart, segmentEnd);
		} else {
			seenNonDotDotSegment = true;
			normalizedUpTo = segmentEnd;
		}
		index = segmentEnd + 1;
	}
	return (
		normalized ??
		(length > rootLength ? removeTrailingDirectorySeparator(path) : path)
	);
}

function removeTrailingDirectorySeparator(path: Path): Path;
function removeTrailingDirectorySeparator(path: string): string;
function removeTrailingDirectorySeparator(path: string) {
	if (hasTrailingDirectorySeparator(path)) {
		return path.substr(0, path.length - 1);
	}

	return path;
}

function normalizePath(path: string): string {
	path = normalizeSlashes(path);
	let normalized = simpleNormalizePath(path);
	if (normalized !== undefined) {
		return normalized;
	}
	normalized = getNormalizedAbsolutePath(path, "");
	return normalized && hasTrailingDirectorySeparator(path)
		? ensureTrailingDirectorySeparator(normalized)
		: normalized;
}

const relativePathSegmentRegExp = /\/\/|(?:^|\/)\.\.?(?:$|\/)/;

function simpleNormalizePath(path: string): string | undefined {
	// Most paths don't require normalization
	if (!relativePathSegmentRegExp.test(path)) {
		return path;
	}
	// Some paths only require cleanup of `/./` or leading `./`
	let simplified = path.replace(/\/\.\//g, "/");
	if (simplified.startsWith("./")) {
		simplified = simplified.slice(2);
	}
	if (simplified !== path) {
		path = simplified;
		if (!relativePathSegmentRegExp.test(path)) {
			return path;
		}
	}
	return undefined;
}

interface FileMatcherPatterns {
	/** One pattern for each "include" spec. */
	includeFilePatterns: readonly string[] | undefined;
	/** One pattern matching one of any of the "include" specs. */
	includeFilePattern: string | undefined;
	includeDirectoryPattern: string | undefined;
	excludePattern: string | undefined;
	basePaths: readonly string[];
}

function map<T, U>(array: readonly T[], f: (x: T, i: number) => U): U[];
function map<T, U>(
	array: readonly T[] | undefined,
	f: (x: T, i: number) => U,
): U[] | undefined;
function map<T, U>(
	array: readonly T[] | undefined,
	f: (x: T, i: number) => U,
): U[] | undefined {
	let result: U[] | undefined;
	if (array !== undefined) {
		result = [];
		for (let i = 0; i < array.length; i++) {
			result.push(f(array[i], i));
		}
	}
	return result;
}

function getRegularExpressionsForWildcards(
	specs: readonly string[] | undefined,
	basePath: string,
	usage: "files" | "directories" | "exclude",
): readonly string[] | undefined {
	if (specs === undefined || specs.length === 0) {
		return undefined;
	}

	return flatMap(
		specs,
		(spec) =>
			spec &&
			getSubPatternFromSpec(spec, basePath, usage, wildcardMatchers[usage]),
	);
}

interface WildcardMatcher {
	singleAsteriskRegexFragment: string;
	doubleAsteriskRegexFragment: string;
	replaceWildcardCharacter: (match: string) => string;
}

const commonPackageFolders: readonly string[] = [
	"node_modules",
	"bower_components",
	"jspm_packages",
];

const implicitExcludePathRegexPattern = `(?!(?:${commonPackageFolders.join("|")})(?:/|$))`;

function replaceWildcardCharacter(
	match: string,
	singleAsteriskRegexFragment: string,
) {
	return match === "*"
		? singleAsteriskRegexFragment
		: match === "?"
			? "[^/]"
			: "\\" + match;
}

const filesMatcher: WildcardMatcher = {
	/**
	 * Matches any single directory segment unless it is the last segment and a .min.js file
	 * Breakdown:
	 *  [^./]                   # matches everything up to the first . character (excluding directory separators)
	 *  (\\.(?!min\\.js$))?     # matches . characters but not if they are part of the .min.js file extension
	 */
	singleAsteriskRegexFragment: "(?:[^./]|(?:\\.(?!min\\.js$))?)*",
	/**
	 * Regex for the ** wildcard. Matches any number of subdirectories. When used for including
	 * files or directories, does not match subdirectories that start with a . character
	 */
	doubleAsteriskRegexFragment: `(?:/${implicitExcludePathRegexPattern}[^/.][^/]*)*?`,
	replaceWildcardCharacter: (match) =>
		replaceWildcardCharacter(match, filesMatcher.singleAsteriskRegexFragment),
};

const directoriesMatcher: WildcardMatcher = {
	singleAsteriskRegexFragment: "[^/]*",
	/**
	 * Regex for the ** wildcard. Matches any number of subdirectories. When used for including
	 * files or directories, does not match subdirectories that start with a . character
	 */
	doubleAsteriskRegexFragment: `(?:/${implicitExcludePathRegexPattern}[^/.][^/]*)*?`,
	replaceWildcardCharacter: (match) =>
		replaceWildcardCharacter(
			match,
			directoriesMatcher.singleAsteriskRegexFragment,
		),
};

const excludeMatcher: WildcardMatcher = {
	singleAsteriskRegexFragment: "[^/]*",
	doubleAsteriskRegexFragment: "(?:/.+?)?",
	replaceWildcardCharacter: (match) =>
		replaceWildcardCharacter(match, excludeMatcher.singleAsteriskRegexFragment),
};

const wildcardMatchers = {
	files: filesMatcher,
	directories: directoriesMatcher,
	exclude: excludeMatcher,
};

function append<T extends {}>(to: T[], value: T | undefined): T[];
function append<T extends {}>(to: T[] | undefined, value: T): T[];
function append<T extends {}>(
	to: T[] | undefined,
	value: T | undefined,
): T[] | undefined;
function append<T extends {}>(
	to: T[] | undefined,
	value: T | undefined,
): T[] | undefined {
	if (value === undefined) {
		return to;
	}
	if (to === undefined) {
		return [value];
	}
	to.push(value);
	return to;
}

function flatMap<T, U extends {}>(
	array: readonly T[] | undefined,
	mapfn: (x: T, i: number) => U | readonly U[] | undefined,
): readonly U[] {
	let result: U[] | undefined;
	if (array !== undefined) {
		for (let i = 0; i < array.length; i++) {
			const v = mapfn(array[i], i);
			if (v) {
				if (isArray(v)) {
					result = addRange(result, v);
				} else {
					result = append(result, v);
				}
			}
		}
	}
	return result ?? emptyArray;
}

type PathPathComponents = Path[] & { __pathComponensBrand: any };

function getPathComponents(path: Path): PathPathComponents;
function getPathComponents(path: string, currentDirectory?: string): string[];
function getPathComponents(path: string, currentDirectory = "") {
	path = combinePaths(currentDirectory, path);
	return pathComponents(path, getRootLength(path));
}

function lastOrUndefined<T>(array: readonly T[] | undefined): T | undefined {
	return array === undefined || array.length === 0
		? undefined
		: array[array.length - 1];
}

function pathComponents(path: string, rootLength: number) {
	const root = path.substring(0, rootLength);
	const rest = path.substring(rootLength).split(directorySeparator);
	if (rest.length && !lastOrUndefined(rest)) {
		rest.pop();
	}
	return [root, ...rest];
}

function getNormalizedPathComponents(
	path: string,
	currentDirectory: string | undefined,
): string[] {
	return reducePathComponents(getPathComponents(path, currentDirectory));
}

function some<T>(array: readonly T[] | undefined): array is readonly T[];
function some<T>(
	array: readonly T[] | undefined,
	predicate: (value: T) => boolean,
): boolean;
function some<T>(
	array: readonly T[] | undefined,
	predicate?: (value: T) => boolean,
): boolean {
	if (array !== undefined) {
		if (predicate !== undefined) {
			for (let i = 0; i < array.length; i++) {
				if (predicate(array[i])) {
					return true;
				}
			}
		} else {
			return array.length > 0;
		}
	}
	return false;
}

function reducePathComponents(components: readonly string[]): string[] {
	if (!some(components)) {
		return [];
	}
	const reduced = [components[0]];
	for (let i = 1; i < components.length; i++) {
		const component = components[i];
		if (!component) {
			continue;
		}
		if (component === ".") {
			continue;
		}
		if (component === "..") {
			if (reduced.length > 1) {
				if (reduced[reduced.length - 1] !== "..") {
					reduced.pop();
					continue;
				}
			} else if (reduced[0]) {
				continue;
			}
		}
		reduced.push(component);
	}
	return reduced;
}

function last<T>(array: readonly T[]): T {
	return array[array.length - 1];
}

function isImplicitGlob(lastPathComponent: string): boolean {
	return !/[.*?]/.test(lastPathComponent);
}

const reservedCharacterPattern = /[^\w\s/]/g;

function getSubPatternFromSpec(
	spec: string,
	basePath: string,
	usage: "files" | "directories" | "exclude",
	{
		singleAsteriskRegexFragment,
		doubleAsteriskRegexFragment,
		replaceWildcardCharacter,
	}: WildcardMatcher = wildcardMatchers[usage],
): string | undefined {
	let subpattern = "";
	let hasWrittenComponent = false;
	const components = getNormalizedPathComponents(spec, basePath);
	const lastComponent = last(components);
	if (usage !== "exclude" && lastComponent === "**") {
		return undefined;
	}

	// getNormalizedPathComponents includes the separator for the root component.
	// We need to remove to create our regex correctly.
	components[0] = removeTrailingDirectorySeparator(components[0]);

	if (isImplicitGlob(lastComponent)) {
		components.push("**", "*");
	}

	let optionalCount = 0;
	for (let component of components) {
		if (component === "**") {
			subpattern += doubleAsteriskRegexFragment;
		} else {
			if (usage === "directories") {
				subpattern += "(?:";
				optionalCount++;
			}

			if (hasWrittenComponent) {
				subpattern += directorySeparator;
			}

			if (usage !== "exclude") {
				let componentPattern = "";
				// The * and ? wildcards should not match directories or files that start with . if they
				// appear first in a component. Dotted directories and files can be included explicitly
				// like so: **/.*/.*
				if (component.charCodeAt(0) === CharacterCodes.asterisk) {
					componentPattern += "(?:[^./]" + singleAsteriskRegexFragment + ")?";
					component = component.substr(1);
				} else if (component.charCodeAt(0) === CharacterCodes.question) {
					componentPattern += "[^./]";
					component = component.substr(1);
				}

				componentPattern += component.replace(
					reservedCharacterPattern,
					replaceWildcardCharacter,
				);

				// Patterns should not include subfolders like node_modules unless they are
				// explicitly included as part of the path.
				//
				// As an optimization, if the component pattern is the same as the component,
				// then there definitely were no wildcard characters and we do not need to
				// add the exclusion pattern.
				if (componentPattern !== component) {
					subpattern += implicitExcludePathRegexPattern;
				}

				subpattern += componentPattern;
			} else {
				subpattern += component.replace(
					reservedCharacterPattern,
					replaceWildcardCharacter,
				);
			}
		}

		hasWrittenComponent = true;
	}

	while (optionalCount > 0) {
		subpattern += ")?";
		optionalCount--;
	}

	return subpattern;
}

function getRegularExpressionForWildcard(
	specs: readonly string[] | undefined,
	basePath: string,
	usage: "files" | "directories" | "exclude",
): string | undefined {
	const patterns = getRegularExpressionsForWildcards(specs, basePath, usage);
	if (!patterns || !patterns.length) {
		return undefined;
	}

	const pattern = patterns.map((pattern) => `(?:${pattern})`).join("|");
	// If excluding, match "foo/bar/baz...", but if including, only allow "foo".
	const terminator = usage === "exclude" ? "(?:$|/)" : "$";
	return `^(?:${pattern})${terminator}`;
}

function isRootedDiskPath(path: string): boolean {
	return getEncodedRootLength(path) > 0;
}

function indexOfAnyCharCode(
	text: string,
	charCodes: readonly number[],
	start?: number,
): number {
	for (let i = start ?? 0; i < text.length; i++) {
		if (contains(charCodes, text.charCodeAt(i))) {
			return i;
		}
	}
	return -1;
}

type EqualityComparer<T> = (a: T, b: T) => boolean;

function contains<T>(
	array: readonly T[] | undefined,
	value: T,
	equalityComparer: EqualityComparer<T> = equateValues,
): boolean {
	if (array !== undefined) {
		for (let i = 0; i < array.length; i++) {
			if (equalityComparer(array[i], value)) {
				return true;
			}
		}
	}
	return false;
}

const wildcardCharCodes = [CharacterCodes.asterisk, CharacterCodes.question];

function startsWith(
	str: string,
	prefix: string,
	ignoreCase?: boolean,
): boolean {
	return ignoreCase
		? equateStringsCaseInsensitive(str.slice(0, prefix.length), prefix)
		: str.lastIndexOf(prefix, 0) === 0;
}

function getBaseFileName(path: string): string;
function getBaseFileName(
	path: string,
	extensions: string | readonly string[],
	ignoreCase: boolean,
): string;
function getBaseFileName(
	path: string,
	extensions?: string | readonly string[],
	ignoreCase?: boolean,
) {
	path = normalizeSlashes(path);

	// if the path provided is itself the root, then it has not file name.
	const rootLength = getRootLength(path);
	if (rootLength === path.length) {
		return "";
	}

	// return the trailing portion of the path starting after the last (non-terminal) directory
	// separator but not including any trailing directory separator.
	path = removeTrailingDirectorySeparator(path);
	const name = path.slice(
		Math.max(getRootLength(path), path.lastIndexOf(directorySeparator) + 1),
	);
	const extension =
		extensions !== undefined && ignoreCase !== undefined
			? getAnyExtensionFromPath(name, extensions, ignoreCase)
			: undefined;
	return extension ? name.slice(0, name.length - extension.length) : name;
}

function tryGetExtensionFromPath(
	path: string,
	extension: string,
	stringEqualityComparer: (a: string, b: string) => boolean,
) {
	if (!startsWith(extension, ".")) {
		extension = "." + extension;
	}
	if (
		path.length >= extension.length &&
		path.charCodeAt(path.length - extension.length) === CharacterCodes.dot
	) {
		const pathExtension = path.slice(path.length - extension.length);
		if (stringEqualityComparer(pathExtension, extension)) {
			return pathExtension;
		}
	}
}

function getAnyExtensionFromPathWorker(
	path: string,
	extensions: string | readonly string[],
	stringEqualityComparer: (a: string, b: string) => boolean,
) {
	if (typeof extensions === "string") {
		return (
			tryGetExtensionFromPath(path, extensions, stringEqualityComparer) || ""
		);
	}
	for (const extension of extensions) {
		const result = tryGetExtensionFromPath(
			path,
			extension,
			stringEqualityComparer,
		);
		if (result) {
			return result;
		}
	}
	return "";
}

function equateValues<T>(a: T, b: T): boolean {
	return a === b;
}

function equateStringsCaseSensitive(a: string, b: string): boolean {
	return equateValues(a, b);
}

function getAnyExtensionFromPath(path: string): string;
function getAnyExtensionFromPath(
	path: string,
	extensions: string | readonly string[],
	ignoreCase: boolean,
): string;
function getAnyExtensionFromPath(
	path: string,
	extensions?: string | readonly string[],
	ignoreCase?: boolean,
): string {
	// Retrieves any string from the final "." onwards from a base file name.
	// Unlike extensionFromPath, which throws an exception on unrecognized extensions.
	if (extensions) {
		return getAnyExtensionFromPathWorker(
			removeTrailingDirectorySeparator(path),
			extensions,
			ignoreCase ? equateStringsCaseInsensitive : equateStringsCaseSensitive,
		);
	}
	const baseFileName = getBaseFileName(path);
	const extensionIndex = baseFileName.lastIndexOf(".");
	if (extensionIndex >= 0) {
		return baseFileName.substring(extensionIndex);
	}
	return "";
}

function hasExtension(fileName: string): boolean {
	return getBaseFileName(fileName).includes(".");
}

function getIncludeBasePath(absolute: string): string {
	const wildcardOffset = indexOfAnyCharCode(absolute, wildcardCharCodes);
	if (wildcardOffset < 0) {
		// No "*" or "?" in the path
		return !hasExtension(absolute)
			? absolute
			: removeTrailingDirectorySeparator(getDirectoryPath(absolute));
	}
	return absolute.substring(
		0,
		absolute.lastIndexOf(directorySeparator, wildcardOffset),
	);
}

function getDirectoryPath(path: Path): Path;
function getDirectoryPath(path: string): string;
function getDirectoryPath(path: string): string {
	path = normalizeSlashes(path);

	// If the path provided is itself the root, then return it.
	const rootLength = getRootLength(path);
	if (rootLength === path.length) {
		return path;
	}

	// return the leading portion of the path up to the last (non-terminal) directory separator
	// but not including any trailing directory separator.
	path = removeTrailingDirectorySeparator(path);
	return path.slice(
		0,
		Math.max(rootLength, path.lastIndexOf(directorySeparator)),
	);
}

function compareStringsCaseInsensitive(a: string, b: string): Comparison {
	if (a === b) {
		return Comparison.EqualTo;
	}
	if (a === undefined) {
		return Comparison.LessThan;
	}
	if (b === undefined) {
		return Comparison.GreaterThan;
	}
	a = a.toUpperCase();
	b = b.toUpperCase();
	return a < b
		? Comparison.LessThan
		: a > b
			? Comparison.GreaterThan
			: Comparison.EqualTo;
}

function getStringComparer(
	ignoreCase?: boolean,
): typeof compareStringsCaseInsensitive {
	return ignoreCase
		? compareStringsCaseInsensitive
		: compareStringsCaseSensitive;
}

function every<T, U extends T>(
	array: readonly T[],
	callback: (element: T, index: number) => element is U,
): array is readonly U[];
function every<T, U extends T>(
	array: readonly T[] | undefined,
	callback: (element: T, index: number) => element is U,
): array is readonly U[] | undefined;
function every<T>(
	array: readonly T[] | undefined,
	callback: (element: T, index: number) => boolean,
): boolean;
function every<T>(
	array: readonly T[] | undefined,
	callback: (element: T, index: number) => boolean,
): boolean {
	if (array !== undefined) {
		for (let i = 0; i < array.length; i++) {
			if (!callback(array[i], i)) {
				return false;
			}
		}
	}

	return true;
}

function containsPath(
	parent: string,
	child: string,
	ignoreCase?: boolean,
): boolean;
function containsPath(
	parent: string,
	child: string,
	currentDirectory: string,
	ignoreCase?: boolean,
): boolean;
function containsPath(
	parent: string,
	child: string,
	currentDirectory?: string | boolean,
	ignoreCase?: boolean,
) {
	if (typeof currentDirectory === "string") {
		parent = combinePaths(currentDirectory, parent);
		child = combinePaths(currentDirectory, child);
	} else if (typeof currentDirectory === "boolean") {
		ignoreCase = currentDirectory;
	}
	if (parent === undefined || child === undefined) {
		return false;
	}
	if (parent === child) {
		return true;
	}
	const parentComponents = reducePathComponents(getPathComponents(parent));
	const childComponents = reducePathComponents(getPathComponents(child));
	if (childComponents.length < parentComponents.length) {
		return false;
	}

	const componentEqualityComparer = ignoreCase
		? equateStringsCaseInsensitive
		: equateStringsCaseSensitive;
	for (let i = 0; i < parentComponents.length; i++) {
		const equalityComparer =
			i === 0 ? equateStringsCaseInsensitive : componentEqualityComparer;
		if (!equalityComparer(parentComponents[i], childComponents[i])) {
			return false;
		}
	}

	return true;
}

function getBasePaths(
	path: string,
	includes: readonly string[] | undefined,
	useCaseSensitiveFileNames: boolean,
): string[] {
	// Storage for our results in the form of literal paths (e.g. the paths as written by the user).
	const basePaths: string[] = [path];

	if (includes) {
		// Storage for literal base paths amongst the include patterns.
		const includeBasePaths: string[] = [];
		for (const include of includes) {
			// We also need to check the relative paths by converting them to absolute and normalizing
			// in case they escape the base path (e.g "..\somedirectory")
			const absolute: string = isRootedDiskPath(include)
				? include
				: normalizePath(combinePaths(path, include));
			// Append the literal and canonical candidate base paths.
			includeBasePaths.push(getIncludeBasePath(absolute));
		}

		// Sort the offsets array using either the literal or canonical path representations.
		includeBasePaths.sort(getStringComparer(!useCaseSensitiveFileNames));

		// Iterate over each include base path and include unique base paths that are not a
		// subpath of an existing base path
		for (const includeBasePath of includeBasePaths) {
			if (
				every(
					basePaths,
					(basePath) =>
						!containsPath(
							basePath,
							includeBasePath,
							path,
							!useCaseSensitiveFileNames,
						),
				)
			) {
				basePaths.push(includeBasePath);
			}
		}
	}

	return basePaths;
}

function getFileMatcherPatterns(
	path: string,
	excludes: readonly string[] | undefined,
	includes: readonly string[] | undefined,
	useCaseSensitiveFileNames: boolean,
	currentDirectory: string,
): FileMatcherPatterns {
	path = normalizePath(path);
	currentDirectory = normalizePath(currentDirectory);
	const absolutePath = combinePaths(currentDirectory, path);

	return {
		includeFilePatterns: map(
			getRegularExpressionsForWildcards(includes, absolutePath, "files"),
			(pattern) => `^${pattern}$`,
		),
		includeFilePattern: getRegularExpressionForWildcard(
			includes,
			absolutePath,
			"files",
		),
		includeDirectoryPattern: getRegularExpressionForWildcard(
			includes,
			absolutePath,
			"directories",
		),
		excludePattern: getRegularExpressionForWildcard(
			excludes,
			absolutePath,
			"exclude",
		),
		basePaths: getBasePaths(path, includes, useCaseSensitiveFileNames),
	};
}

function getRegexFromPattern(
	pattern: string,
	useCaseSensitiveFileNames: boolean,
): RegExp {
	return new RegExp(pattern, useCaseSensitiveFileNames ? "" : "i");
}

type GetCanonicalFileName = (fileName: string) => string;
function identity<T>(x: T): T {
	return x;
}
function toLowerCase(x: string) {
	return x.toLowerCase();
}
const fileNameLowerCaseRegExp = /[^\u0130\u0131\u00DFa-z0-9\\/:\-_. ]+/g;
function toFileNameLowerCase(x: string): string {
	return fileNameLowerCaseRegExp.test(x)
		? x.replace(fileNameLowerCaseRegExp, toLowerCase)
		: x;
}

function createGetCanonicalFileName(
	useCaseSensitiveFileNames: boolean,
): GetCanonicalFileName {
	return useCaseSensitiveFileNames ? identity : toFileNameLowerCase;
}
function isArray(value: any): value is readonly unknown[] {
	// See: https://github.com/microsoft/TypeScript/issues/17002
	return Array.isArray(value);
}

function toOffset(array: readonly any[], offset: number) {
	return offset < 0 ? array.length + offset : offset;
}

function addRange<T>(
	to: T[],
	from: readonly T[] | undefined,
	start?: number,
	end?: number,
): T[];
function addRange<T>(
	to: T[] | undefined,
	from: readonly T[] | undefined,
	start?: number,
	end?: number,
): T[] | undefined;
function addRange<T>(
	to: T[] | undefined,
	from: readonly T[] | undefined,
	start?: number,
	end?: number,
): T[] | undefined {
	if (from === undefined || from.length === 0) {
		return to;
	}
	if (to === undefined) {
		return from.slice(start, end);
	}
	start = start === undefined ? 0 : toOffset(from, start);
	end = end === undefined ? from.length : toOffset(from, end);
	for (let i = start; i < end && i < from.length; i++) {
		if (from[i] !== undefined) {
			to.push(from[i]);
		}
	}
	return to;
}

function flatten<T>(
	array: T[][] | readonly (T | readonly T[] | undefined)[],
): T[] {
	const result = [];
	for (let i = 0; i < array.length; i++) {
		const v = array[i];
		if (v) {
			if (isArray(v)) {
				addRange(result, v);
			} else {
				result.push(v);
			}
		}
	}
	return result;
}

type Comparer<T> = (a: T, b: T) => Comparison;

const enum Comparison {
	LessThan = -1,
	EqualTo = 0,
	GreaterThan = 1,
}

interface SortedReadonlyArray<T> extends ReadonlyArray<T> {
	" __sortedArrayBrand": any;
}

const emptyArray = [] as never[];

function toSorted<T>(
	array: readonly T[],
	comparer?: Comparer<T>,
): SortedReadonlyArray<T> {
	return (array.length === 0
		? emptyArray
		: array.slice().sort(comparer)) as readonly T[] as SortedReadonlyArray<T>;
}

function compareComparableValues(
	a: string | undefined,
	b: string | undefined,
): Comparison;
function compareComparableValues(
	a: number | undefined,
	b: number | undefined,
): Comparison;
function compareComparableValues(
	a: string | number | undefined,
	b: string | number | undefined,
) {
	return a === b
		? Comparison.EqualTo
		: a === undefined
			? Comparison.LessThan
			: b === undefined
				? Comparison.GreaterThan
				: a < b
					? Comparison.LessThan
					: Comparison.GreaterThan;
}

function compareStringsCaseSensitive(
	a: string | undefined,
	b: string | undefined,
): Comparison {
	return compareComparableValues(a, b);
}

function equateStringsCaseInsensitive(a: string, b: string): boolean {
	return (
		a === b ||
		(a !== undefined && b !== undefined && a.toUpperCase() === b.toUpperCase())
	);
}

function endsWith(str: string, suffix: string, ignoreCase?: boolean): boolean {
	const expectedPos = str.length - suffix.length;
	return (
		expectedPos >= 0 &&
		(ignoreCase
			? equateStringsCaseInsensitive(str.slice(expectedPos), suffix)
			: str.indexOf(suffix, expectedPos) === expectedPos)
	);
}

function fileExtensionIs(path: string, extension: string): boolean {
	return path.length > extension.length && endsWith(path, extension);
}

function fileExtensionIsOneOf(
	path: string,
	extensions: readonly string[],
): boolean {
	for (const extension of extensions) {
		if (fileExtensionIs(path, extension)) {
			return true;
		}
	}

	return false;
}

function findIndex<T>(
	array: readonly T[] | undefined,
	predicate: (element: T, index: number) => boolean,
	startIndex?: number,
): number {
	if (array === undefined) {
		return -1;
	}
	for (let i = startIndex ?? 0; i < array.length; i++) {
		if (predicate(array[i], i)) {
			return i;
		}
	}
	return -1;
}

export function matchFiles(
	path: string,
	extensions: readonly string[] | undefined,
	excludes: readonly string[] | undefined,
	includes: readonly string[] | undefined,
	useCaseSensitiveFileNames: boolean,
	currentDirectory: string,
	depth: number | undefined,
	getFileSystemEntries: (path: string) => FileSystemEntries,
	realpath: (path: string) => string,
): string[] {
	path = normalizePath(path);
	currentDirectory = normalizePath(currentDirectory);

	const patterns = getFileMatcherPatterns(
		path,
		excludes,
		includes,
		useCaseSensitiveFileNames,
		currentDirectory,
	);

	const includeFileRegexes =
		patterns.includeFilePatterns &&
		patterns.includeFilePatterns.map((pattern) =>
			getRegexFromPattern(pattern, useCaseSensitiveFileNames),
		);
	const includeDirectoryRegex =
		patterns.includeDirectoryPattern &&
		getRegexFromPattern(
			patterns.includeDirectoryPattern,
			useCaseSensitiveFileNames,
		);
	const excludeRegex =
		patterns.excludePattern &&
		getRegexFromPattern(patterns.excludePattern, useCaseSensitiveFileNames);

	// Associate an array of results with each include regex. This keeps results in order of the "include" order.
	// If there are no "includes", then just put everything in results[0].
	const results: string[][] = includeFileRegexes
		? includeFileRegexes.map(() => [])
		: [[]];
	const visited = new Map<string, true>();
	const toCanonical = createGetCanonicalFileName(useCaseSensitiveFileNames);
	for (const basePath of patterns.basePaths) {
		visitDirectory(basePath, combinePaths(currentDirectory, basePath), depth);
	}

	return flatten(results);

	function visitDirectory(
		path: string,
		absolutePath: string,
		depth: number | undefined,
	) {
		const canonicalPath = toCanonical(realpath(absolutePath));
		if (visited.has(canonicalPath)) {
			return;
		}
		visited.set(canonicalPath, true);
		const { files, directories } = getFileSystemEntries(path);

		for (const current of toSorted<string>(
			files,
			compareStringsCaseSensitive,
		)) {
			const name = combinePaths(path, current);
			const absoluteName = combinePaths(absolutePath, current);
			if (extensions && !fileExtensionIsOneOf(name, extensions)) {
				continue;
			}
			if (excludeRegex && excludeRegex.test(absoluteName)) {
				continue;
			}
			if (!includeFileRegexes) {
				results[0].push(name);
			} else {
				const includeIndex = findIndex(includeFileRegexes, (re) =>
					re.test(absoluteName),
				);
				if (includeIndex !== -1) {
					results[includeIndex].push(name);
				}
			}
		}

		if (depth !== undefined) {
			depth--;
			if (depth === 0) {
				return;
			}
		}

		for (const current of toSorted<string>(
			directories,
			compareStringsCaseSensitive,
		)) {
			const name = combinePaths(path, current);
			const absoluteName = combinePaths(absolutePath, current);
			if (
				(!includeDirectoryRegex || includeDirectoryRegex.test(absoluteName)) &&
				(!excludeRegex || !excludeRegex.test(absoluteName))
			) {
				visitDirectory(name, absoluteName, depth);
			}
		}
	}
}
