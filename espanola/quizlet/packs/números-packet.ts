import { nums } from "./nums";

let qa = nums.map(v => ({ a: v.es, q: v.en }));
[1, 2, 5].forEach(a =>
	[0, 0, 0]
		.map(v => Math.floor((nums.length - a) * Math.random()))
		.forEach(b =>
			qa.push({
				a: `${nums[a].es} más ${nums[b].es} son ${nums[a + b].es}`,
				q: `${nums[a].en} plus ${nums[b].en} are ${nums[a + b].en}`
			})
		)
);

export = qa;
