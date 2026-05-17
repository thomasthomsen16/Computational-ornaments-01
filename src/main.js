import p5 from 'p5';

// p5 instance mode: all p5 functions live on `p` instead of globally.
// This is required when using a bundler like Vite.
new p5((/** @type {import('p5')} */ p) => {

  // sessionSeed makes randomness differ on each page load,
  // while staying stable within a session (see drawArcCircle).
  let sessionSeed = 0;

  let spacing = 100; // pixels between circle centers in the grid

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    // Math.random() is unseeded, so it gives a different value every page load.
    sessionSeed = Math.random() * 100000;
    p.background(255);
  };

  p.draw = () => {
    p.background(255);
    p.noFill();

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
    let arcSize = 50;

    // Seeding with position + sessionSeed makes each circle's size unique and
    // stable per session — same x/y always produces the same random values.
    p.randomSeed(x * 1000 + y + sessionSeed);

    // Generate one random size per arc (width = height, so arcs stay circular).
    const s = Array.from({ length: 4 }, () => arcSize + p.random(10, 50));

    p.push();
    p.translate(x, y);           // move origin to circle center
    p.rotate(p.frameCount * 0.01); // spin around that center; frameCount drives time

    // Arcs drawn at (0,0) — which is now the rotated circle center.
    p.arc(0, 0, s[0], s[0], 0, p.HALF_PI);
    p.arc(0, 0, s[1], s[1], p.HALF_PI, p.PI);
    p.arc(0, 0, s[2], s[2], p.PI, p.PI + p.QUARTER_PI);
    p.arc(0, 0, s[3], s[3], p.PI + p.QUARTER_PI, p.TWO_PI);

    p.pop(); // restore transform so the next circle is unaffected
  }

  // Keep canvas full-screen when the window is resized.
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});