function randomWorld(particle_types, bond_strengths) {
	var laws = {};
	laws.particleTypes = particle_types;
	laws.bonds = [];
	for (i=0; i<particle_types; i++) {
		for (j=i; j<particle_types; j++) {
			b = Math.floor(Math.random() * bond_strengths);
			laws.bonds[i*particle_types+j] = b;
			laws.bonds[j*particle_types+i] = b;
		}
	}

	return laws;
}

function initialWorld(laws, count) {
	var world = [];
	for (i=0; i<count; i++) {
		world[i] = {
			p: [ Math.floor(Math.random() * laws.particleTypes) ],
			e: 0
		}
	}
	return world;
}

function collide(p1, p2) {
	/*
		possibile outcomes:
			p1 + p2 (join)
			p1, p2 (nothing)
			p_0, p_1, ..., p_k
	*/

	var particles = [p1, p2];

	return particles;

}

function tick(laws, world) {
	next_world = [];
	while (world.length > 1) {
		p1 = world.splice(Math.floor(Math.random() * world.length), 1);
		p2 = world.splice(Math.floor(Math.random() * world.length), 1);
		next_world.concat(collide(p1, p2))
	}

	if (world.length == 1) {
		next_world.concat(world);
	}

	return next_world;
}

function tickAll(laws, world, tick_count) {
	for (i=0; i<tick_count; i++) {
		world = tick(laws, world);
	}

	return world;
}

// --------------------------------------

var PARTICLE_TYPES = 2;
var BOND_STRENGTHS = 2;
var INITIAL_PARTICLE_COUNT = 10;
var TICK_COUNT = 10;

var laws = randomWorld(PARTICLE_TYPES, BOND_STRENGTHS);
console.log("Laws: " + JSON.stringify(laws));

var w = initialWorld(laws, INITIAL_PARTICLE_COUNT);
console.log("w0: " + JSON.stringify(w));
w = tickAll(laws, w, TICK_COUNT);
console.log("w"+(TICK_COUNT-1)+": " + JSON.stringify(w));
