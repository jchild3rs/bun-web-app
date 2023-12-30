{
	const searchForms = document.getElementsByClassName(
		"search-form",
	) as HTMLCollectionOf<HTMLFormElement>;

	for (const searchForm of [...Object.values(searchForms)]) {
		const searchInput = searchForm.firstElementChild as HTMLInputElement;

		searchForm.addEventListener("submit", (event) => {
			if (!searchForm.checkValidity()) {
				searchInput.reportValidity();
				event.preventDefault();
			}
		});
	}
}
