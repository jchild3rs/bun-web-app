import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { Combobox } from "./combobox.client";

const log = require("debug")("test");

spyOn(Combobox.prototype, "fetchSuggestions").mockImplementation(
	async () =>
		`<li role="option" id="option-1">Option 1</li>
	<li role="option" id="option-2">Option 2</li>
	<li role="option" id="option-3">Option 3</li>`,
);

describe("combobox", () => {
	beforeEach(() => {
		document.body.innerHTML = `
		<enhanced-combobox>
			<input type="text" id="test" />
		</enhanced-combobox>
	`;

		// we need to re-define because we mocked something on the prototype.
		customElements.define("enhanced-combobox", Combobox);
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	describe("when focused and down arrow is pressed", () => {
		beforeEach(async () => {
			const combobox = screen.getByRole<HTMLInputElement>("combobox");
			await userEvent.click(combobox);
		});

		describe("when the textbox is not empty", () => {
			it("should move visual focus to the first suggested value", async () => {
				await userEvent.keyboard("test{ArrowDown}");
				const options = await screen.findAllByRole("option");
				expect(options[0].getAttribute("aria-selected")).toBe("true");
			});
		});

		describe("when the textbox is empty", () => {
			it("should open the listbox and move visual focus to the first option", async () => {
				const listbox = screen.getByRole<HTMLUListElement>("listbox", {
					hidden: true,
				});

				await userEvent.keyboard("{ArrowDown}");
				expect(listbox.hidden).toBe(false);
				log(listbox.outerHTML);

				const options = await screen.findAllByRole("option");
				expect(options[0].getAttribute("aria-selected")).toBe("true");
			});
		});

		describe("when alt is pressed", () => {
			it("Opens the listbox without moving focus or changing selection.", () => {
				const listbox = screen.getByRole<HTMLUListElement>("listbox", {
					hidden: true,
				});
				userEvent.keyboard("{AltLeft>}{ArrowDown}{/AltLeft}");
				expect(listbox.hidden).toBe(false);
			});
		});

		describe("in both cases", () => {
			it("should keep DOM focus on the textbox", async () => {
				const combobox = screen.getByRole<HTMLInputElement>("combobox");
				const listbox = screen.getByRole<HTMLUListElement>("listbox", {
					hidden: true,
				});
				await userEvent.click(combobox);
				await userEvent.keyboard(" {ArrowDown}");
				expect(document.activeElement).toBe(combobox);
				expect(document.activeElement).not.toBe(listbox);
			});
		});
	});
});
