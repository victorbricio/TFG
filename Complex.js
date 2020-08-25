class Complex {
  constructor(a, b) {
    this.complex = [a, b];
  }

  re(){
    return this.complex[0];
  }

  im(){
    return this.complex[1];
  }
}

function add(z1, z2){
  return new Complex(z1.re() + z2.re(), z1.im() + z2.im());
}

function sub(z1, z2){
  return new Complex(z1.re() - z2.re(), z1.im() - z2.im());
}

function prod(z1, z2) {
  return new Complex(z1.re() * z2.re() - z1.im() * z2.im(), z1.re() * z2.im() + z1.im() * z2.re());
}

function conjg(z) {
  return new Complex(z.re(), - z.im());
}

function div(z1, z2) {
  var numerador = prod(z1, conjg(z2));
  var denominador = prod(z2, conjg(z2)).re();

  return new Complex(numerador.re() / denominador, numerador.im() / denominador);
}
