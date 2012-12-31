(function() {

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

  this.emitter = new Emitter(),
  this.mousePos = { x: 0, y: 0};

  var canvas = document.getElementById('canvas');
  canvas.addEventListener('mousedown', addParticles, false);
  canvas.addEventListener('mouseup', stopAddingParticles, false);
  canvas.addEventListener('mousemove', mouseMove, false);

  function addParticle() {
    console.log('Adding particle');
    console.log(this.mousePos);
    var x = this.mousePos.x,
        y = this.mousePos.y;

    var color = {
      r: 0.0 / 255,
      g: 0.0 / 255,
      b: 0.0 / 255,
      a: 255.0 / 255
    };
    this.emitter.particles.push(new Particle(x, y, 2000, 0.1, 50, 10, color));
  }

  function addParticles() {
    window.particleInterval = setInterval(addParticle, 50);
  }

  function stopAddingParticles() {
    clearInterval(window.particleInterval);
  }

  function mouseMove(e) {
    window.mousePos.x = e.offsetX;
    window.mousePos.y = e.offsetY;
  }

  Renderer('canvas', 'vshader', 'fshader');
  var startTime = Date.now();
  (function animloop(timestamp){
    var dt = timestamp - startTime;
    startTime = Date.now();
    requestAnimFrame(animloop);
    // update particle system
    emitter.update(dt);
    draw();
  })();

})();
