import { css, cx } from "@styled-system/css";
import { scrollable } from "@styled-system/patterns";

const COMBOBOX_HEIGHT = "40px";

class Combobox extends HTMLElement {
	private readonly combobox: HTMLInputElement;
	private readonly listbox: HTMLUListElement;
	private originalInput: HTMLInputElement;
	static get observedAttributes() {
		return ["aria-expanded"];
	}

	private template = document.createElement("template");

	constructor() {
		super();

		this.originalInput = this.querySelector("input") as HTMLInputElement;

		this.className = css({
			pos: "relative",
			display: "inline-flex",
			bg: "neutral.50",
			color: "neutral.900",
			height: COMBOBOX_HEIGHT,
		});
		this.template.innerHTML = `
<input 
	type="text"
	id="${this.comboboxId}" 
	name="${this.originalInput.getAttribute("name") || this.generateId()}"
	class="${css({
		outline: "none",
		height: COMBOBOX_HEIGHT,
		px: 2,
		bg: "transparent",
		position: "relative",
		zIndex: 1,
		_focus: {
			ring: "2px solid",
			ringColor: "blue.500",
			ringOffset: "1",
		},
	})}" 
	aria-autocomplete="list" 
	autocomplete="off" 
	role="combobox" 
	placeholder="${this.originalInput.getAttribute("placeholder") || ""}"
	aria-haspopup="listbox" 
	aria-expanded="false" 
	aria-controls="${this.listboxId}" 
	aria-owns="${this.listboxId}" 
	aria-activedescendant="" 
	required="${this.originalInput.hasAttribute("required")}"
/>
<ul 
	id="${this.listboxId}" 
	hidden 
	role="listbox" 
	aria-label="Suggestions" 
	class="${cx(
		css({
			borderTop: "1px solid",
			borderColor: "neutral.200",
			pos: "absolute",
			zIndex: 2,
			background: "neutral.50",
			color: "neutral.900",
			top: COMBOBOX_HEIGHT,
			maxH: "200px",
			left: 0,
			"& > li": {
				minH: COMBOBOX_HEIGHT,
				px: 2,
				py: 1,
				fontSize: "sm",

				"&:hover, &[aria-selected=true]": {
					background: "blue.500",
					color: "neutral.100",
				},
			},
		}),
		scrollable(),
	)}">
</ul>`;
		const template = this.template.content.cloneNode(true);

		// there should be a fallback <input /> as a child for no-JS users. we want to blow that out.
		this.innerHTML = "";

		this.appendChild(template);

		this.combobox = this.querySelector('[role="combobox"]') as HTMLInputElement;
		this.listbox = this.querySelector('[role="listbox"]') as HTMLUListElement;
	}

	get id() {
		return this.originalInput.getAttribute("id") || this.generateId();
	}

	get comboboxId() {
		return `combobox-${this.id}`;
	}

	get listboxId() {
		return `listbox-${this.id}`;
	}

	private generateId() {
		return `combobox-${Math.random().toString(36).slice(2)}`;
	}

	private hideListbox() {
		this.ariaExpanded = "false";
		this.listbox.hidden = true;
	}

	private showListbox() {
		this.ariaExpanded = "true";
		this.listbox.hidden = false;
	}

	private emptyListbox() {
		this.listbox.innerHTML = "";
	}

	private toggleListbox(isAltPressed: boolean) {
		if (this.combobox.value && this.listbox.hidden) {
			this.showListbox();
		} else if (!this.combobox.value && this.listbox.hidden) {
			this.hideListbox();
		}

		if (isAltPressed) {
			this.hideListbox();
		}
	}

	private toggleListboxSelection(m: (current: number) => number) {
		const options = this.listbox.querySelectorAll("li");
		if (options.length > 0) {
			let current = -1;
			// biome-ignore lint/complexity/noForEach: <explanation>
			options.forEach((option, index) => {
				if (option.getAttribute("aria-selected") === "true") {
					current = index;
				}
				option.setAttribute("aria-selected", "false");
			});
			let nextIndex = m(current);
			if (nextIndex >= options.length) {
				nextIndex = 0;
			} else if (nextIndex < 0) {
				nextIndex = options.length - 1;
			}

			if (options.item(nextIndex)) {
				this.combobox.setAttribute(
					"aria-activedescendant",
					options[nextIndex].id,
				);
				const selectedOption = options[nextIndex];
				selectedOption.setAttribute("aria-selected", "true");

				const listboxRect = this.listbox.getBoundingClientRect();
				const optionRect = selectedOption.getBoundingClientRect();
				if (optionRect.bottom > listboxRect.bottom) {
					this.listbox.scrollTop =
						selectedOption.offsetTop - this.listbox.offsetTop;
				} else if (optionRect.top < listboxRect.top) {
					this.listbox.scrollTop =
						selectedOption.offsetTop - this.listbox.offsetTop;
				}
			}
		}
	}

