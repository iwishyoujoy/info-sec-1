import * as fs from 'fs';

// Символы, которые можно зашифровать (английский алфавит, русский алфавит, знаки препинания)
const encryptAlphabet: string[] = 'abcdefghijklmnopqrstuvwxyzабвгдеёжзийклмнопрстуфхцчшщъыьэюя.,!?/-+=(){}[]:;'.split('');

// Количество символов в используемом алфавите
const m = encryptAlphabet.length; 

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

// Функция для поиска обратного числа по модулю
function modularInverse(a: number): number {
    let t = 0;
    let newt = 1;
    let r = m;
    let newr = a;

    while (newr !== 0) {
        const quotient = Math.floor(r / newr);
        const temp = t - quotient * newt;
        t = newt;
        newt = temp;

        const temp2 = r - quotient * newr;
        r = newr;
        newr = temp2;
    }

    if (r !== 1) throw new Error("Modular inverse for A does not exist");

    return (t + m) % m;
}

/**
 * Шифрование конкретного символа
 * @param a - число, взаимно простое с длиной шифруемого алфавита
 * @param b - число, сдвиг
 * @param char - символ для шифровки
 */
function encryptChar(a: number, b: number, char: string): string {
    const x = getCharacterIndex(char);
    if (x === -1) return char;

    return encryptAlphabet[(a * x + b) % m];
}

/**
 * Расшифровка конкретного символа
 * @param a - число, взаимно простое с длиной шифруемого алфавита
 * @param b - число, сдвиг
 * @param char - зашифрованный символ для расшифровки
 */
function decryptChar(a: number, b: number, char: string): string {
    const x = encryptAlphabet.indexOf(char);
    if (x === -1) return char;

    const inverse = modularInverse(a);

    return encryptAlphabet[(inverse * (x - b)) % m];
}

/**
 * Функция шифрования текста
 * @param a - число, взаимно простое с длиной шифруемого алфавита
 * @param b - число, сдвиг
 * @param text - текст для шифровки
 */
function encrypt(a: number, b: number, text: string) {
    const symbolsToEncrypt = text.split('');

    if (!checkCoprimeNumbers(a)) throw new Error(`A is not coprime to the length of alphabet. \n These are the options: ${coprimedNumbers().join(" ")}`);

    const result: string[] = [];

    symbolsToEncrypt.forEach((char) => {
        result.push(encryptChar(a, b, char));
    })

    console.log(result.join(''));
}

/**
 * Функция дешифровки текста
 * @param a - число, взаимно простое с длиной шифруемого алфавита
 * @param b - число, сдвиг
 * @param text - текст для дешифровки
 */
function decrypt(a: number, b: number, text: string) {
    const symbolsToDecrypt = text.split('');

    if (!checkCoprimeNumbers(a)) throw new Error(`A is not coprime to the length of alphabet. \n These are the options: ${coprimedNumbers().join(" ")}`);

    const result: string[] = [];

    symbolsToDecrypt.forEach((char) => {
        result.push(decryptChar(a, b, char));
    })

    console.log(result.join(''));
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

        if (mode === 'frequency') {
            frequencyDecrypt(data.trim());
            return;
        }

        const lines = data.trim().split('\n');

        if (lines.length < 2) {
            throw new Error('Wrong file format. \nFirst line should be: a b. Second line: text');
        }

        const [coefficients, text] = lines;

        const [a, b] = coefficients.split(" ");

        if (mode === 'encrypt') {
            encrypt(Number(a), Number(b), text);
        } else{
            decrypt(Number(a), Number(b), text);
        }
    });
}

/**
 * Функция частотного анализа
 * @param plainText - текст для анализа
 */
function frequencyDecrypt(plainText: string) {
    const lettersCount: { [key: string]: number } = {};

    for (let char of plainText) {
        if (encryptAlphabet.includes(char)) {
            lettersCount[char] = (lettersCount[char] || 0) + 1;
        }
    }

    console.log('| Буква | Кол-во, шт. | Частота, % |');

    for (let letter of encryptAlphabet) {
        const count = lettersCount[letter] || 0;
        const freq = (count / plainText.length) * 100;
        console.log(`| ${letter.padEnd(4)} | ${count.toString().padStart(6)} | ${(freq.toFixed(3)).padStart(12)} |`);
    }
}

// Вызов функции шифрования
// processFile('./text.txt', 'encrypt');

// Вызов функции дешифрации
// processFile('./text.txt', 'decrypt');

// Вызов функции для частотного анализа
processFile('./text2_encrypted.txt', 'frequency');

