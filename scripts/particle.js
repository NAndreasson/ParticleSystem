function Particle(x, y, life, speed, angle, radius, color) {
  this.pos = {
    x: x,
    y: y
  };
  this.dead = false;
  this.startingLife = this.life = life;
  this.startingRadius = this.radius = radius;
  this.color = color;

  var angleInRadians = angle * Math.PI / 180;
  this.velocity = {
    x: speed * Math.cos(angleInRadians),
    y: -speed * Math.sin(angleInRadians)
  };
}

Particle.prototype.update = function(dt) {
  this.life -= dt;

  if (this.life > 0) {
    var ageRatio = this.life / this.startingLife;
    this.radius = this.startingRadius * ageRatio;    
    this.color.a = ageRatio;
    
    this.pos.x += this.velocity.x * dt;
    this.pos.y += this.velocity.y * dt;   
  } else {
    this.dead = true;
  }
};


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
  if (typeof config !== 'undefined') {
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

