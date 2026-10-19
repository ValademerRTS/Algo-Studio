const vscode = require('vscode');

const INITIAL_ALGOS = [
    {
        id: '1',
        name: 'Quick Sort',
        lang: 'cpp',
        complexity: 'O(N log N)',
        category: 'Сортировка',
        description: 'Быстрая сортировка Хоара (медиана трех)',
        code: `void QuickSort(int arr[], int l, int r) {\n    if (l >= r) return;\n\n    int mi = (l + r) / 2;\n    if (arr[l] > arr[mi]) std::swap(arr[l], arr[mi]);\n    if (arr[l] > arr[r]) std::swap(arr[l], arr[r]);\n    if (arr[mi] > arr[r]) std::swap(arr[mi], arr[r]);\n    \n    int i = l, j = r;\n    int mid = arr[mi];\n\n    while (true) {\n        while (arr[i] < mid) i++;\n        while (arr[j] > mid) j--;\n        if (i >= j) break;\n        std::swap(arr[i], arr[j]);\n        i++;\n        j--;\n    }\n\n    QuickSort(arr, l, j);\n    QuickSort(arr, j + 1, r);\n}`,
        image: ''
    },
    {
        id: '2',
        name: 'Merge Sort',
        lang: 'cpp',
        complexity: 'O(N log N)',
        category: 'Сортировка',
        description: 'Сортировка слиянием и подсчет инверсий',
        code: `long long MergeCount(int arr[], int res[], int l, int r) {\n    if (l + 1 >= r) return 0;\n\n    int mid = (l + r) / 2;\n    long long ans = 0;\n\n    ans += MergeCount(arr, res, l, mid);\n    ans += MergeCount(arr, res, mid, r);\n\n    int i = l, j = mid, k = l;\n    while (i < mid && j < r) {\n        if (arr[i] <= arr[j]) {\n            res[k++] = arr[i++];\n        } else {\n            ans += mid - i;\n            res[k++] = arr[j++];\n        }\n    }\n\n    while (i < mid) res[k++] = arr[i++];\n    while (j < r) res[k++] = arr[j++];\n\n    for (int t = l; t < r; t++) arr[t] = res[t];\n    return ans;\n}`,
        image: ''
    },
    {
        id: '3',
        name: 'Counting Sort',
        lang: 'cpp',
        complexity: 'O(N + K)',
        category: 'Сортировка',
        description: 'Сортировка подсчетом за линейное время',
        code: `void countingSort(int arr[], int n, int maxVal) {\n    std::vector<int> count(maxVal + 1, 0);\n    for (int i = 0; i < n; i++) {\n        count[arr[i]]++;\n    }\n    int idx = 0;\n    for (int val = 0; val <= maxVal; val++) {\n        while (count[val] > 0) {\n            arr[idx++] = val;\n            count[val]--;\n        }\n    }\n}`,
        image: ''
    },
    {
        id: '4',
        name: 'Binary Search',
        lang: 'cpp',
        complexity: 'O(log N)',
        category: 'Поиск',
        description: 'Бинарный поиск элемента в отсортированном массиве',
        code: `int binarySearch(const int arr[], int n, int target) {\n    int l = 0, r = n - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}`,
        image: ''
    },
    {
        id: '5',
        name: 'Решето Эратосфена',
        lang: 'cpp',
        complexity: 'O(N log log N)',
        category: 'Математика',
        description: 'Поиск всех простых чисел до N',
        code: `std::vector<bool> sieve(int n) {\n    std::vector<bool> is_prime(n + 1, true);\n    is_prime[0] = is_prime[1] = false;\n    for (int i = 2; i * i <= n; i++) {\n        if (is_prime[i]) {\n            for (int j = i * i; j <= n; j += i) {\n                is_prime[j] = false;\n            }\n        }\n    }\n    return is_prime;\n}`,
        image: ''
    },
    {
        id: '6',
        name: 'Префиксные суммы',
        lang: 'cpp',
        complexity: 'O(1)',
        category: 'Массивы',
        description: 'Сумма на любом подотрезке за O(1)',
        code: `std::vector<long long> buildPrefixSums(const std::vector<int>& arr) {\n    int n = arr.size();\n    std::vector<long long> pref(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        pref[i + 1] = pref[i] + arr[i];\n    }\n    return pref;\n}\n\nlong long getRangeSum(const std::vector<long long>& pref, int l, int r) {\n    return pref[r + 1] - pref[l];\n}`,
        image: ''
    }
];

function activate(context) {
    const CURRENT_VERSION = 1;
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
                    item.detail = `[${algo.lang?.toUpperCase() || 'C++'}] ${algo.complexity || ''}`;
                    item.documentation = new vscode.MarkdownString(`### ${algo.name}\n${algo.description || ''}\n\n**Сложность:** \`${algo.complexity || 'O(?)'}\``);
                    return item;
                });
            }
        }
    );
    context.subscriptions.push(completionProvider);

    const openCommand = vscode.commands.registerCommand('algoHelper.openManager', () => {
        vscode.window.showInformationMessage('Algo Manager доступен через Webview интерфейс.');
    });
    context.subscriptions.push(openCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };