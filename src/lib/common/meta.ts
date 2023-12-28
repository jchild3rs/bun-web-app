export class Meta {
	title = "";
	description = "";
	extraScripts = "";
	extraStyles = "";

	constructor({
		title,
		description,
		extraScripts,
		extraStyles,
	}: Partial<Meta> = {}) {
		this.title = title || this.title;
		this.description = description || this.description;
		this.extraScripts = extraScripts || this.extraScripts;
		this.extraStyles = extraStyles || this.extraStyles;
	}
}

export type MetaObject = Partial<{
	[key in keyof Meta]: Meta[key];
}>;
