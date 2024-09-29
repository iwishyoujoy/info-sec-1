import * as fs from 'fs';
import * as path from "node:path";

// Символы, которые можно зашифровать (английский алфавит, русский алфавит, знаки препинания)
const encryptAlphabet: string[] = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя1234567890,.:;"-?!/[]= “«»”*&^(){}'.split('');

// Количество символов в используемом алфавите
const m = encryptAlphabet.length;
const a = 8;
const b = 8;
const a1 = 42;

// Функция для проверки чисел на взаимную простоту
const coprimedNumbers = () => {
    let options: number[] = [];
    for (let i = 0; i <= 100; i++) {
        if (checkCoprimeNumbers(i)) {
            options.push(i);
        }
    }
    return options;
}

// Функция, чтобы получить номер символа в алфавите
const getCharacterIndex = (char: string): number => {
    return encryptAlphabet.indexOf(char);
}

// Функция для получения наибольшего общего делителя
function gcd(a: number, b: number) { 
    if (a == 0 || b == 0) return 0; 
      
    if (a == b) return a; 
      
    if (a > b) return gcd(a - b, b); 
              
    return gcd(a, b - a); 
} 

// Проверка на взаимно простые числа
function checkCoprimeNumbers(a: number) {
    return gcd(a, m) === 1;
}

/**
 * Шифрование конкретного символа
 * @param char - символ для шифровки
 */
function encryptChar(char: string): string {
    // const upperCase = char.toUpperCase();
    // let isUpperCase = false;
    // if (upperCase === char) isUpperCase = true;

    const x = getCharacterIndex(char);

    if (x === -1) return char;

    return encryptAlphabet[(a * x + b) % m];
}

/**
 * Расшифровка конкретного символа
 * @param char - зашифрованный символ для расшифровки
 */
function decryptChar(char: string): string {
    // const upperCase = char.toUpperCase();
    // let isUpperCase = false;
    // if (upperCase === char) isUpperCase = true;

    const x = getCharacterIndex(char);
    if (x === -1) return char;

    let index = (a1 * (x - b)) % m;
    if (index < 0){
        index = m + index;
    }

    return encryptAlphabet[index];
}

/**
 * Функция шифрования текста
 * @param text - текст для шифровки
 * @param inputFileName - название исходного файла
 */
function encrypt(text: string, inputFileName: string) {
    const symbolsToEncrypt = text.split('');

    if (!checkCoprimeNumbers(a)) throw new Error(`A is not coprime to the length of alphabet. \n These are the options: ${coprimedNumbers().join(" ")}`);

    const result: string[] = [];

    symbolsToEncrypt.forEach((char) => {
        result.push(encryptChar(char));
    })

    const newFileName = path.basename(inputFileName, path.extname(inputFileName)) + '_encrypted.txt';
    const content = result.join('');

    fs.writeFile(newFileName, content, (err) => {
        if (err) console.log('Error occurred during writing encrypted file: ', {err})
        else {
            console.log('File was written successfully, here what\'s inside:')
            console.log(content);
        }
    });
}

/**
 * Функция дешифровки текста
 * @param text - текст для дешифровки
 * @param inputFileName - название исходного файла
 */
function decrypt(text: string, inputFileName: string) {
    const symbolsToDecrypt = text.split('');

    if (!checkCoprimeNumbers(a)) throw new Error(`A is not coprime to the length of alphabet. \n These are the options: ${coprimedNumbers().join(" ")}`);

    const result: string[] = [];

    symbolsToDecrypt.forEach((char) => {
        result.push(decryptChar(char));
    })

    const newFileName = path.basename(inputFileName, path.extname(inputFileName)) + '_decrypted.txt';
    const content = result.join('');

    fs.writeFile(newFileName, content, (err) => {
        if (err) console.log('Error occurred during writing decrypted file: ', {err})
        else {
            console.log('File was written successfully, here what\'s inside:')
            console.log(content);
        }
    });
}

/**
 * Функция обработки файла и вызов необходимого метода
 * @param inputFilePath - путь до файла. В первой строке файла должны быть указаны коэффициенты A и B. В следующих строках должен быть текст для шифрации/дешифрации
 * @param mode - выбор варианта: шифрация или дешифрация
 */
function processFile(inputFilePath: string, mode: 'encrypt' | 'decrypt' | 'frequency' = 'encrypt'): void {
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            throw new Error(`Error occurred while reading file: ${err}`);
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
                return
        }
    });
}

/**
 * Функция частотного анализа
 * @param plainText - текст для анализа
 * @param inputFileName - название исходного файла
 */
function frequencyDecrypt(plainText: string, inputFileName: string) {
    const lettersCount: { [key: string]: number } = {};

    for (let char of plainText) {
        if (encryptAlphabet.includes(char)) {
            lettersCount[char] = (lettersCount[char] || 0) + 1;
        }
    }

    const newFileName = path.basename(inputFileName, path.extname(inputFileName)) + '_freq.txt';

    const content = ['| Буква | Кол-во, шт. | Частота, % |'];

    for (let letter of encryptAlphabet) {
        const count = lettersCount[letter] || 0;
        const freq = (count / plainText.length) * 100;
        content.push(`| ${letter.padEnd(5)} | ${count.toString().padStart(11)} | ${(freq.toFixed(3)).padStart(10)} |`);
    }

    fs.writeFile(newFileName, content.join('\n'), (err) => {
        if (err) console.log('Error occurred during writing frequency analysis file: ', {err})
        else {
            console.log('File was written successfully, here what\'s inside:')
            console.log(content.join('\n'));
        }
    })
}

// Вызов функции шифрования
processFile('./text1.txt', 'encrypt');

// Вызов функции дешифрации
// processFile('./text1_encrypted.txt', 'decrypt');

// Вызов функции для частотного анализа
// processFile('./text1.txt', 'frequency');
