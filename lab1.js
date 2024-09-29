"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("node:path");
// Символы, которые можно зашифровать (английский алфавит, русский алфавит, знаки препинания)
var encryptAlphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя1234567890,.:;"-?!/[]= “«»”*&^(){}'.split('');
// Количество символов в используемом алфавите
var m = encryptAlphabet.length;
var a = 8;
var b = 8;
var a1 = 42;
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
/**
 * Шифрование конкретного символа
 * @param char - символ для шифровки
 */
function encryptChar(char) {
    // const upperCase = char.toUpperCase();
    // let isUpperCase = false;
    // if (upperCase === char) isUpperCase = true;
    var x = getCharacterIndex(char);
    if (x === -1)
        return char;
    return encryptAlphabet[(a * x + b) % m];
}
/**
 * Расшифровка конкретного символа
 * @param char - зашифрованный символ для расшифровки
 */
function decryptChar(char) {
    // const upperCase = char.toUpperCase();
    // let isUpperCase = false;
    // if (upperCase === char) isUpperCase = true;
    var x = getCharacterIndex(char);
    if (x === -1)
        return char;
    var index = (a1 * (x - b)) % m;
    if (index < 0) {
        index = m + index;
    }
    return encryptAlphabet[index];
}
/**
 * Функция шифрования текста
 * @param text - текст для шифровки
 * @param inputFileName - название исходного файла
 */
function encrypt(text, inputFileName) {
    var symbolsToEncrypt = text.split('');
    if (!checkCoprimeNumbers(a))
        throw new Error("A is not coprime to the length of alphabet. \n These are the options: ".concat(coprimedNumbers().join(" ")));
    var result = [];
    symbolsToEncrypt.forEach(function (char) {
        result.push(encryptChar(char));
    });
    var newFileName = path.basename(inputFileName, path.extname(inputFileName)) + '_encrypted.txt';
    var content = result.join('');
    fs.writeFile(newFileName, content, function (err) {
        if (err)
            console.log('Error occurred during writing encrypted file: ', { err: err });
        else {
            console.log('File was written successfully, here what\'s inside:');
            console.log(content);
        }
    });
}
/**
 * Функция дешифровки текста
 * @param text - текст для дешифровки
 * @param inputFileName - название исходного файла
 */
function decrypt(text, inputFileName) {
    var symbolsToDecrypt = text.split('');
    if (!checkCoprimeNumbers(a))
        throw new Error("A is not coprime to the length of alphabet. \n These are the options: ".concat(coprimedNumbers().join(" ")));
    var result = [];
    symbolsToDecrypt.forEach(function (char) {
        result.push(decryptChar(char));
    });
    var newFileName = path.basename(inputFileName, path.extname(inputFileName)) + '_decrypted.txt';
    var content = result.join('');
    fs.writeFile(newFileName, content, function (err) {
        if (err)
            console.log('Error occurred during writing decrypted file: ', { err: err });
        else {
            console.log('File was written successfully, here what\'s inside:');
            console.log(content);
        }
    });
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
        switch (mode) {
            case "encrypt":
                encrypt(data, inputFilePath);
                return;
            case "decrypt":
                decrypt(data, inputFilePath);
                return;
            case "frequency":
                frequencyDecrypt(data, inputFilePath);
                return;
        }
    });
}
/**
 * Функция частотного анализа
 * @param plainText - текст для анализа
 * @param inputFileName - название исходного файла
 */
function frequencyDecrypt(plainText, inputFileName) {
    var lettersCount = {};
    for (var _i = 0, plainText_1 = plainText; _i < plainText_1.length; _i++) {
        var char = plainText_1[_i];
        if (encryptAlphabet.includes(char)) {
            lettersCount[char] = (lettersCount[char] || 0) + 1;
        }
    }
    var newFileName = path.basename(inputFileName, path.extname(inputFileName)) + '_freq.txt';
    var content = ['| Буква | Кол-во, шт. | Частота, % |'];
    for (var _a = 0, encryptAlphabet_1 = encryptAlphabet; _a < encryptAlphabet_1.length; _a++) {
        var letter = encryptAlphabet_1[_a];
        var count = lettersCount[letter] || 0;
        var freq = (count / plainText.length) * 100;
        content.push("| ".concat(letter.padEnd(5), " | ").concat(count.toString().padStart(11), " | ").concat((freq.toFixed(3)).padStart(10), " |"));
    }
    fs.writeFile(newFileName, content.join('\n'), function (err) {
        if (err)
            console.log('Error occurred during writing frequency analysis file: ', { err: err });
        else {
            console.log('File was written successfully, here what\'s inside:');
            console.log(content.join('\n'));
        }
    });
}
// Вызов функции шифрования
// processFile('./text1.txt', 'encrypt');
// Вызов функции дешифрации
// processFile('./text1_encrypted.txt', 'decrypt');
// Вызов функции для частотного анализа
processFile('./text1.txt', 'frequency');
