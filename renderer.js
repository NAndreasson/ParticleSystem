function Renderer(canvasId, vShaderId, fShaderId) {
  var canvas = document.getElementById(canvasId);
  this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!this.gl) {
    alert('Your browser seems to not support webgl');
  } else {
    // set the clear color to black with 100% visibility
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
    this.gl.enable(this.gl.BLEND);
    this.program = this.gl.createProgram();
    // get shaders
    initShaders(this.program, vShaderId, fShaderId);

    this.gl.linkProgram(this.program);
    this.gl.useProgram(this.program);
    
    this.particleVertexBuffer = this.gl.createBuffer();
    this.particleColorBuffer = this.gl.createBuffer();
    this.particleRadiusBuffer = this.gl.createBuffer();

    this.positionAttrPtr = this.gl.getAttribLocation(this.program, "a_position");
    this.radiusAttrPtr = this.gl.getAttribLocation(this.program, 'radius');
    this.colorAttrPtr = this.gl.getAttribLocation(this.program, "color");
    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();

    var particleTextureData = createTextureData();
    this.particleTexture = loadTexture(particleTextureData);
  }

}


function initShaders(program, vShaderId, fShaderId) {
  var vShaderDom = document.getElementById(vShaderId),
      vShaderCode = loadShader(vShaderDom),
      vShader = this.gl.createShader(this.gl.VERTEX_SHADER);
  this.gl.shaderSource(vShader, vShaderCode);
  this.gl.compileShader(vShader);


  var fShaderDom = document.getElementById(fShaderId),
      fShaderCode = loadShader(fShaderDom),
      fShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
  this.gl.shaderSource(fShader, fShaderCode);
  this.gl.compileShader(fShader);

  this.gl.attachShader(program, vShader);
  this.gl.attachShader(program, fShader);
}


  function loadShader(script){  
    var code = "";  
    var currentChild = script.firstChild;  
    while (currentChild) {  
      if(currentChild.nodeType == currentChild.TEXT_NODE)  
        code += currentChild.textContent;  
        currentChild = currentChild.nextSibling;  
    }  
    return code;  
  }  


  function draw() {
    //this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
    mat4.identity(this.mvMatrix);

    var resolution = gl.getUniformLocation(this.program, "u_resolution");
    gl.uniform2f(resolution, 800, 600);
    
    var vertices = [],
        radius = [],
        colors = [];

    var aliveParticles = this.emitter.getAliveParticles();
    for (var i = 0; i < aliveParticles; i++) {
      // add to vertices 
      var particle = this.emitter.particles[i];
      vertices.push(particle.pos.x, particle.pos.y);
      radius.push(particle.radius);
      colors.push(particle.color.r, particle.color.g, particle.color.b, particle.color.a);
      // add radius
    }

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.particleTexture);

    
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleVertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.positionAttrPtr);
    this.gl.vertexAttribPointer(this.positionAttrPtr, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleRadiusBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(radius), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.radiusAttrPtr);
    this.gl.vertexAttribPointer(this.radiusAttrPtr, 1, this.gl.FLOAT, false, 0, 0);
    

   
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleColorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.colorAttrPtr);
    this.gl.vertexAttribPointer(this.colorAttrPtr, 4, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(this.gl.POINTS, 0, aliveParticles);
    // go through all the added particles and add buffer data 
    // set new buffer data 
    // draw all particles


  }


  function createTextureData() {
    var size = 128;
    var canvasTest = document.createElement('canvas');
        canvasTest.width = canvasTest.height = size;
    var ctx = canvasTest.getContext('2d');
    var radius = size * 0.5;
        
      ctx.beginPath();
      ctx.arc(radius, radius, radius, 0, Math.PI * 2, false);
      ctx.closePath();


      var radGrad = ctx.createRadialGradient(size / 2, size / 2, radius,size / 2,size / 2,0);
      radGrad.addColorStop(0, "rgb(0, 0, 0)");  
      radGrad.addColorStop(1, "rgb(255, 255, 255)"); 
      ctx.fillStyle = radGrad;
      ctx.fill();

    return canvasTest.toDataURL();
  }


function loadTexture(source) {
    var texture = this.gl.createTexture();
  texture.image = new Image();
  var gl = this.gl;
  texture.image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }      
  texture.image.src = source;
  return texture;
}