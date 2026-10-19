const vscode = require('vscode');

const INITIAL_ALGOS = [
    {
        id: '1',
        name: 'Linear Search',
        lang: 'python',
        complexity: 'O(N)',
        category: 'Поиск',
        description: 'Применяется для поиска индекса элемента в произвольном неотсортированном списке путем последовательного перебора всех значений.',
        code: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
        image: ''
    },
    {
        id: '2',
        name: 'Binary Search',
        lang: 'python',
        complexity: 'O(log N)',
        category: 'Поиск',
        description: 'Применяется для быстрого нахождения элемента в строго отсортированном массиве путем деления диапазона поиска пополам на каждом шаге.',
        code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
        image: ''
    },
    {
        id: '3',
        name: 'Find Min Max',
        lang: 'python',
        complexity: 'O(N)',
        category: 'Массивы',
        description: 'Используется для нахождения граничных (наименьшего и наибольшего) значений в наборе данных за один проход.',
        code: `def find_min_max(arr):
    if not arr:
        return None, None
    min_val = max_val = arr[0]
    for x in arr[1:]:
        if x < min_val:
            min_val = x
        elif x > max_val:
            max_val = x
    return min_val, max_val`,
        image: ''
    },
    {
        id: '4',
        name: 'Calculate Average',
        lang: 'python',
        complexity: 'O(N)',
        category: 'Массивы',
        description: 'Применяется в статистических расчетах для вычисления центральной тенденции числового ряда.',
        code: `def calculate_average(arr):
    if not arr:
        return 0.0
    total = 0
    for x in arr:
        total += x
    return total / len(arr)`,
        image: ''
    },
    {
        id: '5',
        name: 'Reverse Array',
        lang: 'python',
        complexity: 'O(N)',
        category: 'Массивы',
        description: 'Используется для изменения порядка элементов на противоположный без выделения дополнительной памяти.',
        code: `def reverse_array(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr`,
        image: ''
    },
    {
        id: '6',
        name: 'Palindrome Check',
        lang: 'python',
        complexity: 'O(N)',
        category: 'Строки',
        description: 'Служит для проверки, читается ли строка одинаково слева направо и справа налево (для обработки текста и валидации данных).',
        code: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True`,
        image: ''
    },
    {
        id: '7',
        name: 'Factorial',
        lang: 'python',
        complexity: 'O(N)',
        category: 'Математика',
        description: 'Применяется в комбинаторике и теории вероятностей для подсчета количества возможных перестановок N элементов.',
        code: `def factorial(n):
    if n < 0:
        return None
    res = 1
    for i in range(2, n + 1):
        res *= i
    return res`,
        image: ''
    },
    {
        id: '8',
        name: 'Fibonacci',
        lang: 'python',
        complexity: 'O(N)',
        category: 'Математика',
        description: 'Используется для моделирования процессов роста, в алгоритмах планирования и динамическом программировании.',
        code: `def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`,
        image: ''
    },
    {
        id: '9',
        name: 'Greatest Common Divisor (GCD)',
        lang: 'python',
        complexity: 'O(log(min(A, B)))',
        category: 'Математика',
        description: 'Алгоритм Евклида. Используется для сокращения дробей, криптографии и нахождения периодов циклических процессов.',
        code: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a`,
        image: ''
    },
    {
        id: '10',
        name: 'Least Common Multiple (LCM)',
        lang: 'python',
        complexity: 'O(log(min(A, B)))',
        category: 'Математика',
        description: 'Применяется для приведения дробей к общему знаменателю и вычисления циклов синхронизации независимых событий.',
        code: `def lcm(a, b):
    def gcd(x, y):
        while y != 0:
            x, y = y, x % y
        return x
    return (a * b) // gcd(a, b) if a and b else 0`,
        image: ''
    },
    {
        id: '11',
        name: 'Is Prime',
        lang: 'python',
        complexity: 'O(sqrt(N))',
        category: 'Математика',
        description: 'Используется в криптографии и алгоритмах факторизации для проверки отсутствия делителей числа кроме 1 и самого себя.',
        code: `def is_prime(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True`,
        image: ''
    },
    {
        id: '12',
        name: 'Sum of Digits',
        lang: 'python',
        complexity: 'O(log10 N)',
        category: 'Математика',
        description: 'Применяется для вычисления контрольных сумм идентификаторов, хеширования и признаков делимости чисел.',
        code: `def sum_of_digits(n):
    n = abs(n)
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total`,
        image: ''
    },
    {
        id: '13',
        name: 'Decimal to Binary',
        lang: 'python',
        complexity: 'O(log2 N)',
        category: 'Математика',
        description: 'Служит для представления десятичных чисел в двоичной форме для битовых операций и работы с низкоуровневыми данными.',
        code: `def decimal_to_binary(n):
    if n == 0:
        return "0"
    res = []
    is_neg = n < 0
    n = abs(n)
    while n > 0:
        res.append(str(n % 2))
        n //= 2
    if is_neg:
        res.append("-")
    return "".join(reversed(res))`,
        image: ''
    },
    {
        id: '14',
        name: 'Binary Exponentiation',
        lang: 'python',
        complexity: 'O(log P)',
        category: 'Математика',
        description: 'Используется для эффективного вычисления больших степеней чисел за счет многократного возведения основания в квадрат.',
        code: `def power(base, exp):
    res = 1
    b = base
    e = exp
    while e > 0:
        if e % 2 == 1:
            res *= b
        b *= b
        e //= 2
    return res`,
        image: ''
    },
    {
        id: '15',
        name: 'Sieve of Eratosthenes',
        lang: 'python',
        complexity: 'O(N log log N)',
        category: 'Математика',
        description: 'Позволяет найти все простые числа до заданного предела N за один проход, отсеивая составные числа через кратные.',
        code: `def sieve_of_eratosthenes(limit):
    primes = []
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    for p in range(2, int(limit**0.5) + 1):
        if is_prime[p]:
            for i in range(p * p, limit + 1, p):
                is_prime[i] = False
    for p in range(2, limit + 1):
        if is_prime[p]:
            primes.append(p)
    return primes`,
        image: ''
    },
    {
        id: '16',
        name: 'Leap Year Check',
        lang: 'python',
        complexity: 'O(1)',
        category: 'Математика',
        description: 'Используется в календарях и планировщиках для корректного расчета количества дней в феврале (28 или 29).',
        code: `def is_leap_year(year):
    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    return year % 4 == 0`,
        image: ''
    },
    {
        id: '17',
        name: 'Count Vowels',
        lang: 'python',
        complexity: 'O(N)',
        category: 'Строки',
        description: 'Применяется в анализе текста, лингвистических метриках и определении сложности восприятия текстового контента.',
        code: `def count_vowels(s):
    vowels = set("aeiouyаеёиоуыэюяAEIOUYАЕЁИОУЫЭЮЯ")
    count = 0
    for char in s:
        if char in vowels:
            count += 1
    return count`,
        image: ''
    },
    {
        id: '18',
        name: 'Bubble Sort',
        lang: 'javascript',
        complexity: 'O(N^2)',
        category: 'Сортировка',
        description: 'Служит для базового упорядочивания небольших массивов путем попарного сравнения и всплытия максимального элемента в конец.',
        code: `function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}`,
        image: ''
    },
    {
        id: '19',
        name: 'Selection Sort',
        lang: 'javascript',
        complexity: 'O(N^2)',
        category: 'Сортировка',
        description: 'Применяется для сортировки с минимальным количеством операций физической перезаписи элементов в памяти.',
        code: `function selectionSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            let temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
    return arr;
}`,
        image: ''
    },
    {
        id: '20',
        name: 'Insertion Sort',
        lang: 'javascript',
        complexity: 'O(N^2)',
        category: 'Сортировка',
        description: 'Эффективна для почти отсортированных массивов или онлайн-потоков данных, где элементы поступают последовательно.',
        code: `function insertionSort(arr) {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
        image: ''
    },
    {
        id: '21',
        name: 'Counting Sort',
        lang: 'javascript',
        complexity: 'O(N + K)',
        category: 'Сортировка',
        description: 'Позволяет отсортировать массив целых чисел за линейное время, если диапазон значений (K) заранее ограничен.',
        code: `function countingSort(arr, maxVal) {
    let count = new Array(maxVal + 1).fill(0);
    for (let i = 0; i < arr.length; i++) {
        count[arr[i]]++;
    }
    let idx = 0;
    for (let val = 0; val <= maxVal; val++) {
        while (count[val] > 0) {
            arr[idx++] = val;
            count[val]--;
        }
    }
    return arr;
}`,
        image: ''
    },
    {
        id: '22',
        name: 'Merge Sorted Arrays',
        lang: 'javascript',
        complexity: 'O(N + M)',
        category: 'Массивы',
        description: 'Базовый шаг сортировки слиянием. Объединяет два готовых упорядоченных массива в один без повторной сортировки.',
        code: `function mergeSortedArrays(a, b) {
    let result = [];
    let i = 0, j = 0;
    while (i < a.length && j < b.length) {
        if (a[i] <= b[j]) {
            result.push(a[i++]);
        } else {
            result.push(b[j++]);
        }
    }
    while (i < a.length) result.push(a[i++]);
    while (j < b.length) result.push(b[j++]);
    return result;
}`,
        image: ''
    },
    {
        id: '23',
        name: 'Remove Duplicates',
        lang: 'javascript',
        complexity: 'O(N)',
        category: 'Массивы',
        description: 'Используется для фильтрации повторяющихся элементов на основе хеш-таблицы без изменения порядка уникальных значений.',
        code: `function removeDuplicates(arr) {
    let seen = {};
    let unique = [];
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (!seen[item]) {
            seen[item] = true;
            unique.push(item);
        }
    }
    return unique;
}`,
        image: ''
    },
    {
        id: '24',
        name: 'Rotate Array',
        lang: 'javascript',
        complexity: 'O(N)',
        category: 'Массивы',
        description: 'Используется в буферах обмена, каруселях интерфейсов и криптографических операциях перестановки элементов на K позиций.',
        code: `function rotateArray(arr, k) {
    let n = arr.length;
    if (n === 0) return arr;
    k = k % n;
    function reverse(l, r) {
        while (l < r) {
            let temp = arr[l];
            arr[l] = arr[r];
            arr[r] = temp;
            l++;
            r--;
        }
    }
    reverse(0, n - 1);
    reverse(0, k - 1);
    reverse(k, n - 1);
    return arr;
}`,
        image: ''
    },
    {
        id: '25',
        name: 'Find Second Largest',
        lang: 'javascript',
        complexity: 'O(N)',
        category: 'Массивы',
        description: 'Позволяет найти претендента на второе место (ранжирование участников) за один проход без полной сортировки массива.',
        code: `function findSecondLargest(arr) {
    if (arr.length < 2) return null;
    let first = -Infinity, second = -Infinity;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > first) {
            second = first;
            first = arr[i];
        } else if (arr[i] > second && arr[i] !== first) {
            second = arr[i];
        }
    }
    return second === -Infinity ? null : second;
}`,
        image: ''
    },
    {
        id: '26',
        name: 'Character Frequency',
        lang: 'javascript',
        complexity: 'O(N)',
        category: 'Строки',
        description: 'Используется для подсчета встречаемости символов при сжатии данных (Хаффман), анализе текста и проверке анаграмм.',
        code: `function getCharacterFrequency(str) {
    let freq = {};
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
}`,
        image: ''
    },
    {
        id: '27',
        name: 'Anagram Check',
        lang: 'javascript',
        complexity: 'O(N)',
        category: 'Строки',
        description: 'Применяется для проверки, составлены ли два слова из одного и того же набора букв с одинаковым количеством повторений.',
        code: `function isAnagram(s1, s2) {
    if (s1.length !== s2.length) return false;
    let count = {};
    for (let i = 0; i < s1.length; i++) {
        count[s1[i]] = (count[s1[i]] || 0) + 1;
        count[s2[i]] = (count[s2[i]] || 0) - 1;
    }
    for (let key in count) {
        if (count[key] !== 0) return false;
    }
    return true;
}`,
        image: ''
    },
    {
        id: '28',
        name: 'Reverse Words',
        lang: 'javascript',
        complexity: 'O(N)',
        category: 'Строки',
        description: 'Используется при форматировании предложений и парсинге текстовых команд с сохранением содержимого самих слов.',
        code: `function reverseWords(sentence) {
    let words = sentence.trim().split(/\\s+/);
    let left = 0, right = words.length - 1;
    while (left < right) {
        let temp = words[left];
        words[left] = words[right];
        words[right] = temp;
        left++;
        right--;
    }
    return words.join(" ");
}`,
        image: ''
    },
    {
        id: '29',
        name: 'Valid Parentheses',
        lang: 'javascript',
        complexity: 'O(N)',
        category: 'Структуры данных',
        description: 'Применяется в компиляторах и редакторах кода для валидации корректности открывающих и закрывающих скобок через стек.',
        code: `function isValidParentheses(s) {
    let stack = [];
    let map = { ')': '(', '}': '{', ']': '[' };
    for (let i = 0; i < s.length; i++) {
        let c = s[i];
        if (c === '(' || c === '{' || c === '[') {
            stack.push(c);
        } else if (c === ')' || c === '}' || c === ']') {
            if (stack.length === 0 || stack.pop() !== map[c]) {
                return false;
            }
        }
    }
    return stack.length === 0;
}`,
        image: ''
    },
    {
        id: '30',
        name: 'Stack',
        lang: 'javascript',
        complexity: 'O(1)',
        category: 'Структуры данных',
        description: 'Организует доступ по принципу LIFO (последним пришел - первым ушел) для истории действий, отмены (Undo) и рекурсивных вызовов.',
        code: `class Stack {
    constructor() {
        this.items = [];
    }
    push(item) {
        this.items.push(item);
    }
    pop() {
        return this.items.length === 0 ? null : this.items.pop();
    }
    peek() {
        return this.items.length === 0 ? null : this.items[this.items.length - 1];
    }
    isEmpty() {
        return this.items.length === 0;
    }
}`,
        image: ''
    },
    {
        id: '31',
        name: 'Queue',
        lang: 'javascript',
        complexity: 'O(1)',
        category: 'Структуры данных',
        description: 'Организует доступ по принципу FIFO (первым пришел - первым ушел) для очередей задач, печати и обхода графов в ширину.',
        code: `class Queue {
    constructor() {
        this.items = [];
        this.head = 0;
    }
    enqueue(item) {
        this.items.push(item);
    }
    dequeue() {
        if (this.head >= this.items.length) return null;
        let item = this.items[this.head];
        this.head++;
        return item;
    }
    isEmpty() {
        return this.head >= this.items.length;
    }
}`,
        image: ''
    },
    {
        id: '32',
        name: 'Run-Length Encoding (RLE)',
        lang: 'javascript',
        complexity: 'O(N)',
        category: 'Строки',
        description: 'Алгоритм RLE (Run-Length Encoding). Заменяет цепочки повторяющихся символов на символ и число повторов для сжатия данных.',
        code: `function compressString(s) {
    if (!s) return "";
    let res = "";
    let count = 1;
    for (let i = 0; i < s.length; i++) {
        if (i + 1 < s.length && s[i] === s[i + 1]) {
            count++;
        } else {
            res += s[i] + count;
            count = 1;
        }
    }
    return res.length < s.length ? res : s;
}`,
        image: ''
    },
    {
        id: '33',
        name: 'Prefix Sums 1D',
        lang: 'javascript',
        complexity: 'O(1) запрос',
        category: 'Массивы',
        description: 'Позволяет мгновенно отвечать на запросы о сумме элементов на любом подотрезке [L, R] после быстрого предподсчета.',
        code: `class PrefixSums {
    constructor(arr) {
        this.pref = new Array(arr.length + 1).fill(0);
        for (let i = 0; i < arr.length; i++) {
            this.pref[i + 1] = this.pref[i] + arr[i];
        }
    }
    getSum(l, r) {
        return this.pref[r + 1] - this.pref[l];
    }
}`,
        image: ''
    },
    {
        id: '34',
        name: 'Linear Interpolation (Lerp)',
        lang: 'javascript',
        complexity: 'O(1)',
        category: 'Математика',
        description: 'Формула Lerp. Применяется в компьютерной графике и анимации для плавного перехода между двумя числовыми состояниями.',
        code: `function lerp(start, end, t) {
    return start + (end - start) * Math.max(0, Math.min(1, t));
}`,
        image: ''
    },
    {
        id: '35',
        name: 'Quick Sort',
        lang: 'cpp',
        complexity: 'O(N log N)',
        category: 'Сортировка',
        description: 'Используется как стандартная универсальная сортировка большинства стандартных библиотек благодаря высокой скорости в памяти.',
        code: `void quickSort(std::vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int mid = arr[l + (r - l) / 2];
    int i = l, j = r;
    while (i <= j) {
        while (arr[i] < mid) i++;
        while (arr[j] > mid) j--;
        if (i <= j) {
            std::swap(arr[i], arr[j]);
            i++;
            j--;
        }
    }
    quickSort(arr, l, j);
    quickSort(arr, i, r);
}`,
        image: ''
    },
    {
        id: '36',
        name: 'Merge Sort',
        lang: 'cpp',
        complexity: 'O(N log N)',
        category: 'Сортировка',
        description: 'Гарантирует время O(N log N) в худшем случае и является устойчивой (сохраняет относительный порядок одинаковых ключей).',
        code: `void merge(std::vector<int>& arr, int l, int m, int r) {
    std::vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    std::vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < (int)left.size() && j < (int)right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < (int)left.size()) arr[k++] = left[i++];
    while (j < (int)right.size()) arr[k++] = right[j++];
}

