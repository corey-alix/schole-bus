export interface Dictionary<T> {
	[Key: string]: T;
}

export class EventDispatcher<T> {
	constructor() {
		this.events = {};
	}
	events: Dictionary<Array<(data: T | null) => void>>;

	on(event: string, callback: (data: T | null) => void) {
		this.events[event] = this.events[event] || [];
		this.events[event].push(callback);
		// inefficient way of removing the callback
		return () => (this.events[event] = this.events[event].filter(c => c != callback));
	}

	trigger(event: string, data?: T) {
		if (!this.events) return;
		var handlers = this.events[event];
		if (!handlers) return;
		handlers.forEach(h => h(data || null));
	}
}

export class SystemEvents {
	static events = new EventDispatcher<any>();

	static trigger<T>(name: string, value: T) {
		SystemEvents.events.trigger(name, value);
	}

	static watch(name: string, cb: (value: any) => void) {
		return SystemEvents.events.on(name, cb);
	}
}
