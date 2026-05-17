import p5 from 'p5';

new p5((/** @type {import('p5')} */ p) => {

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
    diameters = Array.from({ length: 5 }, () => 100 + p.random(-20, 20));
  };

  p.draw = () => {

  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
