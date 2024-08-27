// Define uma função `_0x57da` que serve para acessar valores de um array de strings ofuscado.
var _0x31967c = _0x57da;

// Função `_0x57da` que traduz índices para strings ofuscadas.
function _0x57da(_0x1e8544, _0x328d79) {
  var _0x129b02 = _0x129b(); // Chama a função `_0x129b` para obter o array ofuscado.
  return _0x57da = function (_0x57da84, _0x2265d5) {
    _0x57da84 = _0x57da84 - 0x192; // Ajusta o índice para o array.
    var _0xa3bd7e = _0x129b02[_0x57da84]; // Acessa o valor no array usando o índice ajustado.
    return _0xa3bd7e;
  }, _0x57da(_0x1e8544, _0x328d79);
}

// Função `_0x129b` retorna um array ofuscado de strings.
function _0x129b() {
  var _0x221a3b = [
    '973YBpcVB', 'stopPropagation', '78nGquat', 'contextmenu', '1523557CxLINJ', 'addEventListener',
    '6920244EeFZON', '285OiujWa', 'preventDefault', '15109947zmllIT', 'ctrlKey', '122345nKUiWE',
    '40004150yKuCKL', '19784TxvdXr', '38798NNRdaX'
  ];
  _0x129b = function () {
    return _0x221a3b;
  };
  return _0x129b();
}

// IIFE (Immediately Invoked Function Expression) que é executada imediatamente.
(function (_0x289e57, _0x149074) {
  var _0x2940cf = _0x57da; // Define `_0x2940cf` como uma referência para `_0x57da`.
  var _0x1cc737 = _0x289e57(); // Chama a função `_0x289e57` que retorna o array ofuscado.

  // Loop infinito até que uma condição seja satisfeita.
  while (true) {
    try {
      // Tenta calcular um número, que parece ser uma forma de garantir que a ofuscação foi desfeita corretamente.
      var _0x15e75e = -parseInt(_0x2940cf(0x199)) / 0x1
        + parseInt(_0x2940cf(0x194)) / 0x2 * (parseInt(_0x2940cf(0x19c)) / 0x3)
        + -parseInt(_0x2940cf(0x19b)) / 0x4
        + parseInt(_0x2940cf(0x1a0)) / 0x5 * (-parseInt(_0x2940cf(0x197)) / 0x6)
        + parseInt(_0x2940cf(0x195)) / 0x7 * (parseInt(_0x2940cf(0x193)) / 0x8)
        + -parseInt(_0x2940cf(0x19e)) / 0x9
        + parseInt(_0x2940cf(0x192)) / 0xa;
      
      // Se o resultado da computação for igual ao valor esperado, sai do loop.
      if (_0x15e75e === _0x149074) break;
      else _0x1cc737.push(_0x1cc737.shift()); // Move o primeiro item para o final do array.
    } catch (_0x546579) {
      // Em caso de erro, move o primeiro item para o final do array.
      _0x1cc737.push(_0x1cc737.shift());
    }
  }
}(_0x129b, 0xe4a15));

// Adiciona um evento 'keydown' ao documento.
document[_0x31967c(0x19a)]('keydown', function (_0x466ad8) {
  var _0x46c599 = _0x31967c;
  // Se a tecla pressionada for a tecla F12 (0x7b) ou se a tecla Ctrl estiver pressionada.
  (_0x466ad8[_0x46c599(0x19f)] || _0x466ad8['keyCode'] == 0x7b) &&
    (_0x466ad8[_0x46c599(0x196)](), // Impede a propagação do evento.
    _0x466ad8[_0x46c599(0x19d)]()); // Impede o comportamento padrão do evento.
});

// Adiciona um evento 'contextmenu' (botão direito do mouse) ao documento.
document[_0x31967c(0x19a)](_0x31967c(0x198), function (_0x4d6f22) {
  var _0x38e2ca = _0x31967c;
  _0x4d6f22[_0x38e2ca(0x19d)](); // Impede o comportamento padrão do menu de contexto.
}, false);
