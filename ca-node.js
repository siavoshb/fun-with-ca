Math.log2 = Math.log2 || function(x){return Math.log(x)*Math.LOG2E;};

module.exports = {

	initialize: function(w) {
		for (i=0; i<w.length; i++) {
			w[i] = Math.floor(Math.random() * 256);
		}
	},

	sparseInitialize: function(w, rows, col_bytes, chance) {
		for (i=0; i<rows; i++) {
			for (j=0; j<col_bytes*8; j++) {
				if (Math.random() < chance) {
					this.setBitAt(w, i, j, 1, col_bytes);
				} else {
					this.setBitAt(w, i, j, 0, col_bytes)
				}

			}
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
		rule = new Uint8Array(256);
		for (z=0; z<256; z++) {
			rule[z] = 2;
		}
		
		for (i=0; i<256; i++) {
			if (rule[i] != 2) {
				continue;
			}

			val = (Math.random() > 0.5) ? 1 : 0;
			rule[i] = val;
			for (j=0; j<8; j++) {
				sym_index = (i >> j) | (i<<(8-j))
				rule[sym_index] = val;
			}
		}

		rr = [];
		for (h=0; h<rule.length; h++)
			rr[h] = rule[h];

		return rr;
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

	scaleEntropyOfBitWorld: function(iw, rows, col_bytes, k) {
		var wk = []

		for (i=0; i<rows-k; i++) {
			for (j=0; j<col_bytes*8-k; j++) {
				wk[i * (col_bytes * 8 - k) + j] = 255 * this.squareSumIntegralImage(iw,i,j,col_bytes*8,k) / (k*k);
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
	},

	integralImage: function(w, rows, col_bytes) {
		iw = [];
		for (i=0; i<rows; i++) {
			for (j=0; j<col_bytes*8; j++) {
				a = this.bitAt(w,i,j,col_bytes);
				b = (i>0) ? iw[(i-1)*col_bytes*8+j] : 0;
				c = (j>0) ? iw[i*col_bytes*8+j-1] : 0;
				d = ((i>0)&&(j>0)) ? iw[(i-1)*col_bytes*8+j-1] : 0;
				iw[i*col_bytes*8+j] = a + b + c - d;
			}
		}
		return iw;
	},

	squareSumIntegralImage: function(iw, r, c, cols, k) {
		a_r = r; a_c = c;
		b_r = r; b_c = c+k;
		c_r = r+k; c_c = c;
		d_r = r+k; d_c = c+k;
		return iw[d_r*cols+d_c] + iw[a_r*cols+a_c] - iw[b_r*cols+b_c] - iw[c_r*cols+c_c];
	}
}