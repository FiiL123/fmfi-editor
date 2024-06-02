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

stage.getContainer().style.backgroundColor = "#ffefe0";

var layer = new Konva.Layer();
stage.add(layer);
layer.listening(false);

var part_groups = new Map();
renderParts();

function renderParts() {
	for (let [key, value] of part_groups.entries()) {
		if (value) {
			value.destroy();
			part_groups.set(key, null);
		}
	}

	for (let [key, value] of parts.entries()) {
		if (value.level === selectedLevel && value.name !== "virt") {
			let group = new Konva.Group();
			const scale = (value.scale_x + value.scale_y) / 2;
			let xml = new XMLManager(value.xml, group, null, scale);
			group.scale({ x: value.scale_x, y: value.scale_y });
			group.offset({
				x: -(value.dx / value.scale_x),
				y: -(value.dy / value.scale_y),
			});
			part_groups.set(key, group);
			layer.add(group);
		}
	}
}

function setGroupTransform(group, value) {
	group.scale({ x: value.scale_x, y: value.scale_y });
	group.offset({
		x: -(value.dx / value.scale_x),
		y: -(value.dy / value.scale_y),
	});
	console.log({
		x: -(value.dx / value.scale_x),
		y: -(value.dy / value.scale_y),
	});
	console.log(group.offset());
}

function syncPartTransform(source, targetId, partId) {
	const partID = parseInt(partId);
	const target = document.getElementById(targetId);
	target.value = source.value;
	const partGroup = part_groups.get(partID);
	const values = {
		dx: parseInt(document.getElementById("x-offset-number-" + partId).value),
		dy: parseInt(document.getElementById("y-offset-number-" + partId).value),
		scale_x: parseFloat(
			document.getElementById("x-scale-number-" + partId).value,
		),
		scale_y: parseFloat(
			document.getElementById("y-scale-number-" + partId).value,
		),
	};
	setGroupTransform(partGroup, values);
}
window.renderParts = renderParts;
window.syncPartTransform = syncPartTransform;