void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
        image: ''
    },
    {
        id: '37',
        name: 'Ternary Search',
        lang: 'cpp',
        complexity: 'O(log N)',
        category: 'Поиск',
        description: 'Применяется для поиска точки оптимума (максимума или минимума) унимодальной функции без вычисления производных.',
        code: `double ternarySearch(double l, double r, double eps, double (*f)(double)) {
    while (r - l > eps) {
        double m1 = l + (r - l) / 3.0;
        double m2 = r - (r - l) / 3.0;
        if (f(m1) < f(m2)) l = m1;
        else r = m2;
    }
    return (l + r) / 2.0;
}`,
        image: ''
    },
    {
        id: '38',
        name: 'Two Sum Sorted',
        lang: 'cpp',
        complexity: 'O(N)',
        category: 'Массивы',
        description: 'Находит пару слагаемых для целевой суммы в отсортированном массиве без квадратичного перебора вложенными циклами.',
        code: `bool twoSumSorted(const std::vector<int>& arr, int target, int& idx1, int& idx2) {
    int left = 0, right = (int)arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) {
            idx1 = left;
            idx2 = right;
            return true;
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return false;
}`,
        image: ''
    },
    {
        id: '39',
        name: 'Sliding Window Maximum Sum',
        lang: 'cpp',
        complexity: 'O(N)',
        category: 'Массивы',
        description: 'Находит максимальную сумму подмассива фиксированного размера K за счет добавления правого и вычитания левого элементов.',
        code: `int maxSubarraySumK(const std::vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return 0;
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;
    for (int i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = std::max(maxSum, windowSum);
    }
    return maxSum;
}`,
        image: ''
    },
    {
        id: '40',
        name: 'Kadane Algorithm',
        lang: 'cpp',
        complexity: 'O(N)',
        category: 'Динамическое программирование',
        description: 'Находит непрерывный подмассив с наибольшей суммой элементов в одномерном массиве за один линейный проход.',
        code: `int maxSubArray(const std::vector<int>& arr) {
    int maxSoFar = arr[0];
    int currMax = arr[0];
    for (size_t i = 1; i < arr.size(); i++) {
        currMax = std::max(arr[i], currMax + arr[i]);
        maxSoFar = std::max(maxSoFar, currMax);
    }
    return maxSoFar;
}`,
        image: ''
    },
    {
        id: '41',
        name: 'Floyd Cycle Detection',
        lang: 'cpp',
        complexity: 'O(N)',
        category: 'Структуры данных',
        description: 'Алгоритм черепахи и зайца. Выявляет зацикливания в односвязных структурах данных без хранения посещенных адресов.',
        code: `struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

bool hasCycle(ListNode *head) {
    if (!head || !head->next) return false;
    ListNode *slow = head;
    ListNode *fast = head->next;
    while (slow != fast) {
        if (!fast || !fast->next) return false;
        slow = slow->next;
        fast = fast->next->next;
    }
    return true;
}`,
        image: ''
    },
    {
        id: '42',
        name: 'Depth First Search (DFS)',
        lang: 'cpp',
        complexity: 'O(V + E)',
        category: 'Графы',
        description: 'Используется для исследования лабиринтов, поиска компонент связности и проверки достижимости целевой вершины.',
        code: `void dfs(int v, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {
    visited[v] = true;
    for (int u : adj[v]) {
        if (!visited[u]) {
            dfs(u, adj, visited);
        }
    }
}`,
        image: ''
    },
    {
        id: '43',
        name: 'Breadth First Search (BFS)',
        lang: 'cpp',
        complexity: 'O(V + E)',
        category: 'Графы',
        description: 'Находит кратчайший путь в невзвешенных графах (по минимальному количеству ребер/шагов между вершинами).',
        code: `std::vector<int> bfs(int start, const std::vector<std::vector<int>>& adj) {
    int n = adj.size();
    std::vector<int> dist(n, -1);
    std::queue<int> q;
    dist[start] = 0;
    q.push(start);
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        for (int u : adj[v]) {
            if (dist[u] == -1) {
                dist[u] = dist[v] + 1;
                q.push(u);
            }
        }
    }
    return dist;
}`,
        image: ''
    },
    {
        id: '44',
        name: 'Bipartite Graph Check',
        lang: 'cpp',
        complexity: 'O(V + E)',
        category: 'Графы',
        description: 'Применяется для разбиения множества объектов на две неконфликтующие группы (задача раскраски в 2 цвета).',
        code: `bool isBipartite(const std::vector<std::vector<int>>& adj) {
    int n = adj.size();
    std::vector<int> color(n, -1);
    for (int i = 0; i < n; i++) {
        if (color[i] != -1) continue;
        std::queue<int> q;
        color[i] = 0;
        q.push(i);
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            for (int to : adj[v]) {
                if (color[to] == -1) {
                    color[to] = 1 - color[v];
                    q.push(to);
                } else if (color[to] == color[v]) {
                    return false;
                }
            }
        }
    }
    return true;
}`,
        image: ''
    },
    {
        id: '45',
        name: 'Topological Sort',
        lang: 'cpp',
        complexity: 'O(V + E)',
        category: 'Графы',
        description: 'Строит правильный порядок выполнения зависимых задач, сборки пакетов проектов и учебных курсов в DAG графах.',
        code: `std::vector<int> topologicalSort(int n, const std::vector<std::vector<int>>& adj) {
    std::vector<int> inDegree(n, 0), order;
    for (int i = 0; i < n; i++) {
        for (int to : adj[i]) inDegree[to]++;
    }
    std::queue<int> q;
    for (int i = 0; i < n; i++) {
        if (inDegree[i] == 0) q.push(i);
    }
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        order.push_back(v);
        for (int to : adj[v]) {
            if (--inDegree[to] == 0) q.push(to);
        }
    }
    return order.size() == (size_t)n ? order : std::vector<int>();
}`,
        image: ''
    },
    {
        id: '46',
        name: 'Dijkstra Algorithm',
        lang: 'cpp',
        complexity: 'O(E log V)',
        category: 'Графы',
        description: 'Используется в GPS-навигаторах и маршрутизации сетей для нахождения кратчайшего пути при неотрицательных весах ребер.',
        code: `std::vector<long long> dijkstra(int start, const std::vector<std::vector<std::pair<int, int>>>& adj) {
    int n = adj.size();
    std::vector<long long> dist(n, 1e18);
    std::priority_queue<std::pair<long long, int>, std::vector<std::pair<long long, int>>, std::greater<>> pq;
    dist[start] = 0;
    pq.push({0, start});
    while (!pq.empty()) {
        auto [d, v] = pq.top();
        pq.pop();
        if (d > dist[v]) continue;
        for (auto& edge : adj[v]) {
            int to = edge.first, w = edge.second;
            if (dist[v] + w < dist[to]) {
                dist[to] = dist[v] + w;
                pq.push({dist[to], to});
            }
        }
    }
    return dist;
}`,
        image: ''
    },
    {
        id: '47',
        name: 'Disjoint Set Union (DSU)',
        lang: 'cpp',
        complexity: 'O(alpha(N))',
        category: 'Структуры данных',
        description: 'Структура данных DSU. Быстро объединяет группы объектов и проверяет принадлежность элементов одной сети/кластеру.',
        code: `struct DSU {
    std::vector<int> parent;
    DSU(int n) : parent(n) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int v) {
        return parent[v] == v ? v : parent[v] = find(parent[v]);
    }
    bool unite(int a, int b) {
        a = find(a);
        b = find(b);
        if (a != b) {
            parent[b] = a;
            return true;
        }
        return false;
    }
};`,
        image: ''
    },
    {
        id: '48',
        name: 'Next Permutation',
        lang: 'cpp',
        complexity: 'O(N)',
        category: 'Комбинаторика',
        description: 'Генерирует следующую лексикографическую перестановку элементов (полный перебор вариантов и решение задачи коммивояжера).',
        code: `bool nextPermutation(std::vector<int>& arr) {
    int n = arr.size();
    int i = n - 2;
    while (i >= 0 && arr[i] >= arr[i + 1]) i--;
    if (i < 0) {
        std::reverse(arr.begin(), arr.end());
        return false;
    }
    int j = n - 1;
    while (arr[j] <= arr[i]) j--;
    std::swap(arr[i], arr[j]);
    std::reverse(arr.begin() + i + 1, arr.end());
    return true;
}`,
        image: ''
    },
    {
        id: '49',
        name: 'Euclidean Distance',
        lang: 'cpp',
        complexity: 'O(1)',
        category: 'Геометрия',
        description: 'Находит геометрическое расстояние по прямой между двумя точками на плоскости по теореме Пифагора.',
        code: `double euclideanDistance(double x1, double y1, double x2, double y2) {
    double dx = x2 - x1;
    double dy = y2 - y1;
    return std::sqrt(dx * dx + dy * dy);
}`,
        image: ''
    },
    {
        id: '50',
        name: 'Triangle Area by Coordinates',
        lang: 'cpp',
        complexity: 'O(1)',
        category: 'Геометрия',
        description: 'Метод косого (векторного) произведения. Вычисляет площадь треугольника на координатной сетке без нахождения высоты.',
        code: `double triangleArea(double x1, double y1, double x2, double y2, double x3, double y3) {
    return std::abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)) / 2.0;
}`,
        image: ''
    }
];

