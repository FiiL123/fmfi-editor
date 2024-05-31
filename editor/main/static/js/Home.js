import XMLManager from "./XMLManager.js";

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

stage.getContainer().style.backgroundColor = "#ffef00";

var layer = new Konva.Layer();
stage.add(layer);
layer.listening(false);

var part_groups = new Map();
for (let [key, value] of parts.entries()) {
	if (value.level === 0 && value.name !== "virt") {
		let group = new Konva.Group();
		const scale = (value.scale_x + value.scale_y) / 2;
		let xml = new XMLManager(value.xml, group, null, scale);
		group.scale({ x: value.scale_x, y: value.scale_y });
		group.offset({
			x: -(value.dx / value.scale_x),
			y: -(value.dy / value.scale_y),
		});

		console.log(`part: ${value.name}`);
		console.log(group.scale());
		console.log(group.offset());
		console.log(group.getAbsoluteTransform().decompose());
		part_groups.set(key, group);
		layer.add(group);
	}
}
