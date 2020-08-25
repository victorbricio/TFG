
class Circunferencia {
  constructor(a1, a2, b1, b2, ctx, centro, radio, color, tamanyo){
    this.puntoA = {x: a1, y: a2};
    this.puntoB = {x: b1, y: b2};
    this.ctx = ctx;
    this.color = color;
    this.tamanyo = tamanyo;

    // Disco de Poincaré
    this.centroPoincare = centro;
    this.radioPoincare = radio;

    this.puntoCprima = {x:-1, y:-1};
    this.puntoFprima = {x:-1, y:-1};

    this.centro = {x:-1, y:-1};
    this.radio = 0;

    this.isDiametro = false;

    this.createHyperbolicLine();
  }

  // Devuelve si la recta es un diámetro
  isDiameter(){
    return this.isDiametro;
  }

  radius(){
    return this.radio;
  }

  center(){
    return this.centro;
  }

  A(){
    return this.puntoA;
  }

  B(){
    return this.puntoB;
  }

  // Pinta una parte de circunferencia con un centro y un radio determinados, solo la parte de menor distancia entre los puntos punto1 y punto2
  draw(centro, radio, punto1, punto2){
    var t1 = angle(centro.x, centro.y, punto1.x, punto1.y);
    var t2 = angle(centro.x, centro.y, punto2.x, punto2.y);

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
      ctx.arc(centro.x, centro.y, radio, mint, maxt, false);
      /*for (let t = mint; t < maxt; t = t + 0.01){

        var x = radio * Math.cos(t) + centro.x;
        var y = radio * Math.sin(t) + centro.y;

        if (t == mint){
          this.ctx.moveTo(x, y);
        }

        else {
          this.ctx.lineTo(x, y);
        }
      }*/
    }