	private bindEvents() {
		document.documentElement.addEventListener("click", (event) => {
			const target = event.target as HTMLElement;
			if (target !== this.combobox && target !== this.listbox) {
				this.hideListbox();
			}
		});

		this.listbox.addEventListener("click", (event) => {
			const target = event.target as HTMLElement;
			if (target.getAttribute("role") === "option") {
				this.combobox.value = target.innerText;
				this.combobox.focus();

				for (const option of this.listbox.querySelectorAll(
					"li",
				) as unknown as HTMLLIElement[]) {
					option.setAttribute("aria-selected", "false");
				}

				target.setAttribute("aria-selected", "true");
				this.combobox.setAttribute("aria-activedescendant", target.id);

				this.handleSelection();
				this.hideListbox();
			}
		});

		this.combobox.addEventListener("input", (event) => {
			if (!this.listbox) {
				return;
			}

			const value = (event.target as HTMLInputElement).value;

			if (value.length === 0) {
				this.emptyListbox();
				this.hideListbox();
				return;
			}

			const url = new URL(window.location.href);
			url.pathname = this.getAttribute("endpoint") as string;
			url.searchParams.set("query", value);

			void fetch(url)
				.then((res) => res.text())
				.then((html) => {
					const hidden = !html;

					this.ariaExpanded = `${!hidden}`;

					this.listbox.hidden = hidden;
					this.listbox.innerHTML = html;
				});
		});

		this.combobox.addEventListener("click", () => {
			if (this.listbox.childNodes.length > 0) {
				this.showListbox();
			}
		});

		this.combobox.addEventListener("focus", () => {
			if (this.listbox.childNodes.length > 0) {
				this.showListbox();
			}
		});

		this.combobox.addEventListener("keydown", (event) => {
			if (!this.listbox) {
				return;
			}

			switch (event.key) {
				case "Tab": {
					if (!this.listbox.hidden) {
						this.hideListbox();
					}
					break;
				}
				case "ArrowUp":
				case "ArrowDown": {
					if (!this.listbox.hidden) {
						event.preventDefault();
						this.toggleListbox(event.altKey);
						this.toggleListboxSelection((prev) =>
							event.key === "ArrowUp" ? prev - 1 : prev + 1,
						);
					}
					break;
				}
				case "Enter": {
					if (!this.listbox.hidden) {
						event.preventDefault();
						this.handleSelection();
					}
					break;
				}
				case "Escape": {
					if (!this.listbox.hidden) {
						this.hideListbox();
					}
					break;
				}
			}
		});
	}

	private handleSelection() {
		const navigateOnSelect = this.hasAttribute("navigate-on-select");
		const selectedItem = this.listbox.querySelector(
			"[aria-selected=true]",
		) as HTMLLIElement;
		if (!selectedItem) {
			return;
		}
		const href = selectedItem.dataset.href;

		const selectedText = selectedItem?.textContent?.trim();

		if (selectedText) {
			this.hideListbox();
			this.combobox.value = selectedText;
		}

		if (navigateOnSelect && href) {
			location.href = href;
		}
	}

	private unbindEvents() {
		this.listbox.removeEventListener("click", () => {});

		this.combobox.removeEventListener("input", () => {});
		this.combobox.removeEventListener("click", () => {});
		this.combobox.removeEventListener("focus", () => {});
		this.combobox.removeEventListener("keydown", () => {});

		document.documentElement.removeEventListener("click", () => {});
	}

	connectedCallback() {
		this.bindEvents();
	}

	disconnectedCallback() {
		this.unbindEvents();
	}
}

// "combobox" is not a valid custom element name ?
customElements.define("enhanced-combobox", Combobox);
