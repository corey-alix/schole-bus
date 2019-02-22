class Mapping {
	get(ev: KeyboardEvent): string {
		if (ev.key) return ev.key;
		return String.fromCharCode(ev.keyCode);
	}
}

export let mapping = new Mapping();
