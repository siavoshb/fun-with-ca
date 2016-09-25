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

function main() {
	var WORLD_ROWS = 150;
	var WORLD_COLS_IN_BYTES = 25;

	var POPULATION_SIZE = 1000;
	var BEST_POPULATION_SIZE = 50;
	var EPOCHS_FOR_RULE = 25;
	var GENERATIONS = 500;

	var LOW_ENTROPY_SCALE_K = 5; // low entropy at small scales
	var HIGH_ENTROPY_SCALE_K = 50; // we want high entorpy at large scales

	var population = [];
	for (r=0; r<POPULATION_SIZE; r++) {
		population[r] = tools.randomRule();
	}

	var best_population = [];

	for (g=0; g<GENERATIONS; g++) {
		for (p=0; p<population.length; p++) {
			console.log("a " + p)
			var world = new Uint8Array(WORLD_ROWS*WORLD_COLS_IN_BYTES);
			tools.initialize(world);
			
			for (i=0; i<EPOCHS_FOR_RULE; i++) {
				world = tools.nextEpoch(world, population[p], WORLD_ROWS, WORLD_COLS_IN_BYTES);
			}
			
			//en = tools.bitEntropy(world, WORLD_ROWS, WORLD_COLS_IN_BYTES);
			world_small_scaled = tools.scaleEntropyOfBitWorld(world, WORLD_ROWS, WORLD_COLS_IN_BYTES, LOW_ENTROPY_SCALE_K);
			en_small = tools.gray256Entropy(world_small_scaled, WORLD_ROWS-LOW_ENTROPY_SCALE_K, WORLD_COLS_IN_BYTES*8-LOW_ENTROPY_SCALE_K)

			world_large_scaled = tools.scaleEntropyOfBitWorld(world, WORLD_ROWS, WORLD_COLS_IN_BYTES, HIGH_ENTROPY_SCALE_K);
			en_large = tools.gray256Entropy(world_small_scaled, WORLD_ROWS-HIGH_ENTROPY_SCALE_K, WORLD_COLS_IN_BYTES*8-HIGH_ENTROPY_SCALE_K)

			console.log("en " + en_small + " " + en_large )
			
			if (best_population.length < BEST_POPULATION_SIZE) {
				best_population[best_population.length] = {
					rule: population[p],
					small_scale_entropy: en_small,
					large_scale_entropy: en_large
				}
			} else {
				better_entropies_index = -1;
				console.log("c")
				for (j=0; j<best_population.length; j++) {

					if ((best_population[j].small_scale_entropy > en_small) && 
						(best_population[j].large_scale_entropy < en_large)) 
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

		best_low_entropy = 99;
		best_high_entropy = -1;
		var best_rule = [];
		for (t=0; t<best_population.length; t++) {
			if ((best_population[t].small_scale_entropy < best_low_entropy) 
				&& (best_population[t].large_scale_entropy > best_high_entropy)) {
				best_low_entropy = best_population[t].small_scale_entropy;
				best_high_entropy = best_population[t].large_scale_entropy;
				best_rule = best_population[t].rule;
			}
		}

		console.log("gen " + g + " lowest entropy has low entropy " + best_low_entropy + " and high entropy " + best_high_entropy)
		console.log(JSON.stringify(best_rule))

		population = seedNewGeneration(best_population, POPULATION_SIZE)
	}
}

main();
