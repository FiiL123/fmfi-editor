document
	.getElementById("save-config-btn")
	.addEventListener("click", function () {
		const partsData = [];
		document.querySelectorAll(".list-group-item").forEach((item) => {
			const partId = item.querySelector("a").href.split("/").pop();
			partsData.push({
				id: partId,
				dx: item.querySelector("#x-offset-number-" + partId).value,
				dy: item.querySelector("#y-offset-number-" + partId).value,
				scale_x: item.querySelector("#x-scale-number-" + partId).value,
				scale_y: item.querySelector("#y-scale-number-" + partId).value,
			});
		});
		fetch("/save-configurations/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ parts: partsData }),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Configuration saved successfully!");
			})
			.catch((error) => console.error("Error:", error));
	});
