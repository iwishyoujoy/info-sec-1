"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Символы, которые можно зашифровать (английский алфавит, русский алфавит, знаки препинания)
var encryptAlphabet = 'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя.,!?/-+=(){}[]:;'.split('');
// Количество символов в используемом алфавите
var m = encryptAlphabet.length;
// Функция для проверки чисел на взаимную простоту
var coprimedNumbers = function () {
    var options = [];
    for (var i = 0; i <= 100; i++) {
        if (checkCoprimeNumbers(i)) {
            options.push(i);
        }
    }
    return options;
};
// Функция, чтобы получить номер символа в алфавите
var getCharacterIndex = function (char) {
    return encryptAlphabet.indexOf(char);
};
// Функция для получения наибольшего общего делителя
function gcd(a, b) {
    if (a == 0 || b == 0)
        return 0;
    if (a == b)
        return a;
    if (a > b)
        return gcd(a - b, b);
    return gcd(a, b - a);
}
// Проверка на взаимно простые числа
function checkCoprimeNumbers(a) {
    return gcd(a, m) === 1;
}
// Функция для поиска обратного числа по модулю
function modularInverse(a) {
    var t = 0;
    var newt = 1;
    var r = m;
    var newr = a;
    while (newr !== 0) {
        var quotient = Math.floor(r / newr);
        var temp = t - quotient * newt;
        t = newt;
        newt = temp;
        var temp2 = r - quotient * newr;
        r = newr;
        newr = temp2;
    }
    if (r !== 1)
        throw new Error("Modular inverse for A does not exist");
    return (t + m) % m;
}
/**
 * Шифрование конкретного символа
 * @param a - число, взаимно простое с длиной шифруемого алфавита
 * @param b - число, сдвиг
 * @param char - символ для шифровки
 */
function encryptChar(a, b, char) {
    var x = getCharacterIndex(char);
    if (x === -1)
        return char;
    return encryptAlphabet[(a * x + b) % m];
}
/**
 * Расшифровка конкретного символа
 * @param a - число, взаимно простое с длиной шифруемого алфавита
 * @param b - число, сдвиг
 * @param char - зашифрованный символ для расшифровки
 */
function decryptChar(a, b, char) {
    var x = encryptAlphabet.indexOf(char);
    if (x === -1)
        return char;
    var inverse = modularInverse(a);
    return encryptAlphabet[(inverse * (x - b)) % m];
}
/**
 * Функция шифрования текста
 * @param a - число, взаимно простое с длиной шифруемого алфавита
 * @param b - число, сдвиг
 * @param text - текст для шифровки
 */
function encrypt(a, b, text) {
    var symbolsToEncrypt = text.split('');
    if (!checkCoprimeNumbers(a))
        throw new Error("A is not coprime to the length of alphabet. \n These are the options: ".concat(coprimedNumbers().join(" ")));
    var result = [];
    symbolsToEncrypt.forEach(function (char) {
        result.push(encryptChar(a, b, char));
    });
    console.log(result.join(''));
}
/**
 * Функция дешифровки текста
 * @param a - число, взаимно простое с длиной шифруемого алфавита
 * @param b - число, сдвиг
 * @param text - текст для дешифровки
 */
function decrypt(a, b, text) {
    var symbolsToDecrypt = text.split('');
    if (!checkCoprimeNumbers(a))
        throw new Error("A is not coprime to the length of alphabet. \n These are the options: ".concat(coprimedNumbers().join(" ")));
    var result = [];
    symbolsToDecrypt.forEach(function (char) {
        result.push(decryptChar(a, b, char));
    });
    console.log(result.join(''));
}
/**
 * Функция обработки файла и вызов необходимого метода
 * @param inputFilePath - путь до файла. В первой строке файла должны быть указаны коэффициенты A и B. В следующих строках должен быть текст для шифрации/дешифрации
 * @param mode - выбор варианта: шифрация или дешифрация
 */
function processFile(inputFilePath, mode) {
    if (mode === void 0) { mode = 'encrypt'; }
    fs.readFile(inputFilePath, 'utf8', function (err, data) {
        if (err) {
            throw new Error("Error occurred while reading file: ".concat(err));
        }
        var lines = data.trim().split('\n');
        if (lines.length < 2) {
            throw new Error('Wrong file format. \nFirst line should be: a b. Second line: text');
        }
        var coefficients = lines[0], text = lines[1];
        var _a = coefficients.split(" "), a = _a[0], b = _a[1];
        if (mode === 'encrypt') {
            encrypt(Number(a), Number(b), text);
        }
        else {
            decrypt(Number(a), Number(b), text);
        }
    });
}
// Вызов функции шифрования
// processFile('./text.txt', 'encrypt');
// Вызов функции дешифрации
processFile('./text.txt', 'decrypt');
