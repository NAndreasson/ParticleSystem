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


function Emitter() {
  this.particles = [];

}

Emitter.prototype.update = function(dt) {
  for (var i = 0; i < this.particles.length; i++) {
    // call each particles update method
    var particle = this.particles[i];
    particle.update(dt);
    // if one is dead then unshift it
  }
};