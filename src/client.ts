{
	const toggleDarkModeClass = (isDarkMode: boolean) => {
		if (isDarkMode) {
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
		}
	};

	const prefersDarkMediaQuery = window.matchMedia(
		"(prefers-color-scheme: dark)",
	);

	toggleDarkModeClass(prefersDarkMediaQuery.matches);

	prefersDarkMediaQuery.addEventListener("change", (event) => {
		toggleDarkModeClass(event.matches);
	});
}
