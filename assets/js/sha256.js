/* SHA-256 em JavaScript puro (funciona também abrindo o arquivo direto, sem https). */
(function () {
  "use strict";
  const primos = [];
  for (let n = 2; primos.length < 64; n++) if (primos.every((p) => n % p)) primos.push(n);
  const frac = (x) => ((x - Math.floor(x)) * 4294967296) >>> 0;
  const K = primos.map((p) => frac(Math.cbrt(p)));
  const H0 = primos.slice(0, 8).map((p) => frac(Math.sqrt(p)));
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));

  function sha256(texto) {
    const bytes = new TextEncoder().encode(texto);
    const l = bytes.length;
    const tam = ((l + 9 + 63) >> 6) << 6;
    const m = new Uint8Array(tam);
    m.set(bytes);
    m[l] = 0x80;
    const dv = new DataView(m.buffer);
    dv.setUint32(tam - 8, Math.floor((l * 8) / 4294967296));
    dv.setUint32(tam - 4, (l * 8) >>> 0);
    const H = H0.slice();
    const w = new Uint32Array(64);
    for (let i = 0; i < tam; i += 64) {
      for (let t = 0; t < 16; t++) w[t] = dv.getUint32(i + t * 4);
      for (let t = 16; t < 64; t++) {
        const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let t = 0; t < 64; t++) {
        const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + w[t]) >>> 0;
        const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      [a, b, c, d, e, f, g, h].forEach((v, k) => (H[k] = (H[k] + v) >>> 0));
    }
    return H.map((x) => x.toString(16).padStart(8, "0")).join("");
  }

  window.sha256 = sha256;
})();
