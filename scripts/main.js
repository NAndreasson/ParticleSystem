require(['render/renderer', 'particle/emitter'], function(Renderer, Emitter) {


  // shim layer with setTimeout fallback
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();


  var canvas
    , emitter = new Emitter();
    console.log('Renderer', Renderer);
    console.log('Emitter', Emitter);
    console.log('Arguments', arguments);

  function setUpCanvas() {
    canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', addParticles, false);
    canvas.addEventListener('mouseup', stopAddingParticles, false);
    canvas.addEventListener('mousemove', mouseMove, false);
  }

  this.mousePos = { x: 0, y: 0};


  function addNewParticle() {
    console.log('Adding particle');
    console.log(this.mousePos);
    // add a random x offset
    var offset = 80
      , x = this.mousePos.x + (Math.random() * offset - offset / 2)
      , y = this.mousePos.y;

    var red = 200 + Math.random() * 50 - 25;
    var alpha = 155 + Math.random() * 100 - 50;
    var color = {
      r: red / 255,
      g: 0.0 / 255,
      b: 0.0 / 255,
      a: alpha / 255
    };

    var angleVariation = Math.random() * 60 - 60 / 2
      , angle = 90.0 + angleVariation
      , radius = 10 + Math.random() * 10 - 5
      , speed = 150 + Math.random() * 50 - 25;
    this.emitter.addParticle(new Particle(x, y, 5, speed, angle, radius, color));
  }

  function addParticles() {
    window.particleInterval = setInterval(addNewParticle, 20);
  }

  function stopAddingParticles() {
    clearInterval(window.particleInterval);
  }

  function mouseMove(e) {
    window.mousePos.x = e.offsetX;
    window.mousePos.y = e.offsetY;
  }

  Renderer.renderer('canvas', 'vshader', 'fshader');
  var startTime = Date.now();
  (function animloop(timestamp){
    var dt = (timestamp - startTime) / 1000;
    startTime = Date.now();
    requestAnimFrame(animloop);
    // update particle system
    emitter.update(dt);
    Renderer.draw();
  })();
});