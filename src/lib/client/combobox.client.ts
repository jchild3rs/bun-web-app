class Combobox extends HTMLElement {
	private readonly combobox: HTMLInputElement;

	private readonly listbox: HTMLUListElement;

	public id: string;

	constructor() {
		super();

		// const root = this.attachShadow({ mode: "open" });
		// const extraSheet = new CSSStyleSheet();
		// extraSheet.replaceSync(
		// document.getElementById("global-styles")?.textContent || "",
		// );
		// root.adoptedStyleSheets = [extraSheet];
		const originalInput = this.firstElementChild;

		this.id = originalInput?.id ?? `combobox-${this.generateId()}`;
		this.className = "combobox";

		// this.className = css({
		// 	pos: "relative",
		// 	display: "inline-flex",
		// 	bg: "neutral.50",
		// 	color: "neutral.900",
		// 	height: COMBOBOX_HEIGHT,
		// });

		this.combobox = this.createCombobox(originalInput);
		this.listbox = this.createListbox();
	}

	connectedCallback() {
		console.log("connectedCallback()");

		if (this.contains(this.combobox)) {
			return;
		}

		this.firstElementChild?.remove();
		this.appendChild(this.combobox);
		this.appendChild(this.listbox);
		this.bindEvents();
	}

	private createCombobox(originalInput: Element | null) {
		const combobox = document.createElement("input");

		combobox.className = "combobox__input";
		combobox.type = "text";
		combobox.id = this.id;
		combobox.name =
			originalInput?.getAttribute("name") ?? this.generateId();
		combobox.ariaAutoComplete = "list";
		combobox.autocomplete = "off";
		combobox.role = "combobox";
		combobox.placeholder = originalInput?.getAttribute("placeholder") || "";
		combobox.ariaHasPopup = "listbox";
		combobox.ariaExpanded = "false";
		combobox.setAttribute("aria-controls", this.listboxId);
		combobox.setAttribute("aria-owns", this.listboxId);
		combobox.setAttribute("aria-activedescendant", "");

		if (originalInput?.hasAttribute("required")) {
			combobox.required = (originalInput as HTMLInputElement).required;
		}

		return combobox;
	}

	private createListbox() {
		const listbox = document.createElement("ul");

		listbox.className = "combobox__results";
		listbox.id = this.listboxId;
		listbox.hidden = true;
		listbox.role = "listbox";
		// listbox.ariaLabel = "Suggestions";

		return listbox;
	}

	get listboxId() {
		return `listbox-${this.id}`;
	}

	private generateId() {
		return Math.random().toString(36).slice(2);
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

	get value() {
		return this.combobox.value;
	}

	async fetchSuggestions(value: string) {
		const url = new URL(window.location.href);
		url.pathname = this.getAttribute("endpoint") as string;
		url.searchParams.set("query", value);

		const res = await fetch(url);
		return await res.text();
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

			void this.fetchSuggestions(value).then((html) => {
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
				case "Tab":
					if (!this.listbox.hidden) {
						this.hideListbox();
					}
					break;

				case "ArrowUp":
				case "ArrowDown":
					if (!this.listbox.hidden) {
						event.preventDefault();
						this.toggleListbox(event.altKey);
						this.toggleListboxSelection((prev) =>
							event.key === "ArrowUp" ? prev - 1 : prev + 1,
						);
					}
					break;

				case "Enter":
					if (!this.listbox.hidden) {
						event.preventDefault();
						this.handleSelection();
					}
					break;

				case "Escape":
					if (!this.listbox.hidden) {
						this.hideListbox();
					}
					break;
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
			// location.href = href;
		}

		this.combobox.dispatchEvent(
			new CustomEvent("combobox:selection", {
				detail: {
					value: selectedText,
					href,
				},
			}),
		);
	}
}

// "combobox" is not a valid custom element name ?
customElements.define("enhanced-combobox", Combobox);

export { Combobox };
