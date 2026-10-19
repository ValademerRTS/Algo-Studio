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
    const CURRENT_VERSION = 2;
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
<style>
    body { font-family: var(--vscode-font-family, sans-serif); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 16px; margin: 0; }
    .card { background: var(--vscode-editorWidget-background); border: 1px solid var(--vscode-widget-border, #333); border-radius: 8px; padding: 14px; margin-bottom: 12px; }
    input, textarea, select { width: 100%; box-sizing: border-box; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border, #444); padding: 8px; border-radius: 6px; margin-top: 4px; margin-bottom: 8px; font-family: inherit; }
    textarea { font-family: monospace; }
    button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; margin-right: 6px; font-size: 13px; font-weight: 500; }
    button:hover { background: var(--vscode-button-hoverBackground); }
    .btn-secondary { background: var(--vscode-button-secondaryBackground, #444); color: var(--vscode-button-secondaryForeground, #fff); }
    .btn-danger { background: var(--vscode-errorForeground, #d9534f); color: #fff; }
    .preview-img { max-width: 100%; max-height: 220px; border-radius: 6px; margin-top: 8px; border: 1px solid var(--vscode-widget-border, #444); display: block; }
    pre { background: var(--vscode-textCodeBlock-background, #141416); padding: 10px; border-radius: 6px; overflow-x: auto; font-size: 12px; }
</style>
</head>
<body>
    <div class="card">
        <h3 id="formTitle" style="margin-top:0;">Добавить / Редактировать алгоритм</h3>
        <input type="hidden" id="algoId">
        <label>Название:</label>
        <input type="text" id="algoName">
        <label>Язык:</label>
        <select id="algoLang">
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
        </select>
        <label>Сложность:</label>
        <input type="text" id="algoComplexity">
        <label>Категория:</label>
        <input type="text" id="algoCategory">
        <label>Описание:</label>
        <input type="text" id="algoDesc">
        <label>Код реализации:</label>
        <textarea id="algoCode" rows="6"></textarea>
        <label>Изображение:</label>
        <input type="file" id="algoFile" accept="image/*">
        <div id="filePreviewContainer"></div>
        <div style="margin-top: 10px;">
            <button onclick="saveAlgo()">Сохранить</button>
            <button class="btn-secondary" onclick="resetForm()">Очистить</button>
            <button class="btn-secondary" onclick="resetToDefaults()">Сбросить к базовым</button>
        </div>
    </div>

    <h3>Список алгоритмов</h3>
    <div id="algoList"></div>

<script>
    const vscode = acquireVsCodeApi();
    let algos = ${jsonString};
    let currentImageBase64 = '';

    document.getElementById('algoFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentImageBase64 = event.target.result;
                document.getElementById('filePreviewContainer').innerHTML = '<img class="preview-img" src="' + currentImageBase64 + '">';
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
        resetForm();
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
        document.getElementById('formTitle').innerText = 'Добавить / Редактировать алгоритм';
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
        document.getElementById('filePreviewContainer').innerHTML = currentImageBase64 ? '<img class="preview-img" src="' + currentImageBase64 + '">' : '';
        document.getElementById('formTitle').innerText = 'Редактировать: ' + a.name;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function deleteAlgo(id) {
        if (confirm('Удалить этот алгоритм?')) {
            vscode.postMessage({ command: 'delete', id });
        }
    }

    function copyCode(id) {
        const a = algos.find(x => x.id === id);
        if (a) {
            vscode.postMessage({ command: 'copy', code: a.code });
        }
    }

    function resetToDefaults() {
        if (confirm('Восстановить базовые алгоритмы?')) {
            vscode.postMessage({ command: 'reset_defaults' });
        }
    }

    window.addEventListener('message', event => {
        if (event.data.command === 'load') {
            algos = event.data.data;
            renderList();
        }
    });

    function escapeHtml(str) {
        return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderList() {
        const container = document.getElementById('algoList');
        container.innerHTML = '';
        algos.forEach(a => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = \`
                <div><strong>\${escapeHtml(a.name)}</strong> [\${escapeHtml(a.lang || 'cpp')}] \${escapeHtml(a.complexity || '')}</div>
                <div style="font-size:12px; color:var(--vscode-descriptionForeground); margin:4px 0 8px;">\${escapeHtml(a.description || '')}</div>
                <pre><code>\${escapeHtml(a.code)}</code></pre>
                \${a.image ? '<img class="preview-img" src="' + a.image + '">' : ''}
                <div style="margin-top: 8px;">
                    <button onclick="copyCode('\${a.id}')">Копировать</button>
                    <button class="btn-secondary" onclick="editAlgo('\${a.id}')">Редактировать</button>
                    <button class="btn-danger" onclick="deleteAlgo('\${a.id}')">Удалить</button>
                </div>
            \`;
            container.appendChild(card);
        });
    }

    renderList();
</script>
</body>
</html>`;
}

function deactivate() {}

module.exports = { activate, deactivate };