var tools = require("./ca-node.js");

function seedNewGeneration(best, pop_size) {
	np = [];

	for (i=0; i<pop_size; i++) {
		boy_rule = best[Math.floor(best.length * Math.random())].rule;
		girl_rule = best[Math.floor(best.length * Math.random())].rule;

		start_cut_index = Math.floor(boy_rule.length * Math.random());
		end_cut_index = -1;
		while (end_cut_index < start_cut_index) {
			end_cut_index = Math.floor(boy_rule.length * Math.random());
		}

		new_rule = boy_rule.slice(0,start_cut_index)
					.concat(girl_rule.slice(start_cut_index, end_cut_index))
					.concat(boy_rule.slice(end_cut_index, boy_rule.length));

		mutate_bit_count = Math.floor(Math.random() * (0.20 * new_rule.length));
		for (m=0; m<mutate_bit_count; m++) {
			mutate_index =  Math.floor(new_rule.length * Math.random());
			if (new_rule[mutate_index] > 0) {
				new_rule[mutate_index] = 0;
			} else {
				new_rule[mutate_index] = 1;
			}
		}

		np[i] = new_rule;
	}

	return np;
}

function randomPopulation(count) {
	var p_map = {};
	var population = [];
	r = 0;
	while (r<count) {
		new_rule = tools.randomRule();
		key = new_rule.join("").toString();
		if (!(key in p_map)) {
			population[r++] = new_rule;
			p_map[key] = 1;
		}
	}

	return population;
}

function escore(e_large, e_small) {
	return e_large - 2*e_small;
}

function main() {
	var WORLD_ROWS = 200;
	var WORLD_COLS_IN_BYTES = 40;

	var POPULATION_SIZE = 2000;
	var BEST_POPULATION_SIZE = 200;
	var EPOCHS_FOR_RULE = 50;
	var GENERATIONS = 150;

	var LOW_ENTROPY_SCALE_K = 20; // low entropy at small scales
	var HIGH_ENTROPY_SCALE_K = 60; // we want high entorpy at large scales

	var population = randomPopulation(POPULATION_SIZE);

	var best_population = [];

	for (g=0; g<GENERATIONS; g++) {
		for (p=0; p<population.length; p++) {
			var world = new Uint8Array(WORLD_ROWS*WORLD_COLS_IN_BYTES);
			tools.initialize(world);
			
			for (i=0; i<EPOCHS_FOR_RULE; i++) {
				world = tools.nextEpoch(world, population[p], WORLD_ROWS, WORLD_COLS_IN_BYTES);
			}
			
			integral_image = tools.integralImage(world, WORLD_ROWS, WORLD_COLS_IN_BYTES);

			world_small_scaled = tools.scaleEntropyOfBitWorld(integral_image, WORLD_ROWS, WORLD_COLS_IN_BYTES, LOW_ENTROPY_SCALE_K);
			en_small = tools.gray256Entropy(world_small_scaled, WORLD_ROWS-LOW_ENTROPY_SCALE_K, WORLD_COLS_IN_BYTES*8-LOW_ENTROPY_SCALE_K)

			world_large_scaled = tools.scaleEntropyOfBitWorld(integral_image, WORLD_ROWS, WORLD_COLS_IN_BYTES, HIGH_ENTROPY_SCALE_K);
			en_large = tools.gray256Entropy(world_small_scaled, WORLD_ROWS-HIGH_ENTROPY_SCALE_K, WORLD_COLS_IN_BYTES*8-HIGH_ENTROPY_SCALE_K)
			

			composite_score = escore(en_large, en_small);

//			console.log(g+"."+p + " small: " + en_small + " large: " + en_large + " with composite score " + composite_score)
			
			if (best_population.length < BEST_POPULATION_SIZE) {
				best_population[best_population.length] = {
					rule: population[p],
					small_scale_entropy: en_small,
					large_scale_entropy: en_large
				}
			} else {
				better_entropies_index = -1;
				for (j=0; j<best_population.length; j++) {

					cold = escore(best_population[j].large_scale_entropy, best_population[j].small_scale_entropy);

					if (cold < composite_score) 
					{
						better_entropies_index = j;
					}
				}
				if (better_entropies_index > -1) {
					best_population[better_entropies_index].small_scale_entropy = en_small;
					best_population[better_entropies_index].large_scale_entropy = en_large;
					best_population[better_entropies_index].rule = population[p];
				}
			}
		}

		var best_rule = [];
		var best_score = -99999999999;
		for (t=0; t<best_population.length; t++) {
			ss = (best_population[t].large_scale_entropy - best_population[t].small_scale_entropy)
			if (best_score < ss) {
				best_score = ss;
				best_rule = best_population[t].rule;
			}
		}

		console.log("gen " + g + " with best score " + best_score)
		console.log(JSON.stringify(best_rule))

		population = seedNewGeneration(best_population, Math.floor(POPULATION_SIZE*0.80))
		population = population.concat(randomPopulation(POPULATION_SIZE-population.length));
		population = population.concat(best_population)
	}
}

main();
