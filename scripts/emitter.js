define(['scripts/particle.js'], function(Particle) {
  function Emitter(config) {
    var defaultConfig = {
      color: {
        r: 255,
        g: 255,
        b: 255,
        a: 255
      }
    }

    // extend the default config if one is passed in
    if (config) {
      for (prop in config) {
        if defaultConfig.hasOwnProperty(prop) {
          defaultConfig[prop] = config[prop];
        }
      }
    }

    this.particles = [];
    this.aliveParticles = 0;
  }

  Emitter.prototype.update = function(dt) {
    for (var i = 0; i < this.aliveParticles; i++) {
      // call each particles update method
      var particle = this.particles[i];
      particle.update(dt);
      if (particle.dead === true) {
        // change places 
        if (i !== this.aliveParticles - 1) {
          var tempParticle = this.particles[i];
          this.particles[i] = this.particles[this.aliveParticles - 1];
          this.particles[this.aliveParticles - 1] = tempParticle;
        }
        this.aliveParticles--;
      }
    }
  };

  Emitter.prototype.addParticle = function(particle) {
    // if there is a dead particle erase its data with this
    if (this.aliveParticles < this.particles.length) {
      // set a dead to this 
      this.particles[this.aliveParticles] = particle;
    } else {
      //  push a new
      this.particles.push(particle);
    }
    this.aliveParticles++;
  };

  Emitter.prototype.getAliveParticles = function() {
    return this.aliveParticles;
  };

  return Emitter;
});