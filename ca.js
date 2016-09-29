function initialize(w) {
	for (i=0; i<w.length; i++) {
		w[i] = Math.floor(Math.random() * 256);
	}
}

function sparseInitialize(w, rows, col_bytes, chance) {
	for (i=0; i<rows; i++) {
		for (j=0; j<col_bytes*8; j++) {
			if (Math.random() < chance) {
				setBitAt(w, i, j, 1);
			} else {
				setBitAt(w, i, j, 0)
			}
		}
	}
}

function byteString(n) {
  if (n < 0 || n > 255 || n % 1 !== 0) {
      throw new Error(n + " does not fit in a byte");
  }
  return ("000000000" + n.toString(2)).substr(-8);
}

function printBits(w) {
	var pview = "";
	var i=0;
	while (i<w.length) {
		pview += byteString(w[i++]);
		if (i % WORLD_COLS_IN_BYTES == 0) {
			pview += "\n";
		}
	}
	console.log(pview);
}

function bitsAround(w, row, col) {
	b = '';
	b += bitAt(w, row-1, col-1);
	b += bitAt(w, row-1, col);
	b += bitAt(w, row-1, col+1);
	b += bitAt(w, row, col+1);
	b += bitAt(w, row+1, col+1);
	b += bitAt(w, row+1, col);
	b += bitAt(w, row+1, col-1);
	b += bitAt(w, row, col-1);
	return parseInt(b, 2);
}

function bitAt(w, r, c) {
	var n = r * WORLD_COLS_IN_BYTES + Math.floor(c / 8);
	if (n<0 || n>w.length) {
		return 0;
	}
	return (w[n] >> (7-(c%8))) & 1;
}

function setBitAt(w, r, c, b) {
	var n = r * WORLD_COLS_IN_BYTES + Math.floor(c / 8);
	if (n<0 || n>w.length) {
		return;
	}
	var t = (0 | b) << (7-(c%8));
	w[n] = w[n] | t;
}

function draw(w, el) {
	c = el.getContext("2d");
	width = el.width;
	height = el.height;
	imageData = c.createImageData(width, height);

	for (i=0; i<height; i++) {
		for (j=0; j<width; j++) {
			b = bitAt(w,i,j);
			index = (i * width + j) * 4;
			if (b > 0) {
				imageData.data[index+0] = 0;
				imageData.data[index+1] = 0;
				imageData.data[index+2] = 0;
			} else {
				imageData.data[index+0] = 255;
				imageData.data[index+1] = 255;
				imageData.data[index+2] = 255;
			}
			imageData.data[index+3] = 255;
		}
	}

	c.putImageData(imageData, 0, 0);
}

function drawGrayScale(w, el) {
	c = el.getContext("2d");
	width = el.width;
	height = el.height;
	imageData = c.createImageData(width, height);

	for (i=0; i<height; i++) {
		for (j=0; j<width; j++) {
			b = w[i*width+j]
			index = (i * width + j) * 4;
			imageData.data[index+0] = b;
			imageData.data[index+1] = 0;
			imageData.data[index+2] = 0;
			imageData.data[index+3] = 255;
		}
	}

	c.putImageData(imageData, 0, 0);
}

function nextEpoch(w0, r) {
	var w1 = new Uint8Array(WORLD_ROWS*WORLD_COLS_IN_BYTES);
	for (i=0; i<WORLD_ROWS; i++) {
		for (j=0; j<WORLD_COLS_IN_BYTES*8; j++) {
			b = bitsAround(w0, i, j);
			setBitAt(w1, i, j, r[b]);
		}
	}
	return w1;
}

function randomRule() {
	rule = [];
	for (i=0; i<256; i++) {
		if (Math.random() > 0.5) {
			rule[i] = 1;
		} else {
			rule[i] = 0;
		}
	}
	return rule;
}

function bitEntropy(w)  {
	h =[0, 0];
	for (i=0; i<WORLD_ROWS; i++) {
		for (j=0; j<WORLD_COLS_IN_BYTES*8; j++) {
			h[bitAt(w, i, j)]++;
		}
	}
	
	h = h.map(function(x) { return x / (WORLD_ROWS*WORLD_COLS_IN_BYTES*8); });

	e=0;
	for (i=0; i<h.length; i++) {
		e += h[i] * Math.log2(h[i]);
	}

	return -1 * e;
}

function grayEntropy(w, rows, cols) {
	var h =[];
	for (i=0; i<256; i++) {
		h[i] = 0;
	}

	for (i=0; i<rows; i++) {
		for (j=0; j<cols; j++) {
			h[Math.floor(w[i*rows+j])]++;
		}
	}
	
	h = h.map(function(x) { return x / (rows*cols); });

	e=0;
	for (i=0; i<h.length; i++) {
		if (h[i] > 0) {
			e += h[i] * Math.log2(h[i]);
		}
	}

	return -1 * e;
}