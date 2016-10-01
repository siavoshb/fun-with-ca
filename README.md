# fun-with-ca

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


## Ideas

1. Reduce search space. Limit the space of the rule set; ex, ignore rotations/symetries of bit mask; ie all start/end points are the same.
Ex.  100 is same as 010 and 001?
2. Add more cross-over operations

## Next stages?
1. Create a secondary rule set operating on the grid generated at a higher scale of level0; a different color
