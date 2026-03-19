import { BlockquoteBridge } from "./blockquote";
import { BoldBridge } from "./bold";
import { HardBreakBridge } from "./br";
import { BulletListBridge } from "./bulletList";
import { ClearFormattingBridge } from "./clearFormatting";
import { CodeBridge } from "./code";
import { CodeBlockBridge } from "./codeBlock";
import { ColorBridge } from "./color";
import { CoreBridge } from "./core";
import { DropCursorBridge } from "./dropcursor";
import { FontFamilyBridge } from "./fontFamily";
import { FontSizeBridge } from "./fontSize";
import { HeadingBridge } from "./heading";
import { HighlightBridge } from "./highlight";
import { HistoryBridge } from "./history";
import { HorizontalRuleBridge } from "./horizontalRule";
import { ImageBridge } from "./image";
import { ItalicBridge } from "./italic";
import { LinkBridge } from "./link";
import { ListItemBridge } from "./listItem";
import { OrderedListBridge } from "./orderedList";
import { PlaceholderBridge } from "./placeholder";
import { StrikeBridge } from "./strike";
import { SubscriptBridge } from "./subscript";
import { SuperscriptBridge } from "./superscript";
import { TableBridge } from "./table";
import { TaskListBridge } from "./tasklist";
import { TextAlignBridge } from "./textAlign";
import { TextStyleBridge } from "./textStyle";
import { TrailingNodeBridge } from "./trailingNode";
import { UnderlineBridge } from "./underline";

export const TenTapStartKit = [
	BoldBridge,
	HistoryBridge,
	CodeBridge,
	ItalicBridge,
	StrikeBridge,
	UnderlineBridge,
	OrderedListBridge,
	HeadingBridge,
	ImageBridge,
	BulletListBridge,
	BlockquoteBridge,
	TaskListBridge,
	LinkBridge,
	ColorBridge,
	HighlightBridge,
	CoreBridge,
	PlaceholderBridge,
	ListItemBridge,
	DropCursorBridge,
	HardBreakBridge,
	TextStyleBridge,
	TextAlignBridge,
	SubscriptBridge,
	SuperscriptBridge,
	TableBridge,
	CodeBlockBridge,
	HorizontalRuleBridge,
	FontFamilyBridge,
	FontSizeBridge,
	TrailingNodeBridge,
	ClearFormattingBridge,
];
