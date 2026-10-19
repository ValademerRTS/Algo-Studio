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