//#region src/options/readEmoji.ts
async function readEmoji(getDescription) {
	return (await getDescription())?.match(/\p{Extended_Pictographic}/gu)?.at(-1) ?? "💖";
}

//#endregion
export { readEmoji };
//# sourceMappingURL=readEmoji.js.map