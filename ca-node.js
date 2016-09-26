Math.log2 = Math.log2 || function(x){return Math.log(x)*Math.LOG2E;};

module.exports = {

	initialize: function(w) {
		for (i=0; i<w.length; i++) {
			w[i] = Math.floor(Math.random() * 256);
		}
	},

	byteString: function(n) {
	  if (n < 0 || n > 255 || n % 1 !== 0) {
	      throw new Error(n + " does not fit in a byte");
	  }
	  return ("000000000" + n.toString(2)).substr(-8);
	},

	printBits: function(w, col_bytes) {
		var pview = "";
		var i=0;
		while (i<w.length) {
			pview += byteString(w[i++]);
			if (i % col_bytes == 0) {
				pview += "\n";
			}
		}
		console.log(pview);
	},

	bitsAround: function(w, row, col, col_bytes) {
		b = '';
		b += this.bitAt(w, row-1, col-1, col_bytes);
		b += this.bitAt(w, row-1, col, col_bytes);
		b += this.bitAt(w, row-1, col+1, col_bytes);
		b += this.bitAt(w, row, col+1, col_bytes);
		b += this.bitAt(w, row+1, col+1, col_bytes);
		b += this.bitAt(w, row+1, col, col_bytes);
		b += this.bitAt(w, row+1, col-1, col_bytes);
		b += this.bitAt(w, row, col-1, col_bytes);
		return parseInt(b, 2);
	},

	bitAt: function(w, r, c, col_bytes) {
		var n = r * col_bytes + Math.floor(c / 8);
		if (n<0 || n>w.length) {
			return 0;
		}
		return (w[n] >> (7-(c%8))) & 1;
	},

	setBitAt: function(w, r, c, b, col_bytes) {
		var n = r * col_bytes + Math.floor(c / 8);
		if (n<0 || n>w.length) {
			return;
		}
		var t = (0 | b) << (7-(c%8));
		w[n] = w[n] | t;
	},

	draw: function(w, el, col_bytes) {
		c = el.getContext("2d");
		width = el.width;
		height = el.height;
		imageData = c.createImageData(width, height);

		for (i=0; i<height; i++) {
			for (j=0; j<width; j++) {
				b = bitAt(w,i,j,col_bytes);
				index = (i * width + j) * 4;
				imageData.data[index+0] = b * 88;
				imageData.data[index+1] = b * 133;
				imageData.data[index+2] = b * 77;
				imageData.data[index+3] = 255;
			}
		}

		c.putImageData(imageData, 0, 0);
	},

	nextEpoch: function(w0, rule, rows, col_bytes) {
		var w1 = new Uint8Array(rows*col_bytes);
		for (i=0; i<rows; i++) {
			for (j=0; j<col_bytes*8; j++) {
				b = this.bitsAround(w0, i, j, col_bytes);
				this.setBitAt(w1, i, j, rule[b], col_bytes);
			}
		}
		return w1;
	},

	randomRule: function() {
		rule = [];
		for (i=0; i<256; i++) {
			if (Math.random() > 0.5) {
				rule[i] = 1;
			} else {
				rule[i] = 0;
			}
		}
		return rule;
	},

	bitEntropy: function(w, rows, col_bytes)  {
		h =[0, 0];
		for (i=0; i<rows; i++) {
			for (j=0; j<col_bytes*8; j++) {
				h[this.bitAt(w, i, j, col_bytes)]++;
			}
		}
		
		h = h.map(function(x) { return x / (rows*col_bytes*8); });

		e=0;
		for (i=0; i<h.length; i++) {
			e += h[i] * Math.log2(h[i]);
		}

		return -1 * e;
	},

	scaleEntropyOfBitWorld: function(w, rows, col_bytes, k) {
		var wk = []
		for (i=0; i<rows-k; i++) {
			for (j=0; j<col_bytes*8-k; j++) {
				
				a = 0;
				for (n=i; n<i+k; n++) {
					for (m=j; m<j+k; m++) {
						a += this.bitAt(w, n, m, col_bytes);
					}
				}
				wk[i * (col_bytes * 8 - k) + j] = 255 * a / (k*k);	
			}
		}

		return wk;
	},

	gray256Entropy: function(w, rows, cols) {
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

}