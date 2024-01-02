const id = "search-form-input";
// class="${css({
// 	outline: "none",
// 	height: "40px",
// 	px: 2,
// 	bg: "neutral.50",
// 	color: "neutral.900",
// })}"

export const searchFormView = ({
	label,
}: {
	label?: string;
} = {}) => {
	return `
<form class="search-form" action="/search">
	<label for="${id}" class="visually-hidden">${label || "Query"}</label>
	<enhanced-combobox 
		endpoint="/partial/search-form-results" 
		navigate-on-select
	>
		<input
			id="${id}"
			type="text"
			placeholder="Search Posts"
			name="query"
			placeholder="Search Posts"  
			required
		/>
	</enhanced-combobox>
	<button tabindex="-1" type="submit">Search</button>
</form>
	`;
};
