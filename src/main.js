import p5 from 'p5';

new p5((/** @type {import('p5')} */ p) => {
  const arcSize = 50;
  /** @type {number[]} */
  let sizes = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    sizes = Array.from({ length: 4 }, () => arcSize + p.random(10, 50));
    p.background(255);
  };

  p.draw = () => {
    let posX = p.width / 2;
    let posY = p.height / 2;
    p.background(255);
    p.noFill();
    // Bottom-right.
    p.arc(posX, posY, sizes[0], sizes[0], 0, p.HALF_PI);
    // Bottom-left.
    p.arc(posX, posY, sizes[1], sizes[1], p.HALF_PI, p.PI);
    // Top-left.
    p.arc(posX, posY, sizes[2], sizes[2], p.PI, p.PI + p.QUARTER_PI);
    // Top-right.
    p.arc(posX, posY, sizes[3], sizes[3], p.PI + p.QUARTER_PI, p.TWO_PI);
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
