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
        description: 'Бинарный поиск в отсортированном массиве',
        code: `int binarySearch(const int arr[], int n, int target) {\n    int l = 0, r = n - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}`,
        image: ''
    },
    {
        id: '5',
        name: 'Решето Эратосфена',
        lang: 'cpp',
        complexity: 'O(N log log N)',
        category: 'Математика',
        description: 'Поиск простых чисел до N',
        code: `std::vector<bool> sieve(int n) {\n    std::vector<bool> is_prime(n + 1, true);\n    is_prime[0] = is_prime[1] = false;\n    for (int i = 2; i * i <= n; i++) {\n        if (is_prime[i]) {\n            for (int j = i * i; j <= n; j += i) {\n                is_prime[j] = false;\n            }\n        }\n    }\n    return is_prime;\n}`,
        image: ''
    },
    {
        id: '6',
        name: 'Префиксные суммы',
        lang: 'cpp',
        complexity: 'O(1)',
        category: 'Массивы',
        description: 'Сумма на отрезке за O(1)',
        code: `std::vector<long long> buildPrefixSums(const std::vector<int>& arr) {\n    int n = arr.size();\n    std::vector<long long> pref(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        pref[i + 1] = pref[i] + arr[i];\n    }\n    return pref;\n}\n\nlong long getRangeSum(const std::vector<long long>& pref, int l, int r) {\n    return pref[r + 1] - pref[l];\n}`,
        image: ''
    }
];

