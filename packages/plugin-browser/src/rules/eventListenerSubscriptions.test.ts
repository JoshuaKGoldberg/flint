import rule from "./eventListenerSubscriptions.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
element.onclick = handler;
`,
			snapshot: `
element.onclick = handler;
        ~~~~~~~
        Prefer addEventListener over assigning to the \`onclick\` property.
`,
		},
		{
			code: `
button.onmousedown = function () {
    console.log("clicked");
};
`,
			snapshot: `
button.onmousedown = function () {
       ~~~~~~~~~~~
       Prefer addEventListener over assigning to the \`onmousedown\` property.
    console.log("clicked");
};
`,
		},
		{
			code: `
window.onload = () => {
    console.log("loaded");
};
`,
			snapshot: `
window.onload = () => {
       ~~~~~~
       Prefer addEventListener over assigning to the \`onload\` property.
    console.log("loaded");
};
`,
		},
		{
			code: `
document.body.onkeypress = handleKeypress;
`,
			snapshot: `
document.body.onkeypress = handleKeypress;
              ~~~~~~~~~~
              Prefer addEventListener over assigning to the \`onkeypress\` property.
`,
		},
		{
			code: `
form.onsubmit = (event) => {
    event.preventDefault();
};
`,
			snapshot: `
form.onsubmit = (event) => {
     ~~~~~~~~
     Prefer addEventListener over assigning to the \`onsubmit\` property.
    event.preventDefault();
};
`,
		},
		{
			code: `
video.onpause = () => console.log("paused");
`,
			snapshot: `
video.onpause = () => console.log("paused");
      ~~~~~~~
      Prefer addEventListener over assigning to the \`onpause\` property.
`,
		},
		{
			code: `
input.oninput = function (event) {
    validate(event.target.value);
};
`,
			snapshot: `
input.oninput = function (event) {
      ~~~~~~~
      Prefer addEventListener over assigning to the \`oninput\` property.
    validate(event.target.value);
};
`,
		},
		{
			code: `
element.onmouseover = handler;
`,
			snapshot: `
element.onmouseover = handler;
        ~~~~~~~~~~~
        Prefer addEventListener over assigning to the \`onmouseover\` property.
`,
		},
	],
	valid: [
		`element.addEventListener("click", handler);`,
		`button.addEventListener("mousedown", function () { console.log("clicked"); });`,
		`window.addEventListener("load", () => { console.log("loaded"); });`,
		`document.body.addEventListener("keypress", handleKeypress);`,
		`form.addEventListener("submit", (event) => { event.preventDefault(); });`,
		`element.setAttribute("onclick", "handler()");`,
		`const onclick = element.onclick;`,
		`const handler = { onclick: () => {} };`,
		`obj.customProperty = value;`,
		`element.className = "active";`,
	],
});
