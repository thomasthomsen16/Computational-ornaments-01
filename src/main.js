import p5 from 'p5';

new p5((/** @type {import('p5')} */ p) => {  
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
  };

  p.draw = () => {
    p.background(0);
    p.fill(255);
    p.noStroke();
    p.rectMode(p.CENTER);
    p.rect(p.width / 2, p.height / 2, 200, 200);
    p.fill(244);
    p.circle(p.width/3, p.height/4, 100);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
