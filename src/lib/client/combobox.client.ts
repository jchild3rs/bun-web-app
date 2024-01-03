class Combobox extends HTMLElement {
	private readonly originalInputElement: Element | null;
	private readonly comboboxElement: HTMLInputElement;
	private readonly listboxElement: HTMLUListElement;

	constructor() {
		super();

		this.originalInputElement = this.firstElementChild;

		this.comboboxElement = this.createCombobox(this.firstElementChild);
		this.listboxElement = this.createListbox();
	}

	connectedCallback() {
		this.mount();
	}

	disconnectedCallback() {
		this.unmount();
	}

	private mount() {
		if (this.contains(this.comboboxElement)) {
			return;
		}

		if (this.originalInputElement) {
			this.originalInputElement.remove();
		}

		this.appendChild(this.comboboxElement);
		this.appendChild(this.listboxElement);

		this.bindEvents();
	}

	private unmount() {
		this.unbindEvents();

		this.removeChild(this.comboboxElement);
		this.removeChild(this.listboxElement);

		if (this.originalInputElement) {
			this.appendChild(this.originalInputElement);
		}
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
		this.listboxElement.hidden = true;
	}

	private showListbox() {
		this.ariaExpanded = "true";
		this.listboxElement.hidden = false;
	}

	private emptyListbox() {
		this.listboxElement.innerHTML = "";
	}

	private toggleListbox(isAltPressed: boolean) {
		if (this.comboboxElement.value && this.listboxElement.hidden) {
			this.showListbox();
		} else if (!this.comboboxElement.value && this.listboxElement.hidden) {
			this.hideListbox();
		}

		if (isAltPressed) {
			this.hideListbox();
		}
	}

	private toggleListboxSelection(m: (current: number) => number) {
		const options = this.listboxElement.querySelectorAll("li");
		if (options.length > 0) {
			let current = -1;
			// biome-ignore lint/complexity/noForEach: NodeListOf doesn't implement Array
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
				this.comboboxElement.setAttribute(
					"aria-activedescendant",
					options[nextIndex].id,
				);
				const selectedOption = options[nextIndex];
				selectedOption.setAttribute("aria-selected", "true");

				const listboxRect = this.listboxElement.getBoundingClientRect();
				const optionRect = selectedOption.getBoundingClientRect();
				if (optionRect.bottom > listboxRect.bottom) {
					this.listboxElement.scrollTop =
						selectedOption.offsetTop -
						this.listboxElement.offsetTop;
				} else if (optionRect.top < listboxRect.top) {
					this.listboxElement.scrollTop =
						selectedOption.offsetTop -
						this.listboxElement.offsetTop;
				}
			}
		}
	}

	public get value() {
		return this.comboboxElement.value;
	}

	private async fetchSuggestions(value: string) {
		const url = new URL(window.location.href);
		url.pathname = this.getAttribute("endpoint") as string;
		url.searchParams.set("query", value);

		const res = await fetch(url);
		return await res.text();
	}

	private handleClickOutside = () => {
		document.documentElement.addEventListener("click", (event) => {
			const target = event.target as HTMLElement;
			if (
				target !== this.comboboxElement &&
				target !== this.listboxElement
			) {
				this.hideListbox();
			}
		});
	};
	private handleListboxClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (target.getAttribute("role") === "option") {
			this.comboboxElement.value = target.innerText;
			this.comboboxElement.focus();

			for (const option of this.listboxElement.querySelectorAll(
				"li",
			) as unknown as HTMLLIElement[]) {
				option.setAttribute("aria-selected", "false");
			}

			target.setAttribute("aria-selected", "true");
			this.comboboxElement.setAttribute(
				"aria-activedescendant",
				target.id,
			);

			this.handleSelection();
			this.hideListbox();
		}
	};

	private handleComboboxInput = async (event: Event) => {
		if (!this.listboxElement) {
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

			this.listboxElement.hidden = hidden;
			this.listboxElement.innerHTML = html;
		});
	};

	private handleComboboxClick = (_: MouseEvent) => {
		if (this.listboxElement.childNodes.length > 0) {
			this.showListbox();
		}
	};

	private handleComboboxFocus = () => {
		if (this.listboxElement.childNodes.length > 0) {
			this.showListbox();
		}
	};

	private handleComboboxKeydown = (event: KeyboardEvent) => {
		if (!this.listboxElement) {
			return;
		}

		switch (event.key) {
			case "Tab":
				if (!this.listboxElement.hidden) {
					this.hideListbox();
				}
				break;

			case "ArrowUp":
			case "ArrowDown":
				if (!this.listboxElement.hidden) {
					event.preventDefault();
					this.toggleListbox(event.altKey);
					this.toggleListboxSelection((prev) =>
						event.key === "ArrowUp" ? prev - 1 : prev + 1,
					);
				}
				break;

			case "Enter":
				if (!this.listboxElement.hidden) {
					event.preventDefault();
					this.handleSelection();
				}
				break;

			case "Escape":
				if (!this.listboxElement.hidden) {
					this.hideListbox();
				}
				break;
		}
	};

	private handleSelection() {
		const navigateOnSelect = this.hasAttribute("navigate-on-select");
		const selectedItem = this.listboxElement.querySelector(
			"[aria-selected=true]",
		) as HTMLLIElement;
		if (!selectedItem) {
			return;
		}
		const href = selectedItem.dataset.href;

		const selectedText = selectedItem?.textContent?.trim();

		if (selectedText) {
			this.hideListbox();
			this.comboboxElement.value = selectedText;
		}

		if (navigateOnSelect && href) {
			// location.href = href;
		}

		this.comboboxElement.dispatchEvent(
			new CustomEvent("combobox:selection", {
				detail: {
					value: selectedText,
					href,
				},
			}),
		);
	}

	private bindEvents() {
		document.documentElement.addEventListener(
			"click",
			this.handleClickOutside,
		);
		this.listboxElement.addEventListener("click", this.handleListboxClick);
		this.comboboxElement.addEventListener(
			"input",
			this.handleComboboxInput,
		);
		this.comboboxElement.addEventListener(
			"click",
			this.handleComboboxClick,
		);
		this.comboboxElement.addEventListener(
			"focus",
			this.handleComboboxFocus,
		);
		this.comboboxElement.addEventListener(
			"keydown",
			this.handleComboboxKeydown,
		);
	}

	private unbindEvents() {
		document.documentElement.removeEventListener(
			"click",
			this.handleClickOutside,
		);
		this.listboxElement.removeEventListener(
			"click",
			this.handleListboxClick,
		);
		this.comboboxElement.removeEventListener(
			"input",
			this.handleComboboxInput,
		);
		this.comboboxElement.removeEventListener(
			"click",
			this.handleComboboxClick,
		);
		this.comboboxElement.removeEventListener(
			"focus",
			this.handleComboboxFocus,
		);
		this.comboboxElement.removeEventListener(
			"keydown",
			this.handleComboboxKeydown,
		);
	}
}

// "combobox" is not a valid custom element name ?
customElements.define("enhanced-combobox", Combobox);

export { Combobox };
