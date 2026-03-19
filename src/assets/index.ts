/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/** biome-ignore-all lint/style/noCommonJs: Images must be required. */
const indent: number = require("./indent.png");
const outdent: number = require("./unindent.png");
const bold: number = require("./bold.png");
const italic: number = require("./italic.png");
const underline: number = require("./underline.png");
const strikethrough: number = require("./strikethrough.png");
const h1: number = require("./h1.png");
const h2: number = require("./h2.png");
const h3: number = require("./h3.png");
const h4: number = require("./h4.png");
const h5: number = require("./h5.png");
const h6: number = require("./h6.png");
const orderedList: number = require("./ol.png");
const bulletList: number = require("./ul.png");
const checkList: number = require("./checklist.png");
const undo: number = require("./undo.png");
const redo: number = require("./redo.png");
const link: number = require("./link.png");
const palette: number = require("./palette.png");
const code: number = require("./code.png");
const quote: number = require("./quote.png");
const Aa: number = require("./Aa.png");
const aIcon: number = require("./a.png");
const close: number = require("./close.png");

const Images = {
	indent,
	outdent,
	bold,
	italic,
	underline,
	strikethrough,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	orderedList,
	bulletList,
	checkList,
	undo,
	redo,
	link,
	palette,
	code,
	quote,
	// biome-ignore lint/style/useNamingConvention: It's the name of the image.
	Aa,
	// eslint-disable-next-line id-length
	a: aIcon,
	close,
};

export { Images };