function activate(context) {
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
            { enableScripts: true }
        );

        currentPanel.webview.html = getWebviewContent(context.globalState.get('algorithms', INITIAL_ALGOS));

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
                    currentPanel.webview.postMessage({ command: 'load', data: list });
                    vscode.window.showInformationMessage(`Алгоритм "${message.algo.name}" сохранен.`);
                    break;
                }
                case 'delete': {
                    list = list.filter(item => item.id !== message.id);
                    await context.globalState.update('algorithms', list);
                    currentPanel.webview.postMessage({ command: 'load', data: list });
                    vscode.window.showInformationMessage('Алгоритм удален.');
                    break;
                }
                case 'copy': {
                    await vscode.env.clipboard.writeText(message.code);
                    vscode.window.showInformationMessage('Код скопирован в буфер обмена.');
                    break;
                }
                case 'reset_defaults': {
                    await context.globalState.update('algorithms', INITIAL_ALGOS);
                    currentPanel.webview.postMessage({ command: 'load', data: INITIAL_ALGOS });
                    vscode.window.showInformationMessage('Базовые алгоритмы восстановлены.');
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
<style>
    *, *::before, *::after {
        box-sizing: border-box;
    }

    body {
        font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
        font-size: var(--vscode-font-size, 13px);
        line-height: 1.45;
        color: var(--vscode-foreground);
        background-color: var(--vscode-editor-background);
        padding: 16px;
        margin: 0;
    }

    h3 {
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--vscode-foreground);
        margin: 0 0 12px 0;
    }

    label {
        display: block;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        color: var(--vscode-descriptionForeground);
        margin: 8px 0 4px;
    }

    input[type="text"],
    select,
    textarea {
        width: 100%;
        background-color: var(--vscode-input-background);
        color: var(--vscode-input-foreground);
        border: 1px solid var(--vscode-input-border, transparent);
        border-radius: 3px;
        padding: 6px 8px;
        font-size: 13px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.1s ease;
    }

    input[type="text"]:focus,
    select:focus,
    textarea:focus {
        border-color: var(--vscode-focusBorder);
    }

    input[type="file"] {
        font-size: 12px;
        color: var(--vscode-descriptionForeground);
        margin-top: 4px;
    }

    textarea {
        font-family: var(--vscode-editor-font-family, Consolas, monospace);
        font-size: 12px;
        line-height: 1.4;
        resize: vertical;
        min-height: 90px;
    }

    button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 28px;
        padding: 0 12px;
        border: 1px solid transparent;
        border-radius: 2px;
        background-color: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
    }

    button:hover {
        background-color: var(--vscode-button-hoverBackground);
    }

    button:focus {
        outline: 1px solid var(--vscode-focusBorder);
        outline-offset: 1px;
    }

    .btn-secondary {
        background-color: var(--vscode-button-secondaryBackground);
        color: var(--vscode-button-secondaryForeground);
    }

    .btn-secondary:hover {
        background-color: var(--vscode-button-secondaryHoverBackground);
    }

    .btn-danger {
        background-color: transparent;
        color: var(--vscode-errorForeground, #f48771);
        border: 1px solid rgba(244, 135, 113, 0.3);
    }

    .btn-danger:hover {
        background-color: rgba(244, 135, 113, 0.12);
    }

    .card {
        background-color: var(--vscode-editorWidget-background);
        border: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.2));
        border-radius: 4px;
        padding: 12px 14px;
        margin-bottom: 12px;
    }

    .badge {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.3px;
        background-color: var(--vscode-badge-background);
        color: var(--vscode-badge-foreground);
        margin-left: 4px;
        vertical-align: middle;
    }

    pre {
        background-color: var(--vscode-textCodeBlock-background);
        border: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.15));
        border-radius: 3px;
        padding: 8px 10px;
        margin: 8px 0;
        overflow-x: auto;
        font-family: var(--vscode-editor-font-family, Consolas, monospace);
        font-size: 12px;
        line-height: 1.45;
    }

    .preview-img {
        max-width: 100%;
        max-height: 220px;
        object-fit: contain;
        display: block;
        margin: 8px 0;
        border-radius: 3px;
        border: 1px solid var(--vscode-widget-border, rgba(128, 128, 128, 0.2));
    }

    .filter-panel {
        display: flex;
        gap: 8px;
        margin-bottom: 14px;
    }
    .filter-panel input {
        flex: 1;
        margin: 0; 
    }

    .filter-panel select {
        width: 130px;
        margin: 0;
    }
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
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
        </select>
        <label>Сложность:</label>
        <input type="text" id="algoComplexity" placeholder="например: O(N log N)">
        <label>Категория:</label>
        <input type="text" id="algoCategory" placeholder="например: Сортировка">
        <label>Описание:</label>
        <input type="text" id="algoDesc">
        <label>Код:</label>
        <textarea id="algoCode" rows="6"></textarea>
        <label>Изображение:</label>
        <input type="file" id="algoFile" accept="image/*">
        <div id="filePreviewContainer"></div>
        <div style="margin-top: 8px;">
            <button onclick="saveAlgo()">Сохранить</button>
            <button class="btn-secondary" onclick="resetForm()">Очистить форму</button>
            <button class="btn-secondary" onclick="resetToDefaults()">Сбросить к базовым</button>
        </div>
    </div>

    <h3>Список алгоритмов</h3>
    <div class="filter-panel">
        <input type="text" id="searchInput" placeholder="Поиск по названию, описанию, тегам..." oninput="filterAlgos()">
        <select id="langFilter" onchange="filterAlgos()">
            <option value="all">Все языки</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
        </select>
    </div>

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
        document.getElementById('algoComplexity').value = '';
        document.getElementById('algoCategory').value = '';
        document.getElementById('algoDesc').value = '';
        document.getElementById('algoCode').value = '';
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

    function filterAlgos() {
        const query = (document.getElementById('searchInput').value || '').toLowerCase().trim();
        const selectedLang = document.getElementById('langFilter').value;

        const filtered = algos.filter(a => {
            const matchesQuery = !query || 
                (a.name || '').toLowerCase().includes(query) ||
                (a.description || '').toLowerCase().includes(query) ||
                (a.complexity || '').toLowerCase().includes(query) ||
                (a.category || '').toLowerCase().includes(query);
            const matchesLang = selectedLang === 'all' || (a.lang || 'cpp').toLowerCase() === selectedLang;
            return matchesQuery && matchesLang;
        });

        renderList(filtered);
    }

    window.addEventListener('message', event => {
        if (event.data.command === 'load') {
            algos = event.data.data;
            filterAlgos();
        }
    });

    function escapeHtml(str) {
        return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderList(listToRender) {
        const list = listToRender !== undefined ? listToRender : algos;
        const container = document.getElementById('algoList');
        container.innerHTML = '';

        if (list.length === 0) {
            container.innerHTML = '<div style="color:var(--vscode-descriptionForeground); padding: 10px 0;">Ничего не найдено</div>';
            return;
        }

        list.forEach(a => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = \`
                <div>
                    <strong>\${escapeHtml(a.name)}</strong>
                    <span class="badge">\${escapeHtml((a.lang || 'cpp').toUpperCase())}</span>
                    \${a.complexity ? '<span class="badge">' + escapeHtml(a.complexity) + '</span>' : ''}
                    \${a.category ? '<span class="badge">' + escapeHtml(a.category) + '</span>' : ''}
                </div>
                <div style="font-size:12px; color:var(--vscode-descriptionForeground); margin:4px 0;">\${escapeHtml(a.description || '')}</div>
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

    filterAlgos();
</script>
</body>
</html>`;
}

function deactivate() {}

module.exports = { activate, deactivate };