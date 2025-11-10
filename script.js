window.addEventListener("DOMContentLoaded", () => {
	const API_BASE = "https://en.wikipedia.org/w/api.php";

	const searchContainer = document.getElementById("search-container");
	const iconBtn = document.getElementById("icon-btn");
	const closeBtn = document.getElementById("close-btn");
	const searchForm = document.getElementById("search-form");
	const searchInput = document.getElementById("search-input");
	const resultsContainer = document.getElementById("results-container");
	const statusMessage = document.getElementById("status-message");
	const searchHint = document.getElementById("search-hint");

	iconBtn.addEventListener("click", () => {
		searchContainer.classList.add("active");
		searchInput.focus();
	});

	closeBtn.addEventListener("click", () => {
		searchContainer.classList.remove("active");

		searchInput.value = "";
		resultsContainer.innerHTML = "";
		statusMessage.textContent = "";
		searchHint.style.display = "block";
	});

	searchForm.addEventListener("submit", (event) => {
		event.preventDefault();
		const query = searchInput.value.trim();

		if (query) {
			resultsContainer.innerHTML = "";
			statusMessage.textContent = "Searching...";
			searchHint.style.display = "none";
			fetchSearchResults(query);
		} else {
			resultsContainer.innerHTML = "";
			statusMessage.textContent = "Please enter a search term.";
		}
	});

	async function fetchSearchResults(query) {
		const params = new URLSearchParams({
			action: "opensearch",
			search: query,
			limit: 10,
			namespace: 0,
			format: "json",
			origin: "*",
		});

		const apiUrl = `${API_BASE}?${params.toString()}`;

		try {
			const response = await fetch(apiUrl);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			displayResults(data);
		} catch (error) {
			console.error("Error fetching Wikipedia data:", error);
			statusMessage.textContent = `Failed to load results: ${error.message}`;
		}
	}

	function displayResults(data) {
		const queryTerm = data[0];
		const titles = data[1];
		const snippets = data[2];
		const links = data[3];

		statusMessage.textContent = "";
		resultsContainer.innerHTML = "";

		if (titles.length === 0) {
			statusMessage.textContent = `No results found for "${queryTerm}".`;
			return;
		}

		titles.forEach((title, index) => {
			const snippet = snippets[index];
			const link = links[index];
			createResultCard(title, snippet, link);
		});
	}

	function createResultCard(title, snippet, link) {
		const card = document.createElement("a");
		card.href = link;
		card.target = "_blank";
		card.rel = "noopener";
		card.className = "result-card";

		card.innerHTML = `
            <h3>${title}</h3>
            <p>${snippet}</p>
        `;

		resultsContainer.appendChild(card);
	}
});
