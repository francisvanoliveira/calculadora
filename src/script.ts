// id calculadora
const calculadoraElemento = document.getElementById('calculadora') as HTMLInputElement;
// id resultado
const resultadoElemento = document.getElementById('resultado') as HTMLElement;

// evaluate string '10 + 5 - 2' to number 13
function evaluate(expression: string): number | null {
  try {
    const expressionWithDots = expression.replace(/,/g, '.');
    if (expressionWithDots.match(/[a-zA-Z&#$<>{}]/g)) throw new Error();
    // cuidado com Function
    return new Function(`return (${expressionWithDots})`)();
  } catch (e) {
    return null;
  }
}

// isNumber type predicate
function isNumber(value: unknown): value is number {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  } else return false;
}

// round to 3 decimal
function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function formatDecimal(value: number): string {
  return value.toString().replace('.', ',');
}

function calcular() {
  // save calculadora value to localStorage
  localStorage.setItem('calculadora', calculadoraElemento.value);

  // separate lines from calculadoraElemento in array
  const linhas = calculadoraElemento.value.split(/\r?\n/).map(evaluate);
  resultadoElemento.innerHTML = `<div>${linhas
    .map((l) => `<div>${isNumber(l) ? formatDecimal(round(l)) : '---'}</div>`)
    .join('')}</div>`;

  // calculate total from linhas
  const total = round(
    linhas.filter(isNumber).reduce((acc, cur) => acc + cur, 0),
  );
  // add total to resultadoElemento
  resultadoElemento.innerHTML += `<div id="total">${formatDecimal(total)}</div>`;

  // save total to clipboard on click
  const totalElemento = document.getElementById('total') as HTMLElement;
  totalElemento.addEventListener('click', () => {
    navigator.clipboard.writeText(formatDecimal(total));
  });
}

// load calculadora value from localStorage
calculadoraElemento.value = localStorage.getItem('calculadora') || '';
// add event listener to calculadoraElemento
calculadoraElemento.addEventListener('input', calcular);
calcular();