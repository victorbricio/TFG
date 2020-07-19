
class Circunferencia {
  constructor(a1, b1, a2, b2, ctx, sentido, centro, radio){
    this.puntoA = {x: a1, y: b1};
    this.puntoB = {x: a2, y: b2};
    this.ctx = ctx;
    this.sentido = sentido

    // Disco de Poincaré
    this.centroPoincare = centro;
    this.radioPoincare = radio

    // Centro de la circunferencia
    this.centro = {x: (this.puntoA.x + this.puntoB.x) / 2 + this.sentido * Math.sqrt(3) / 2 * (this.puntoB.y - this.puntoA.y),
                   y: (this.puntoA.y + this.puntoB.y) / 2 + this.sentido * Math.sqrt(3) / 2 * (this.puntoA.x - this.puntoB.x)};

    var parteX2 = (this.centro.x - this.puntoA.x) * (this.centro.x - this.puntoA.x);
    var parteY2 = (this.centro.y - this.puntoA.y) * (this.centro.y - this.puntoA.y);

    // Radio de la circunferencia
    this.radio = Math.sqrt(parteX2 + parteY2);
  }

  discriminant(){
    var t = this.radio * this.radio - this.radioPoincare * this.radioPoincare -
        this.centro.x  * this.centro.x + this.centroPoincare.x * this.centroPoincare.x -
        this.centro.y * this.centro.y + this.centroPoincare.y * this.centroPoincare.y;
    var u = this.centroPoincare.y - this.centro.y;
    var v = this.centroPoincare.x - this.centro.x;

    var a = 1 + (u * u) / (v * v);
    var b = u * (t - 2 * v * this.centro.x) / (v * v) + 2 * this.centro.y;
    var c = (t - 2 * v * this.centro.x) * (t - 2 * v * this.centro.x) / (4 * v * v) + this.centro.y * this.centro.y - this.radio * this.radio;

    var disc = b * b - 4 * a * c;
    console.log(b);

    return disc > 0;
  }

  angle(cx, cy, x, y) {
     var dx = x - cx;
     var dy = y - cy;
     var theta = Math.atan2(dy, dx); // range (-PI, PI]

     if (theta < 0)
        theta += 2 * Math.PI
     return theta;
   }

  draw(){
    var t1 = this.angle(this.centro.x, this.centro.y, this.puntoA.x, this.puntoA.y);
    var t2 = this.angle(this.centro.x, this.centro.y, this.puntoB.x, this.puntoB.y);

    var maxt, mint;

    if (t1 < t2){
      maxt = t2;
      mint = t1;
    }

    else {
      maxt = t1;
      mint = t2;
    }

    this.ctx.beginPath();

    if (maxt - mint < Math.PI){
      for (let t = mint; t < maxt; t = t + 0.01){

        var x = this.radio * Math.cos(t) + this.centro.x;
        var y = this.radio * Math.sin(t) + this.centro.y;

        if (t == mint){
          this.ctx.moveTo(x, y);
        }

        else {
          this.ctx.lineTo(x, y);
        }
      }
    }

    else {
      for (let t = maxt; t < 2 * Math.PI; t = t + 0.01){

        var x = this.radio * Math.cos(t) + this.centro.x;
        var y = this.radio * Math.sin(t) + this.centro.y;

        if (t == maxt){
          this.ctx.moveTo(x, y);
        }

        else {
          this.ctx.lineTo(x, y);
        }
      }

      for (let t = 0; t < mint; t = t + 0.01){

        var x = this.radio * Math.cos(t) + this.centro.x;
        var y = this.radio * Math.sin(t) + this.centro.y;

        this.ctx.lineTo(x, y);
      }
    }



    this.ctx.strokeStyle = 'Black';
    this.ctx.stroke();
  }

  drawable(){
    var drawn = false;
    if (this.discriminant()){
      this.draw();
      drawn = true;
    }

    return drawn;
  }
}
