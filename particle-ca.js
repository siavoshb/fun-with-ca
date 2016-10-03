function randomWorld(params) {
	var laws = {};
	laws.particleTypes = params.particle_types;
	laws.bonds = [];
	for (i=0; i<params.particle_types; i++) {
		for (j=i; j<params.particle_types; j++) {
			b = Math.floor(Math.random() * params.bond_strengths);
			laws.bonds[i*params.particle_types+j] = b;
			laws.bonds[j*params.particle_types+i] = b;
		}
	}

	return laws;
}

function initialPopulation(params) {
	var population = [];
	for (i=0; i<params.population_count; i++) {
		population[i] = randomWorld(params)
	}

	return population;
}

function initialWorld(laws, params) {
	var world = [];
	for (i=0; i<params.initial_particle_count; i++) {
		/* Particle definition:

		*/
		world[i] = {
			p: [ Math.floor(Math.random() * laws.particleTypes) ],
			e: 0
		}
	}
	return world;
}

function fitness(world) {
	return 0;
}

function collide(p1, p2) {
	/*
		possibile outcomes:
			p1 + p2 (join)
			p1, p2 (nothing)
			p_0, p_1, ..., p_k
	*/

	return p1.concat(p2);
}

function tick(laws, world) {
	var next_world = [];
	while (world.length > 1) {
		p1 = world.splice(Math.floor(Math.random() * world.length), 1);
		p2 = world.splice(Math.floor(Math.random() * world.length), 1);
		next_world = next_world.concat(collide(p1, p2))
	}

	if (world.length == 1) {
		next_world = next_world.concat(world[0]);
	}

	return next_world;
}

function tickAll(laws, world, params) {
	for (i=0; i<params.tick_count; i++) {
		world = tick(laws, world);
	}

	return world;
}

function compareLaws(laws1, laws2) {
	if (laws1.score < laws2.score)
    	return -1;
  	if (laws1.score > laws2.score)
    	return 1;
  	return 0;
}

function searchForHabitableWorlds(params) {
	var populationOfLaws = initialPopulation(params);
	for (i=0; i<populationOfLaws.length; i++) {
		world = initialWorld(populationOfLaws[i], params);
		world = tickAll(populationOfLaws[i], world_first, params);
		populationOfLaws[i].score = fitness(world);
	}

	populationOfLaws.sort(compareLaws);
	// TODO asc or desc


}


// --------------------------------------

var params = {
	particle_types: 2,
	bond_strengths: 3,
	initial_particle_count: 10,
	tick_count: 10,
	epoch_count: 10,
	population_count: 100
}

var laws = randomWorld(params);
console.log("Laws: " + JSON.stringify(laws));

var w = initialWorld(laws, params);
console.log("w0: " + JSON.stringify(w));
w = tickAll(laws, w, params);
console.log("w"+(params.tick_count-1)+": " + JSON.stringify(w));
