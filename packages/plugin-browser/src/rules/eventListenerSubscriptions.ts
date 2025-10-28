import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// Common DOM event handler properties that should use addEventListener instead
const eventHandlerProperties = new Set([
	"onabort",
	"onanimationcancel",
	"onanimationend",
	"onanimationiteration",
	"onanimationstart",
	"onauxclick",
	"onbeforeinput",
	"onblur",
	"oncancel",
	"oncanplay",
	"oncanplaythrough",
	"onchange",
	"onclick",
	"onclose",
	"oncontextmenu",
	"oncopy",
	"oncuechange",
	"oncut",
	"ondblclick",
	"ondrag",
	"ondragend",
	"ondragenter",
	"ondragleave",
	"ondragover",
	"ondragstart",
	"ondrop",
	"ondurationchange",
	"onemptied",
	"onended",
	"onerror",
	"onfocus",
	"onfocusin",
	"onfocusout",
	"onformdata",
	"ongotpointercapture",
	"oninput",
	"oninvalid",
	"onkeydown",
	"onkeypress",
	"onkeyup",
	"onload",
	"onloadeddata",
	"onloadedmetadata",
	"onloadstart",
	"onlostpointercapture",
	"onmousedown",
	"onmouseenter",
	"onmouseleave",
	"onmousemove",
	"onmouseout",
	"onmouseover",
	"onmouseup",
	"onpaste",
	"onpause",
	"onplay",
	"onplaying",
	"onpointercancel",
	"onpointerdown",
	"onpointerenter",
	"onpointerleave",
	"onpointermove",
	"onpointerout",
	"onpointerover",
	"onpointerup",
	"onprogress",
	"onratechange",
	"onreset",
	"onresize",
	"onscroll",
	"onsecuritypolicyviolation",
	"onseeked",
	"onseeking",
	"onselect",
	"onselectionchange",
	"onselectstart",
	"onslotchange",
	"onstalled",
	"onsubmit",
	"onsuspend",
	"ontimeupdate",
	"ontoggle",
	"ontouchcancel",
	"ontouchend",
	"ontouchmove",
	"ontouchstart",
	"ontransitioncancel",
	"ontransitionend",
	"ontransitionrun",
	"ontransitionstart",
	"onvolumechange",
	"onwaiting",
	"onwheel",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer addEventListener over assigning to on* event handler properties.",
		id: "eventListenerSubscriptions",
		preset: "logical",
	},
	messages: {
		preferAddEventListener: {
			primary:
				"Prefer addEventListener over assigning to the `{{ property }}` property.",
			secondary: [
				"Using addEventListener provides more flexibility and follows modern DOM event handling practices.",
				"Event handler properties can only hold one function at a time, overwriting previous handlers.",
				"addEventListener allows multiple listeners for the same event and provides options for capture phase and passive listeners.",
			],
			suggestions: [
				"Replace with addEventListener('{{ eventType }}', handler) for better control and flexibility.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				BinaryExpression(node: ts.BinaryExpression) {
					// Check if this is an assignment
					if (node.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
						return;
					}

					// Check if the left side is a property access
					if (!ts.isPropertyAccessExpression(node.left)) {
						return;
					}

					const propertyName = node.left.name.text;

					// Check if it's an event handler property
					if (!eventHandlerProperties.has(propertyName)) {
						return;
					}

					// Extract event type (remove 'on' prefix)
					const eventType = propertyName.slice(2);

					context.report({
						data: { eventType, property: propertyName },
						message: "preferAddEventListener",
						range: getTSNodeRange(node.left.name, context.sourceFile),
					});
				},
			},
		};
	},
});
