(function main(doc, win) {
	function toggleDarkModeClass(isDarkMode: boolean) {
		if (isDarkMode) {
			doc.body.classList.add("dark");
		} else {
			doc.body.classList.remove("dark");
		}
	}

	const query = win.matchMedia("(prefers-color-scheme: dark)");
	toggleDarkModeClass(query.matches);
	query.addEventListener("change", (event) => {
		toggleDarkModeClass(event.matches);
	});

})(document, window);
