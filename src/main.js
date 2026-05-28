import p5 from 'p5';

// p5 instance mode: all p5 functions live on `p` instead of globally.
// This is required when using a bundler like Vite.
new p5((/** @type {import('p5')} */ p) => {

  // sessionSeed makes randomness differ on each page load,
  // while staying stable within a session (see drawArcCircle).
  let sessionSeed = 0;

  let spacing = 100;   // pixels between circle centers in the grid
  let arcSize = 50;    // base diameter of each arc; actual size = arcSize + random(10, 50)
  let arcMaxSize = arcSize + 50; // largest a circle can be
  let squarePadding = 25; // padding inside the border square

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    // Math.random() is unseeded, so it gives a different value every page load.
    sessionSeed = Math.random() * 100000;
    p.background(255);
  };

  p.draw = () => {
    p.background(255);
    p.noFill();

    // The square wraps the full grid: 2 spacings across + one max circle diameter on each side.
    
    let squareSize = 2 * spacing + arcMaxSize + squarePadding * 2;
    p.push()
    p.stroke(0);
    p.strokeWeight(5);
    p.rectMode(p.CENTER);
    p.rect(p.width / 2, p.height / 2, squareSize, squareSize);
    p.pop()

    // Draw a 3x3 grid of circles, centered on the canvas.
    // i controls the column (x), j controls the row (y).
    // Subtracting 1 from each index shifts [0,1,2] to [-1,0,1],
    // so the grid is symmetric around the canvas center.
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        drawArcCircle(p.width / 2 + (i - 1) * spacing, p.height / 2 + (j - 1) * spacing);
      }
    }
  };

  /**
   * Draws a circle made of 4 arcs, each with a randomized but stable size.
   * The circle is divided into four quadrants (0–90°, 90–180°, 180–270°, 270–360°).
   * @param {number} x
   * @param {number} y
   */
  function drawArcCircle(x, y) {
    // Seeding with position + sessionSeed makes each circle's size unique and
    // stable per session — same x/y always produces the same random values.
    p.randomSeed(x * 1000 + y + sessionSeed);

    // Generate one random size per arc (width = height, so arcs stay circular).
    // s holds diameters, so we pass s/2 (radius) into drawNoisyArc.
    const s = Array.from({ length: 4 }, () => arcSize + p.random(10, 50));

    p.push();
    p.translate(x, y);           // move origin to circle center
    p.rotate(p.frameCount * 0.01); // spin around that center; frameCount drives time

    // Slow time value passed to noise so the wobble drifts gradually.
    const t = p.frameCount * 0.02;

    // x and y (original canvas position) are passed as unique offsets into the
    // noise field, so each circle gets its own wobble pattern.
    drawNoisyArc(s[0] / 2, 0,             p.HALF_PI,              x, y, t);
    drawNoisyArc(s[1] / 2, p.HALF_PI,     p.PI,                   x, y, t);
    drawNoisyArc(s[2] / 2, p.PI,          p.PI + p.QUARTER_PI,    x, y, t);
    drawNoisyArc(s[3] / 2, p.PI + p.QUARTER_PI, p.TWO_PI,         x, y, t);

    p.pop(); // restore transform so the next circle is unaffected
  }

  /**
   * Draws a single arc using Perlin noise to displace each point's radius,
   * producing an organic, wobbly line instead of a smooth curve.
   * @param {number} radius   - base radius of the arc
   * @param {number} startAngle
   * @param {number} endAngle
   * @param {number} cx       - canvas x of the circle (for unique noise per circle)
   * @param {number} cy       - canvas y of the circle
   * @param {number} t        - time offset so the wobble animates over time
   */
  function drawNoisyArc(radius, startAngle, endAngle, cx, cy, t) {
    const steps = 70;       // number of points sampled along the arc
    const noiseScale = 0.9; // how tightly the noise varies along the arc; lower = broader waves
    const noiseAmt = 20;    // max pixel displacement inward or outward from the base radius

    p.beginShape();
    for (let i = 0; i <= steps; i++) {
      // Map step index to an angle between start and end.
      const a = p.map(i, 0, steps, startAngle, endAngle);

      // p.noise() returns a smooth value in [0, 1].
      // Three inputs: angle position along the arc, unique circle offset, and time.
      const n = p.noise(a * noiseScale + cx * 0.01, cy * 0.01, t);

      // Shift noise from [0,1] to [-noiseAmt, +noiseAmt] and add to radius.
      const r = radius + p.map(n, 0, 1, -noiseAmt, noiseAmt);

      p.vertex(r * Math.cos(a), r * Math.sin(a));
    }
    p.endShape();
  }

  // Keep canvas full-screen when the window is resized.
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});