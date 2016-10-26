# fun-with-ca

* Ultimate goal *
1. Detect rule-sets that give rise to self reproducing CA
http://sjsu.rudyrucker.com/~shruti.parihar/paper/

## Cool stuff
https://www.reddit.com/r/cellular_automata/
https://www.youtube.com/channel/UCZD4RoffXIDoEARW5aGkEbg

## Fitness Measures Thoughts/Issues/Proposals
1. Composite, weighted, scaled entropy does not capture 'emergence'
2. What seems to happen is the end-state is high entropy/white-noise. Even if start with just a few seeds, instead of high entropy, leads to noise.

Two paths:
- a few seeds in low entropy/dead world -> low entropy/live world
- high entropy/dead world -> high entropy/live world 
What do both these end states look like?

3. Measure growth or decline of entropy as a function of time
4. Go back to thermodynamic definition of life:
http://www.scientificamerican.com/article/a-new-physics-theory-of-life/
https://en.wikipedia.org/wiki/Stochastic_cellular_automaton
https://en.wikipedia.org/wiki/Entropy_and_life
http://bigthink.com/ideafeed/mit-physicist-proposes-new-meaning-of-life
https://www.researchgate.net/profile/Armando_Azua/publication/259436547_The_potential_for_detecting_'life_as_we_don't_know_it'_by_fractal_complexity_analysis/links/53ff72260cf29dd7cb521366.pdf
5. Image analysis, thresholding etc: For each time frame t in rules evolution; mean the image using NxN window, and get variance; threshold only spikes - convert to binary image count number pixels

## Bugs
1. Best score is not always kept across generations
2. World seems to wrap? maybe it should, but right now it's a bug!

## Resources
http://psoup.math.wisc.edu/mcell/pow.html
https://oroboro.com/portable-threads-and-Mutexes/

Chemical Stochastic CA's
http://www.vcu.edu/csbc/bbsi/inst/courses/courses-2005/Automata/CellularAutomata.pdf
https://mitpress.mit.edu/sites/default/files/titles/alife/0262297140chap51.pdf

wolfram CA:
http://www.stephenwolfram.com/publications/cellular-automata-complexity/pdfs/two-dimensional-cellular-automata.pdf

--- Artificial Chemistries ---

self replicating sequences of binary numbers:
http://www.sciencedirect.com/science/article/pii/089812219390046X
http://ac.els-cdn.com/089812219390046X/1-s2.0-089812219390046X-main.pdf?_tid=2a8d84b2-8ab2-11e6-ac3f-00000aab0f02&acdnat=1475641037_5e36fcdd2e502700708b65493321bcf2

AC intro video
https://www.youtube.com/watch?v=-JDFdIztGk0

Hutton - molecules:
http://www.cc.gatech.edu/~turk/bio_sim/articles/hutton_rep_molecules.pdf

The Creation of Novelty in Artificial Chemistries
http://www.alife.org/alife8/proceedings/sub1082.pdf

AC - review
http://www.cs.mun.ca/~banzhaf/papers/alchemistry_review_MIT.pdf

github blog platform:
https://pages.github.com/


## Ideas

1. Reduce search space. Limit the space of the rule set; ex, ignore rotations/symetries of bit mask; ie all start/end points are the same.
Ex.  100 is same as 010 and 001?
2. Add more cross-over operations

## Next stages?
1. Create a secondary rule set operating on the grid generated at a higher scale of level0; a different color

## References

Different neighborhoods
Moore - https://en.wikipedia.org/wiki/Moore_neighborhood
Von Neuman et al. - https://en.wikipedia.org/wiki/Von_Neumann_neighborhood

## Notes

http://www.cc.gatech.edu/~turk/bio_sim/articles/hutton_rep_molecules.pdf


## Notes on "The Origins of Order"

Intro
Edge of Order and Chaos; revisit k window entropy measure: low < life < high or high < life < low ?

pg. 67
"The model suggests at least one means of mitigating the conflicting-constraints complexity crisis. If the number of epistatic interactions K remains small while N increases, landscapes retain high accessible local optima. This is a first hint of something like a construction requirement to make complex systems with many interacting parts which remain perfectibe by mutation and selection. Each part should directly impinge on rather few other parts." 

Point: given 'genotype', reduce coupling K, ie keep dimensions un-corellated.

pg. 102
Model, RNA experiment [Fontana and Schuster 1987].
Fitness measures of binary RNA string:
1. Thermodynamic - stability of the folded strand and so is proportional to the total fraction of the N bits which are bonded on the folded strand.
2. Kinetic - a more complex rule; suppose the rate of replication of a string is increaed in open, unbonded regions but the loss of stability in these regions leads to easier degradation of the molecule; mix of ease of replication and resistance to degradation

# Visualization libraries
https://github.com/VincentGarreau/particles.js/
https://p5js.org/examples/simulate-l-systems.html
