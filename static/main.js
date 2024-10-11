// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Проверка, является ли строка str числом.
function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if(lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length-1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    
    evaluate(out.join(' '))
    
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).

function evaluate(str) {
    stack = []
    arr = String(str).split(" ")
    console.log(arr)
    for(let i = 0; i < arr.length; i++){
        if(isNumeric(arr[i]) || isDigit(arr[i])){
            stack.push(arr[i])
        }
        if(isOperation(arr[i])){
            var a = stack[stack.length - 1]
            stack.pop()
            if(stack.length > 0){
                var b = stack[stack.length - 1]
                stack.pop()
            }
            else{
                var b = 0
            }
            stack.push(process(a, b, arr[i]))
            console.log(stack)
        }
    }
    document.getElementById('screen').innerHTML = Math.round(stack[0] * 100) / 100
}
function process(a, b, oper){
    
    switch(oper){
        case "+": return Number(b) + Number(a)
        case "-": return Number(b) - Number(a)
        case "/": return Number(b) / Number(a)
        case "*": return Number(b) * Number(a)
    }
        
}

// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённого выражения 
// с точностью до двух знаков после десятичного разделителя (точки).
// Реализуйте эту функцию. Воспользуйтесь механизмом делегирования 
// событий (https://learn.javascript.ru/event-delegation), чтобы 
// не назначать обработчик для каждой кнопки в отдельности.

function clickHandler(event) {
    if(event.target.className == "key-digit" || event.target.className == "key-bracket"){
       document.getElementById('screen').innerHTML =  document.getElementById('screen').innerHTML + event.target.innerHTML
    }
    else if(event.target.className == "key-operation"){
        document.getElementById('screen').innerHTML =  document.getElementById('screen').innerHTML+ event.target.innerHTML 
    }
    if(event.target.id == "key-clear"){
        document.getElementById('screen').innerHTML = ""
    }
    if(event.target.id == "key-result"){
        
        compile(document.getElementById('screen').innerHTML)
    }
    
}


// Назначьте нужные обработчики событий.
window.onload = function () {
   let arr = document.getElementsByClassName('key-digit')
    for(let i = 0; i < arr.length; i++){
        arr[i].addEventListener('click', clickHandler, false)
    }
    arr = document.getElementsByClassName('key-operation')
    for(let i = 0; i < arr.length; i++){
        arr[i].addEventListener('click', clickHandler, false)
    }
    arr = document.getElementsByClassName('key-bracket')
    for(let i = 0; i < arr.length; i++){
        arr[i].addEventListener('click', clickHandler, false)
    }
    document.getElementById('screen').innerHTML = ""
    document.getElementById('key-clear').addEventListener('click', clickHandler, false)
    document.getElementById('key-result').addEventListener('click', clickHandler, false)
}