    else {
      ctx.arc(centro.x, centro.y, radio, maxt, mint + 2 * Math.PI, false);
      /*for (let t = maxt; t < mint + 2 * Math.PI; t = t + 0.01){

        var x = radio * Math.cos(t) + centro.x;
        var y = radio * Math.sin(t) + centro.y;

        if (t == maxt){
          this.ctx.moveTo(x, y);
        }

        else {
          this.ctx.lineTo(x, y);
        }
      }*/
    }


    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.tamanyo;
    this.ctx.stroke();
  }

  // Solución mayor de una ecuación de segundo grado
  ecuacion_de_segundo_grado_pos(a, b, c){
    return (- b + Math.sqrt( b * b - 4 * a * c)) / ( 2 * a);
  }

  // Solución mayor de una ecuación de segundo grado
  ecuacion_de_segundo_grado_neg(a, b, c){
    return (- b - Math.sqrt( b * b - 4 * a * c)) / ( 2 * a);
  }

  // Devuelve los puntos de corte entre una recta (determinada por su vector director y un punto) y una circunferencia (determinada por su centro y su radio)
  interseccion_recta_con_circunferencia(vector_recta, punto_recta, centro_circunferencia, radio_circunferencia){
    var coeficienteA = vector_recta.y;
    var coeficienteB = - vector_recta.x;
    var coeficienteC = vector_recta.x * punto_recta.y - vector_recta.y * punto_recta.x;

    if (Math.abs(coeficienteA) > 0.01){
      var t = - coeficienteC - centro_circunferencia.x * coeficienteA;

      var a = 1 + (coeficienteB * coeficienteB) / (coeficienteA * coeficienteA);
      var b = - 2 * t * coeficienteB / (coeficienteA * coeficienteA) - 2 * centro_circunferencia.y;
      var c = t * t / (coeficienteA * coeficienteA) + centro_circunferencia.y * centro_circunferencia.y -
              radio_circunferencia * radio_circunferencia;


      var y1 = this.ecuacion_de_segundo_grado_pos(a, b, c);
      var y2 = this.ecuacion_de_segundo_grado_neg(a, b, c);

      /*console.log(y1);
      console.log(y2);*/

      var x1 = (- coeficienteB * y1 - coeficienteC) / coeficienteA;
      var x2 = (- coeficienteB * y2 - coeficienteC) / coeficienteA;

      /*console.log(x1);
      console.log(y1);
      console.log(x2);
      console.log(y2);*/

      var punto1 = {x: x1, y: y1};
      var punto2 = {x: x2, y: y2};
    }

    else {
      var y = - coeficienteC / coeficienteB;
      var x1 = Math.sqrt(radio_circunferencia * radio_circunferencia - (y - centro_circunferencia.y) * (y - centro_circunferencia.y)) +
              centro_circunferencia.x;
      var x2 = - Math.sqrt(radio_circunferencia * radio_circunferencia - (y - centro_circunferencia.y) * (y - centro_circunferencia.y)) +
              centro_circunferencia.x;

      /*console.log(x1);
      console.log(y);
      console.log(x2);
      console.log(y);*/

      var punto1 = {x: x1, y: y};
      var punto2 = {x: x2, y: y};
    }

    var puntos = {x: punto1, y: punto2};

    return puntos;
  }

  // Devuelve el punto invertido de punto_a_invertir respecto de la circunferencia determinada por su centro y su radio
  inversion(punto_a_invertir, centro_circunferencia_inversion, radio_circunferencia_inversion){
    var u = centro_circunferencia_inversion.x - punto_a_invertir.x;
    var v = centro_circunferencia_inversion.y - punto_a_invertir.y;

    var r4 = radio_circunferencia_inversion * radio_circunferencia_inversion *
             radio_circunferencia_inversion * radio_circunferencia_inversion;
    var modulo = Math.sqrt((punto_a_invertir.x - centro_circunferencia_inversion.x) * (punto_a_invertir.x - centro_circunferencia_inversion.x) +
                           (punto_a_invertir.y - centro_circunferencia_inversion.y) * (punto_a_invertir.y - centro_circunferencia_inversion.y));

    /*var vector_director = {x: u, y: v};
    var x = this.interseccion_recta_con_circunferencia(vector_director, punto_a_invertir, centro_circunferencia_inversion, radio_circunferencia_inversion);
    */

    if (Math.abs(v) > 0.01){
      var k = centro_circunferencia_inversion.x - centro_circunferencia_inversion.y * u / v;
      var l = k - centro_circunferencia_inversion.x;

      var a = 1 + (u * u) / (v * v);
      var b = 2 * u * l / v - 2 * centro_circunferencia_inversion.y;
      var c = l * l + centro_circunferencia_inversion.y * centro_circunferencia_inversion.y - r4 / (modulo * modulo);

      var y21 = this.ecuacion_de_segundo_grado_pos(a, b, c);
      var y22 = this.ecuacion_de_segundo_grado_neg(a, b, c);

      var y11 = y21 * u / v + k;
      var y12 = y22 * u / v + k;

      var mod1 = (y11 - punto_a_invertir.x) * (y11 - punto_a_invertir.x) + (y21 - punto_a_invertir.y) * (y21 - punto_a_invertir.y);
      var mod2 = (y12 - punto_a_invertir.x) * (y12 - punto_a_invertir.x) + (y22 - punto_a_invertir.y) * (y22 - punto_a_invertir.y);

      var x;

      if (mod1 > mod2){
        /*console.log(y12);
        console.log(y22);*/
        x = {x: y12, y: y22};
      }

      else {
        /*console.log(y11);
        console.log(y21);*/
        x = {x: y11, y: y21};
      }
    }

    else {
      var coeficienteB = - u;
      var coeficienteC = u * punto_a_invertir.y;
      var y2 = - coeficienteC / coeficienteB;

      var y11 = Math.sqrt(r4 / (modulo * modulo) - (y2 - centro_circunferencia_inversion.y) * (y2 - centro_circunferencia_inversion.y)) +
                centro_circunferencia_inversion.x;
      var y12 = - Math.sqrt(r4 / (modulo * modulo) - (y2 - centro_circunferencia_inversion.y) * (y2 - centro_circunferencia_inversion.y)) +
                centro_circunferencia_inversion.x;


      var mod1 = Math.sqrt((y11 - punto_a_invertir.x) * (y11 - punto_a_invertir.x) + (y2 - punto_a_invertir.y) * (y2 - punto_a_invertir.y));
      var mod2 = Math.sqrt((y12 - punto_a_invertir.x) * (y12 - punto_a_invertir.x) + (y2 - punto_a_invertir.y) * (y2 - punto_a_invertir.y));

      var x;

      if (mod1 > mod2){
        /*console.log(y12);
        console.log(y22);*/
        x = {x: y12, y: y2};
      }

      else {
        /*console.log(y11);
        console.log(y21);*/
        x = {x: y11, y: y2};
      }
    }

    return x;
  }

  // Devuelve los puntos de intersección de las rectas tangentes a una circunferencia, desde un punto exterior a la misma
  interseccion_circunferencia_con_circunferencia_a_partir_de_un_punto_exterior_rectas_tangentes(punto_exterior, centro_circunferencia, radio_circunferencia){
    var modulo2 = (((centro_circunferencia.x - punto_exterior.x) / 2) * ((centro_circunferencia.x - punto_exterior.x) / 2) +
                   ((centro_circunferencia.y - punto_exterior.y) / 2) * ((centro_circunferencia.y - punto_exterior.y) / 2));

    var m1 = (centro_circunferencia.x + punto_exterior.x) / 2;
    var m2 = (centro_circunferencia.y + punto_exterior.y) / 2;

    var t = radio_circunferencia * radio_circunferencia - modulo2 - centro_circunferencia.x * centro_circunferencia.x -
            centro_circunferencia.y * centro_circunferencia.y + m1 * m1 + m2 * m2;
    var u = m2 - centro_circunferencia.y;
    var v = m1 - centro_circunferencia.x;
    var w = t - 2 * centro_circunferencia.x * v;

    if (Math.abs(v) > 0.01){
      var a = 1 + (u * u) / (v * v);
      var b = - u * w / (v * v) - 2 * centro_circunferencia.y;
      var c = w * w / (4 * v * v) + centro_circunferencia.y * centro_circunferencia.y - radio_circunferencia * radio_circunferencia;

      var y1 = this.ecuacion_de_segundo_grado_pos(a, b, c);
      var y2 = this.ecuacion_de_segundo_grado_neg(a, b, c);

      var x1 = (t - 2 * y1 * u) / (2 * v);
      var x2 = (t - 2 * y2 * u) / (2 * v);

      var punto1 = {x: x1, y: y1};
      var punto2 = {x: x2, y: y2};
    }

    else {
      var y = t / (2 * u);

      var x1 = Math.sqrt(radio_circunferencia * radio_circunferencia - (y - centro_circunferencia.y) * (y - centro_circunferencia.y)) +
              centro_circunferencia.x;
      var x2 = - Math.sqrt(radio_circunferencia * radio_circunferencia - (y - centro_circunferencia.y) * (y - centro_circunferencia.y)) +
              centro_circunferencia.x;

      var punto1 = {x: x1, y: y};
      var punto2 = {x: x2, y: y};
    }

    /*console.log(x1);
    console.log(y1);
    console.log(x2);
    console.log(y2);*/

    var puntos = {x: punto1, y: punto2};

    return puntos;
  }

  // Obtiene el centro de la circunferencia que pasa por tres puntos
  circunferencia_a_partir_de_tres_puntos(A, B, C){
    var vector_mediatriz_AB = {x:A.y - B.y, y: B.x - A.x};
    var punto_mediatriz_AB = {x: (A.x + B.x) / 2, y: (A.y + B.y) / 2};

    var vector_mediatriz_AC = {x:A.y - C.y, y: C.x - A.x};
    var punto_mediatriz_AC = {x: (A.x + C.x) / 2, y: (A.y + C.y) / 2};

    var coeficienteA = vector_mediatriz_AB.y;
    var coeficienteB = - vector_mediatriz_AB.x;
    var coeficienteC = vector_mediatriz_AB.x * punto_mediatriz_AB.y - vector_mediatriz_AB.y * punto_mediatriz_AB.x;

    var coeficienteAprima = vector_mediatriz_AC.y;
    var coeficienteBprima = - vector_mediatriz_AC.x;
    var coeficienteCprima = vector_mediatriz_AC.x * punto_mediatriz_AC.y - vector_mediatriz_AC.y * punto_mediatriz_AC.x;

    if (coeficienteA != 0){
      var y = (coeficienteAprima * coeficienteC / coeficienteA - coeficienteCprima) /
          (coeficienteBprima - coeficienteAprima * coeficienteB / coeficienteA);

      var x = (-coeficienteB * y - coeficienteC) / coeficienteA;
    }

    else {
      var y = - coeficienteC / coeficienteB;
      var x = (coeficienteBprima * coeficienteC / coeficienteB - coeficienteCprima) / coeficienteAprima;
    }

    var centro_circunferencia = {x:x, y:y};

    return centro_circunferencia;
  }

  // Devuelve el centro y el radio de la circunferencia euclídea a partir de los puntos this.puntoA y this.puntoB
  createCircunference(){
    // Paso 1
    var puntoA1prima = this.inversion(this.puntoA, this.centroPoincare, this.radioPoincare);
    //console.log(puntoA1prima);

    // Paso 2 y 3
    var puntos_recta_tangente = this.interseccion_circunferencia_con_circunferencia_a_partir_de_un_punto_exterior_rectas_tangentes(
                  puntoA1prima, this.centroPoincare, this.radioPoincare);

    //console.log(puntos_recta_tangente);

    // Paso 4
    var centro_circunferencia_auxiliar = puntoA1prima;
    var radio_circunferencia_auxiliar = Math.sqrt((puntos_recta_tangente.x.x - puntoA1prima.x) * (puntos_recta_tangente.x.x - puntoA1prima.x) +
                                                  (puntos_recta_tangente.x.y - puntoA1prima.y) * (puntos_recta_tangente.x.y - puntoA1prima.y));
    //console.log(radio_circunferencia_auxiliar);

    // Paso 5
    var puntoAprima = this.inversion(this.puntoA, centro_circunferencia_auxiliar, radio_circunferencia_auxiliar);
    var puntoBprima = this.inversion(this.puntoB, centro_circunferencia_auxiliar, radio_circunferencia_auxiliar);
    //console.log(puntoAprima);
    //console.log(puntoBprima);

    // Paso 6
    var vector_recta_auxiliar = {x: puntoBprima.x - puntoAprima.x, y: puntoBprima.y - puntoAprima.y};
    var punto_recta_auxiliar = puntoAprima;

    // Paso 7
    var puntos_interseccion_recta_circunferencia = this.interseccion_recta_con_circunferencia(
      vector_recta_auxiliar, punto_recta_auxiliar, this.centroPoincare, this.radioPoincare);
    //console.log(puntos_interseccion_recta_circunferencia);

    // Paso 8
    var puntoCprima = this.inversion(puntos_interseccion_recta_circunferencia.x, centro_circunferencia_auxiliar, radio_circunferencia_auxiliar);
    this.puntoCprima = puntoCprima;
    //console.log(puntoCprima);
    var puntoFprima = this.inversion(puntos_interseccion_recta_circunferencia.y, centro_circunferencia_auxiliar, radio_circunferencia_auxiliar);
    this.puntoFprima = puntoFprima;
    //console.log(puntoFprima);

    // Paso 9
    var centro_recta_hiperbolica = this.circunferencia_a_partir_de_tres_puntos(puntoCprima, this.puntoA, puntoFprima);
    var radio_recta_hiperbolica = Math.sqrt((centro_recta_hiperbolica.x - this.puntoA.x) * (centro_recta_hiperbolica.x - this.puntoA.x) +
                                            (centro_recta_hiperbolica.y - this.puntoA.y) * (centro_recta_hiperbolica.y - this.puntoA.y));
    //console.log(centro_recta_hiperbolica);
    //console.log(radio_recta_hiperbolica);

    var circunference = {centro: centro_recta_hiperbolica, radio: radio_recta_hiperbolica};

    return circunference;
  }

  createCircunferenceBoundary(){
    // Obtengo una de las tangentes al borde del disco
    let vector_recta1 = {x: this.centroPoincare.x - this.puntoA.x, y: this.centroPoincare.y - this.puntoA.y};
    let vector_recta_tangente1 = {x:vector_recta1.y, y:- vector_recta1.x};
    let punto_recta1 = this.puntoA;

    // Obtengo la otra de las tangentes al borde del disco
    let vector_recta2 = {x: this.centroPoincare.x - this.puntoB.x, y: this.centroPoincare.y - this.puntoB.y};
    let vector_recta_tangente2 = {x:vector_recta2.y, y:- vector_recta2.x};
    let punto_recta2 = this.puntoB;

    // Obtengo el punto de corte entre las dos rectas anteriores
    var coeficienteA1 = vector_recta_tangente1.y;
    var coeficienteB1 = - vector_recta_tangente1.x;
    var coeficienteC1 = vector_recta_tangente1.x * punto_recta1.y - vector_recta_tangente1.y * punto_recta1.x;

    var coeficienteA2 = vector_recta_tangente2.y;
    var coeficienteB2 = - vector_recta_tangente2.x;
    var coeficienteC2 = vector_recta_tangente2.x * punto_recta2.y - vector_recta_tangente2.y * punto_recta2.x;

    let y = (coeficienteA2 * coeficienteC1 / coeficienteA1 - coeficienteC2) /
            (coeficienteB2 - coeficienteB1 * coeficienteA2 / coeficienteA1);

    let x = (-coeficienteB1 * y - coeficienteC1) / coeficienteA1;

    var centro_recta_hiperbolica = {x:x, y:y};
    var radio_recta_hiperbolica = Math.sqrt((centro_recta_hiperbolica.x - this.puntoA.x) * (centro_recta_hiperbolica.x - this.puntoA.x) +
                                            (centro_recta_hiperbolica.y - this.puntoA.y) * (centro_recta_hiperbolica.y - this.puntoA.y));

    var circunference = {centro: centro_recta_hiperbolica, radio: radio_recta_hiperbolica};

    this.puntoCprima = this.puntoA;
    this.puntoFprima = this.puntoB;

    return circunference;
  }

  // Dibuja la recta hiperbólica que pasa por los puntos this.puntoA y this.puntoB
  createHyperbolicLine(){
    // Aquí compruebo si la recta hiperbólica es un diámetro
    if (Math.abs(this.centroPoincare.x - this.puntoA.x) > 0.001 &&
        Math.abs(this.centroPoincare.y - this.puntoA.y) > 0.001){
      var vector_recta = {x: this.centroPoincare.x - this.puntoA.x, y: this.centroPoincare.y - this.puntoA.y};
      var punto_recta = this.puntoA;

      var coeficienteA = vector_recta.y;
      var coeficienteB = - vector_recta.x;
      var coeficienteC = vector_recta.x * punto_recta.y - vector_recta.y * punto_recta.x;

      res = coeficienteA * this.puntoB.x + coeficienteB * this.puntoB.y + coeficienteC;
    }

    else {
      var vector_recta = {x: this.centroPoincare.x - this.puntoB.x, y: this.centroPoincare.y - this.puntoB.y};
      var punto_recta = this.puntoB;

      var coeficienteA = vector_recta.y;
      var coeficienteB = - vector_recta.x;
      var coeficienteC = vector_recta.x * punto_recta.y - vector_recta.y * punto_recta.x;

      res = coeficienteA * this.puntoA.x + coeficienteB * this.puntoA.y + coeficienteC;
    }



    // Si se cumple esto será un diámtro, luego la forma de pintarla será así de sencilla
    if (Math.abs(res) < 0.0001){
      this.isDiametro = true;

      /*this.ctx.beginPath();

      this.ctx.moveTo(this.puntoA.x, this.puntoA.y);
      this.ctx.lineTo(this.puntoB.x, this.puntoB.y);

      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.tamanyo;
      this.ctx.stroke();*/

      let intersecciones = this.interseccion_recta_con_circunferencia(vector_recta, punto_recta, this.centroPoincare, this.radioPoincare);

      this.puntoCprima = intersecciones.x;
      this.puntoFprima = intersecciones.y;

      //console.log(vector_recta);
      //console.log(punto_recta);

      //console.log(this.puntoCprima);
      //console.log(this.puntoFprima);
    }

      // En cambio, de no ser un diámetro, se vuelve más compleja
    else {
      // Voy a comprobar ahora si los puntos están en el borde del disco
      var res = (this.puntoA.x - this.centroPoincare.x) * (this.puntoA.x - this.centroPoincare.x) +
                (this.puntoA.y - this.centroPoincare.y) * (this.puntoA.y - this.centroPoincare.y) -
                this.radioPoincare * this.radioPoincare;

      // Si están en el borde hay que construir la circunferencia de otra forma
      if (Math.abs(res) < 0.0001){
        var circunference = this.createCircunferenceBoundary();
      }

      else {
        var circunference = this.createCircunference();
      }

      this.centro = circunference.centro;
      this.radio = circunference.radio;

      //this.draw(circunference.centro, circunference.radio, this.puntoA, this.puntoB);
    }
  }

  drawHyperbolicLine(){
    if (this.isDiametro){
      this.ctx.beginPath();

      this.ctx.moveTo(this.puntoA.x, this.puntoA.y);
      this.ctx.lineTo(this.puntoB.x, this.puntoB.y);

      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.tamanyo;
      this.ctx.stroke();
    }

    else {
      this.draw(this.centro, this.radio, this.puntoA, this.puntoB);
    }
  }

  perpendicular(puntoComun){
    let inicio = MobiusTransformation(getPoint01(this.puntoCprima, this.radioPoincare, this.centroPoincare), puntoComun);
    let fin = MobiusTransformation(getPoint01(this.puntoFprima, this.radioPoincare, this.centroPoincare), puntoComun);

    let vector_director = {x:fin.x - inicio.x , y:fin.y - inicio.y};
    let vector_perpendicular = {x: vector_director.y, y: - vector_director.x};


    let intersecciones = this.interseccion_recta_con_circunferencia(vector_perpendicular,
                              this.centroPoincare, this.centroPoincare, this.radioPoincare);

    console.log(this.puntoCprima);
    console.log(this.puntoFprima);
    console.log(inicio);
    console.log(fin);
    console.log(puntoComun);

    let nuevoInicio = getPoint01(intersecciones.x, this.radioPoincare, this.centroPoincare);
    let nuevoFin = getPoint01(intersecciones.y, this.radioPoincare, this.centroPoincare);

    let inicioPerpendicular = MobiusTransformationBack(nuevoInicio, puntoComun);
    let finPerpendicular = MobiusTransformationBack(nuevoFin, puntoComun);

    inicioPerpendicular = {x: linealTransformation(inicioPerpendicular.x, this.radioPoincare, this.centroPoincare.x),
                           y: linealTransformation(inicioPerpendicular.y, this.radioPoincare, this.centroPoincare.y)};

    finPerpendicular = {x: linealTransformation(finPerpendicular.x, this.radioPoincare, this.centroPoincare.x),
                        y: linealTransformation(finPerpendicular.y, this.radioPoincare, this.centroPoincare.y)};


    return new Circunferencia(inicioPerpendicular.x, inicioPerpendicular.y, finPerpendicular.x, finPerpendicular.y, this.ctx,
                              this.centroPoincare, this.radioPoincare, this.color, this.tamanyo);
  }
}
