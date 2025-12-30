import { createCommentDirectiveAlreadyDisabled } from "./createCommentDirectiveAlreadyDisabled.js";
import { createCommentDirectiveFileAfterContent } from "./createCommentDirectiveFileAfterContent.js";
import { createCommentDirectiveNoSelection } from "./createCommentDirectiveNoSelection.js";
import { createCommentDirectiveNotPreviouslyDisabled } from "./createCommentDirectiveNotPreviouslyDisabled.js";
import { createCommentDirectiveUnknown } from "./createCommentDirectiveUnknown.js";

export const directiveReports = {
	createAlreadyDisabled: createCommentDirectiveAlreadyDisabled,
	createFileAfterContent: createCommentDirectiveFileAfterContent,
	createNoSelection: createCommentDirectiveNoSelection,
	createNotPreviouslyDisabled: createCommentDirectiveNotPreviouslyDisabled,
	createUnknown: createCommentDirectiveUnknown,
};
