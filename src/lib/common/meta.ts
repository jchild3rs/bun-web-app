export class Meta {
	title = "";
	description = "";
	extraScripts = "";
	extraStyles = "";
	prefetch: { href: string; as: string }[] = [];

	constructor({
		title,
		description,
		extraScripts,
		extraStyles,
		prefetch,
	}: Partial<Meta> = {}) {
		this.title = title || this.title;
		this.description = description || this.description;
		this.extraScripts = extraScripts || this.extraScripts;
		this.extraStyles = extraStyles || this.extraStyles;
		this.prefetch = prefetch || this.prefetch;
	}
}

export type MetaObject = Partial<{
	[key in keyof Meta]: Meta[key];
}>;