function activate(context) {
    context.globalState.update('algorithms', INITIAL_ALGOS);
    context.globalState.update('algo_db_version', 99);

    const CURRENT_VERSION = 3;
    const savedVersion = context.globalState.get('algo_db_version', 0);
    if (savedVersion < CURRENT_VERSION) {
        context.globalState.update('algorithms', INITIAL_ALGOS);
        context.globalState.update('algo_db_version', CURRENT_VERSION);
    }

    const completionProvider = vscode.languages.registerCompletionItemProvider(
        ['cpp', 'c', 'python'],
        {
            provideCompletionItems() {
                const algos = context.globalState.get('algorithms', INITIAL_ALGOS);
                return algos.map(algo => {
                    const item = new vscode.CompletionItem(algo.name, vscode.CompletionItemKind.Snippet);
                    item.insertText = new vscode.SnippetString(algo.code);
                    item.detail = `[${algo.lang ? algo.lang.toUpperCase() : 'C++'}] ${algo.complexity || ''}`;
                    item.documentation = new vscode.MarkdownString(`### ${algo.name}\n${algo.description || ''}\n\n**Сложность:** \`${algo.complexity || 'O(?)'}\``);
                    return item;
                });
            }
        }
    );
    context.subscriptions.push(completionProvider);

    let currentPanel = undefined;

    const openCommand = vscode.commands.registerCommand('algoHelper.openManager', () => {
        if (currentPanel) {
            currentPanel.reveal(vscode.ViewColumn.Beside);
            return;
        }

        currentPanel = vscode.window.createWebviewPanel(
            'algoManager',
            'Algo Studio',
            vscode.ViewColumn.Beside,
            { enableScripts: true, retainContextWhenHidden: true }
        );

        const currentData = context.globalState.get('algorithms', INITIAL_ALGOS);
        currentPanel.webview.html = getWebviewContent(currentData);

        currentPanel.webview.onDidReceiveMessage(async message => {
            let list = context.globalState.get('algorithms', INITIAL_ALGOS);
            switch (message.command) {
                case 'save': {
                    const idx = list.findIndex(item => item.id === message.algo.id);
                    if (idx >= 0) {
                        list[idx] = message.algo;
                    } else {
                        list.unshift({ ...message.algo, id: Date.now().toString() });
                    }
                    await context.globalState.update('algorithms', list);
                    currentPanel?.webview.postMessage({ command: 'load', data: list });
                    vscode.window.showInformationMessage(`Алгоритм "${message.algo.name}" сохранен`);
                    break;
                }
                case 'delete': {
                    list = list.filter(item => item.id !== message.id);
                    await context.globalState.update('algorithms', list);
                    currentPanel?.webview.postMessage({ command: 'load', data: list });
                    vscode.window.showInformationMessage('Алгоритм удален');
                    break;
                }
                case 'copy': {
                    await vscode.env.clipboard.writeText(message.code);
                    vscode.window.showInformationMessage('Код скопирован в буфер обмена');
                    break;
                }
                case 'reset_defaults': {
                    await context.globalState.update('algorithms', INITIAL_ALGOS);
                    currentPanel?.webview.postMessage({ command: 'load', data: INITIAL_ALGOS });
                    vscode.window.showInformationMessage('Базовые алгоритмы восстановлены');
                    break;
                }
            }
        }, undefined, context.subscriptions);

        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
        });
    });

    context.subscriptions.push(openCommand);
}

