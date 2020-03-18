function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(s) {
    let str = s;

    if (str.includes('(') || str.includes(')')) {
        if (str.includes('(') && !str.includes(')') || !str.includes('(') && str.includes(')') || str.match(/\(/g).length !== str.match(/\)/g).length) throw new Error("ExpressionError: Brackets must be paired");
    }

    let numbers = [];
    let operators = [];
    let priorities = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2
    }

    str = str.replace(/\+/g, '&+&').replace(/\-/g, '&-&').replace(/\*/g, '&*&').replace(/\//g, '&/&').replace(/\(/g, '&(&').replace(/\)/g, '&)&');
    let expr = str.split('&');


    function calc() {
        let operator = operators.pop(operators[operators.length - 1]);
        let lastNumber = +numbers.pop(numbers[numbers.length - 1]);
        let firstNumber = +numbers.pop(numbers[numbers.length - 1]);
        let newNumber;

        if (operator === "+") newNumber = firstNumber + lastNumber;
        if (operator === "-") newNumber = firstNumber - lastNumber;
        if (operator === "*") newNumber = firstNumber * lastNumber;
        if (operator === "/") {
            if (lastNumber === 0 || lastNumber === -0) throw new Error("TypeError: Division by zero.");
            newNumber = firstNumber / lastNumber;
        }

        numbers.push(newNumber);
    }

    function getTop(arr) {
        return arr[arr.length - 1]
    }

    for (let i = 0; i < expr.length; i++) {
        if (!expr[i].trim()) continue;
        if (expr[i] === '(') {
            operators.push(expr[i]);
        } else if (expr[i] === ')') {
            for (let g = operators.length; g > 0; g--) {
                if (getTop(operators) === '(') {
                    operators.pop(g);
                    break;
                }
                calc();
            }
        } else if (!isNaN(expr[i])) {
            numbers.push(expr[i]);
        } else {
            if (!getTop(operators) || getTop(operators) === "(" || priorities[expr[i]] > priorities[getTop(operators)]) {
                operators.push(expr[i]);
            } else {
                for (let g = operators.length - 1; g >= 0; g--) {
                    if (getTop(operators) === '(') break;
                    if (priorities[getTop(operators)] >= priorities[expr[i]]) {
                        calc();
                    }
                }
                operators.push(expr[i]);
            }
        }
    }
    numbers.forEach(item => calc());
    return numbers[0];
}

module.exports = {
    expressionCalculator
}