function getWebviewContent(initialData) {
    const jsonString = JSON.stringify(initialData || INITIAL_ALGOS);

    return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Algo Studio</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

<style>
    :root {
        --theme-accent: #cc785c;
        --theme-accent-hover: #b8654a;
        --theme-accent-soft: rgba(204, 120, 92, 0.15);
        --theme-bg: var(--vscode-editor-background, #18181b);
        --theme-card: var(--vscode-editorWidget-background, #222226);
        --theme-border: rgba(255, 255, 255, 0.08);
        --theme-text: var(--vscode-foreground, #f4f4f5);
        --theme-muted: #9ca3af;
        --theme-code-bg: #141416;
        --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.18);
        --shadow-md: 0 8px 24px -4px rgba(0, 0, 0, 0.35);
        --shadow-hover: 0 12px 32px -4px rgba(204, 120, 92, 0.22);
    }

    * { box-sizing: border-box; }
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: var(--theme-text);
        background: var(--theme-bg);
        margin: 0;
        padding: 24px;
        line-height: 1.5;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--theme-border);
    }
    .brand {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .brand-logo {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: linear-gradient(135deg, #d97757, #cc785c);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        color: white;
        font-size: 19px;
        box-shadow: 0 4px 12px rgba(204, 120, 92, 0.4);
    }
    .brand-title {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.5px;
        margin: 0;
    }
    .brand-sub {
        font-size: 12px;
        color: var(--theme-muted);
        margin: 0;
    }

    .toolbar {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }
    .search-box {
        flex: 1;
        min-width: 220px;
        position: relative;
    }
    .search-box input {
        width: 100%;
        background: var(--theme-card);
        border: 1px solid var(--theme-border);
        border-radius: 10px;
        padding: 10px 14px;
        color: var(--theme-text);
        font-size: 14px;
        outline: none;
        transition: all 0.2s ease;
        box-shadow: var(--shadow-sm);
    }
    .search-box input:focus {
        border-color: var(--theme-accent);
        box-shadow: 0 0 0 3px var(--theme-accent-soft);
    }

    .filter-pills {
        display: flex;
        gap: 6px;
        align-items: center;
    }
    .pill {
        background: var(--theme-card);
        border: 1px solid var(--theme-border);
        color: var(--theme-muted);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }
    .pill:hover, .pill.active {
        background: var(--theme-accent-soft);
        color: var(--theme-accent);
        border-color: var(--theme-accent);
    }

    .btn {
        background: var(--theme-accent);
        color: white;
        border: none;
        padding: 9px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(204, 120, 92, 0.3);
    }
    .btn:hover {
        background: var(--theme-accent-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(204, 120, 92, 0.4);
    }
    .btn-secondary {
        background: var(--theme-card);
        color: var(--theme-text);
        border: 1px solid var(--theme-border);
        box-shadow: var(--shadow-sm);
    }
    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: var(--theme-muted);
    }
    .btn-danger {
        background: transparent;
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
        box-shadow: none;
    }
    .btn-danger:hover {
        background: rgba(239, 68, 68, 0.12);
        border-color: #ef4444;
    }

    .form-wrapper {
        background: var(--theme-card);
        border: 1px solid var(--theme-border);
        border-radius: 14px;
        padding: 20px;
        margin-bottom: 24px;
        box-shadow: var(--shadow-md);
        display: none;
        animation: fadeIn 0.3s ease;
    }
    .form-wrapper.open { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

    .form-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 12px;
        margin-bottom: 12px;
    }
    .form-group { display: flex; flex-direction: column; gap: 4px; }
    .form-group label {
        font-size: 12px;
        font-weight: 600;
        color: var(--theme-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    input[type="text"], select, textarea {
        background: var(--theme-bg);
        border: 1px solid var(--theme-border);
        border-radius: 8px;
        padding: 9px 12px;
        color: var(--theme-text);
        font-size: 13px;
        outline: none;
        transition: border 0.2s;
    }
    input[type="text"]:focus, select:focus, textarea:focus {
        border-color: var(--theme-accent);
    }
    textarea {
        font-family: 'Consolas', 'Fira Code', monospace;
        resize: vertical;
    }

    .algo-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .card {
        background: var(--theme-card);
        border: 1px solid var(--theme-border);
        border-radius: 14px;
        padding: 18px 20px;
        box-shadow: var(--shadow-sm);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
    }
    .card:hover {
        border-color: rgba(204, 120, 92, 0.4);
        box-shadow: var(--shadow-hover);
        transform: translateY(-2px);
    }
    .card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
    }
    .card-title {
        font-size: 17px;
        font-weight: 700;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .badge {
        font-size: 11px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 6px;
        letter-spacing: 0.3px;
        text-transform: uppercase;
    }
    .badge-lang {
        background: #1e3a5f;
        color: #60a5fa;
        border: 1px solid rgba(96, 165, 250, 0.3);
    }
    .badge-complexity {
        background: #2e261f;
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .badge-cat {
        background: rgba(204, 120, 92, 0.15);
        color: var(--theme-accent);
    }
    .card-desc {
        color: var(--theme-muted);
        font-size: 13px;
        margin: 0 0 14px 0;
    }

    .code-container {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.05);
        background: var(--theme-code-bg);
    }
    .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 14px;
        background: rgba(255, 255, 255, 0.03);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        font-size: 11px;
        color: var(--theme-muted);
    }
    .mac-dots {
        display: flex;
        gap: 5px;
    }
    .dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
    }
    .dot-r { background: #ef4444; }
    .dot-y { background: #f59e0b; }
    .dot-g { background: #10b981; }

    pre {
        margin: 0;
        padding: 14px;
        overflow-x: auto;
        font-size: 12.5px;
        font-family: 'Consolas', 'Fira Code', Monaco, monospace;
        line-height: 1.45;
        max-height: 240px;
    }
    pre code.hljs {
        background: transparent !important;
        padding: 0 !important;
    }

    .card-actions {
        display: flex;
        gap: 8px;
        margin-top: 14px;
        justify-content: flex-end;
    }

    .preview-img {
        max-width: 100%;
        max-height: 220px;
        border-radius: 8px;
        margin-top: 12px;
        border: 1px solid var(--theme-border);
        display: block;
    }

    .copy-btn {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--theme-text);
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .copy-btn:hover {
        background: var(--theme-accent);
        color: white;
    }
</style>
</head>
<body>

    <div class="header">
        <div class="brand">
            <div class="brand-logo">A</div>
            <div>
                <h1 class="brand-title">Algo Studio</h1>
                <p class="brand-sub">Каталог и сниппеты алгоритмов</p>
            </div>
        </div>
        <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" onclick="toggleForm()">Новый алгоритм</button>
            <button class="btn btn-secondary" onclick="resetToDefaults()">Сброс</button>
        </div>
    </div>

    <div class="toolbar">
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Поиск по названию, сложности, категории..." oninput="filterAlgos()">
        </div>
        <div class="filter-pills">
            <div class="pill active" onclick="setLangFilter('all', this)">Все</div>
            <div class="pill" onclick="setLangFilter('cpp', this)">C++</div>
            <div class="pill" onclick="setLangFilter('python', this)">Python</div>
            <div class="pill" onclick="setLangFilter('java', this)">Java</div>
        </div>
    </div>

    <div class="form-wrapper" id="formWrapper">
        <h3 id="formTitle" style="margin-top: 0; font-size: 16px;">Добавить новый алгоритм</h3>
        <input type="hidden" id="algoId">
        
        <div class="form-grid">
            <div class="form-group">
                <label>Название:</label>
                <input type="text" id="algoName">
            </div>
            <div class="form-group">
                <label>Язык:</label>
                <select id="algoLang">
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                </select>
            </div>
            <div class="form-group">
                <label>Сложность:</label>
                <input type="text" id="algoComplexity" placeholder="O(N log N)">
            </div>
        </div>

        <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="form-group">
                <label>Категория:</label>
                <input type="text" id="algoCategory" placeholder="Сортировка, Графы...">
            </div>
            <div class="form-group">
                <label>Описание:</label>
                <input type="text" id="algoDesc">
            </div>
        </div>

        <div class="form-group" style="margin-bottom: 12px;">
            <label>Исходный код:</label>
            <textarea id="algoCode" rows="6"></textarea>
        </div>

        <div class="form-group" style="margin-bottom: 14px;">
            <label>Иллюстрация (опционально):</label>
            <input type="file" id="algoFile" accept="image/*">
            <div id="filePreviewContainer"></div>
        </div>

        <div style="display: flex; gap: 8px;">
            <button class="btn" onclick="saveAlgo()">Сохранить</button>
            <button class="btn btn-secondary" onclick="toggleForm(false)">Отмена</button>
        </div>
    </div>

    <div id="algoList" class="algo-grid"></div>

<script>
    const vscode = acquireVsCodeApi();
    let algos = ${jsonString};
    let currentImageBase64 = '';
    let selectedLang = 'all';

    function toggleForm(open) {
        const fw = document.getElementById('formWrapper');
        if (open !== undefined) {
            fw.classList.toggle('open', open);
        } else {
            fw.classList.toggle('open');
        }
        if (!fw.classList.contains('open')) resetForm();
    }

    document.getElementById('algoFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentImageBase64 = event.target.result;
                document.getElementById('filePreviewContainer').innerHTML = 
                    '<img class="preview-img" src="' + currentImageBase64 + '">';
            };
            reader.readAsDataURL(file);
        }
    });

    function saveAlgo() {
        const name = document.getElementById('algoName').value.trim();
        const code = document.getElementById('algoCode').value;
        const lang = document.getElementById('algoLang').value;
        const complexity = document.getElementById('algoComplexity').value.trim();
        const category = document.getElementById('algoCategory').value.trim();
        const desc = document.getElementById('algoDesc').value.trim();
        const id = document.getElementById('algoId').value;

        if (!name || !code) {
            alert('Заполните название и код');
            return;
        }

        vscode.postMessage({
            command: 'save',
            algo: { id, name, lang, complexity, category, description: desc, code, image: currentImageBase64 }
        });
        toggleForm(false);
    }

    function resetForm() {
        document.getElementById('algoId').value = '';
        document.getElementById('algoName').value = '';
        document.getElementById('algoDesc').value = '';
        document.getElementById('algoCode').value = '';
        document.getElementById('algoComplexity').value = '';
        document.getElementById('algoCategory').value = '';
        document.getElementById('algoFile').value = '';
        currentImageBase64 = '';
        document.getElementById('filePreviewContainer').innerHTML = '';
        document.getElementById('formTitle').innerText = 'Добавить новый алгоритм';
    }

    function editAlgo(id) {
        const a = algos.find(x => x.id === id);
        if (!a) return;
        document.getElementById('algoId').value = a.id;
        document.getElementById('algoName').value = a.name;
        document.getElementById('algoLang').value = a.lang || 'cpp';
        document.getElementById('algoComplexity').value = a.complexity || '';
        document.getElementById('algoCategory').value = a.category || '';
        document.getElementById('algoDesc').value = a.description || '';
        document.getElementById('algoCode').value = a.code;
        currentImageBase64 = a.image || '';
        document.getElementById('filePreviewContainer').innerHTML = currentImageBase64 
            ? '<img class="preview-img" src="' + currentImageBase64 + '">' : '';
        document.getElementById('formTitle').innerText = 'Редактировать: ' + a.name;
        toggleForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteAlgo(id) {
        if (confirm('Удалить этот алгоритм?')) {
            vscode.postMessage({ command: 'delete', id });
        }
    }

    function copyCode(id, btn) {
        const a = algos.find(x => x.id === id);
        if (a) {
            vscode.postMessage({ command: 'copy', code: a.code });
            const oldText = btn.innerHTML;
            btn.innerHTML = 'Скопировано';
            setTimeout(() => {
                btn.innerHTML = oldText;
            }, 1800);
        }
    }

    function resetToDefaults() {
        if (confirm('Восстановить базовые алгоритмы?')) {
            vscode.postMessage({ command: 'reset_defaults' });
        }
    }

    function setLangFilter(lang, el) {
        selectedLang = lang;
        document.querySelectorAll('.filter-pills .pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        filterAlgos();
    }

    function filterAlgos() {
        const query = (document.getElementById('searchInput').value || '').toLowerCase().trim();
        const filtered = algos.filter(a => {
            const matchesQuery = !query || 
                                 (a.name || '').toLowerCase().includes(query) ||
                                 (a.description || '').toLowerCase().includes(query) ||
                                 (a.complexity || '').toLowerCase().includes(query) ||
                                 (a.category || '').toLowerCase().includes(query);
            const matchesLang = selectedLang === 'all' || (a.lang || 'cpp').toLowerCase() === selectedLang;
            return matchesQuery && matchesLang;
        });
        renderCards(filtered);
    }

    window.addEventListener('message', event => {
        if (event.data.command === 'load') {
            algos = event.data.data;
            filterAlgos();
        }
    });

    function escapeHtml(str) {
        return (str || '').replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;');
    }

    function renderCards(list) {
        const container = document.getElementById('algoList');
        container.innerHTML = '';

        if (!list || list.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--theme-muted);">Ничего не найдено</div>';
            return;
        }

        list.forEach(a => {
            const card = document.createElement('div');
            card.className = 'card';
            const langClass = 'language-' + (a.lang || 'cpp');

            card.innerHTML = \`
                <div class="card-top">
                    <div>
                        <h2 class="card-title">
                            \${escapeHtml(a.name)}
                            <span class="badge badge-lang">\${escapeHtml((a.lang || 'cpp').toUpperCase())}</span>
                            \${a.complexity ? '<span class="badge badge-complexity">' + escapeHtml(a.complexity) + '</span>' : ''}
                            \${a.category ? '<span class="badge badge-cat">' + escapeHtml(a.category) + '</span>' : ''}
                        </h2>
                    </div>
                </div>

                <p class="card-desc">\${escapeHtml(a.description || '')}</p>

                <div class="code-container">
                    <div class="code-header">
                        <div class="mac-dots">
                            <div class="dot dot-r"></div>
                            <div class="dot dot-y"></div>
                            <div class="dot dot-g"></div>
                        </div>
                        <button class="copy-btn" onclick="copyCode('\${a.id}', this)">Скопировать код</button>
                    </div>
                    <pre><code class="\${langClass}">\${escapeHtml(a.code)}</code></pre>
                </div>

                \${a.image ? '<img class="preview-img" src="' + a.image + '">' : ''}

                <div class="card-actions">
                    <button class="btn btn-secondary" onclick="editAlgo('\${a.id}')">Редактировать</button>
                    <button class="btn btn-danger" onclick="deleteAlgo('\${a.id}')">Удалить</button>
                </div>
            \`;
            container.appendChild(card);
        });

        if (window.hljs) {
            document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
        }
    }

    filterAlgos();
</script>
</body>
</html>`;
}

function deactivate() {}

module.exports = { activate, deactivate };