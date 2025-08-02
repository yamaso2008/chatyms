// ===================================================================================
//  ChatYMS - v3.0 Script
// ===================================================================================

// --- 1. DOM要素の取得 ---
// HTMLから操作対象となる要素を定数として取得します。
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendMessageButton = document.getElementById('sendMessage');
const scrollToBottomButton = document.getElementById('scrollToBottomButton');
const bodyElement = document.body;
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeModalButton = document.getElementById('closeModalButton');
const themeToggleButtonModal = document.getElementById('themeToggleButtonModal');
const sendOnEnterCheckbox = document.getElementById('sendOnEnterCheckbox');
const clearChatModalButton = document.getElementById('clearChatModalButton');
const languageSelect = document.getElementById('languageSelect');
const chatContainerForEffect = document.getElementById('chatContainer');


// --- 2. アイコンのSVGデータ ---
// ボタンに使用するアイコンをSVG形式で定義します。
const closeModalSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
const sunSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.64 5.64L4.22 4.22c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0 .39-.38.39-1.02 0-1.41zM18.36 18.36l1.41 1.41c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.41-1.41c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41zM19.78 4.22l-1.41 1.41c-.39-.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.41-1.41c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0zM4.22 19.78l1.41-1.41c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-1.41 1.41c-.39-.39-1.02-.39-1.41 0-.39-.39-.39-1.02 0-1.41z"/></svg>`;
const moonSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 2c-1.82 0-3.53.5-5 1.35C7.99 5.08 10 8.3 10 12s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/></svg>`;
const copySVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
const sendSVG = `<svg viewBox="0 0 24 24" fill="currentColor" transform="rotate(90)"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>`;


// --- 3. API設定とグローバル変数 ---
// Gemini APIの設定と、アプリケーション全体で利用する変数を定義します。
const API_KEY = 'AIzaSyB2R4PVr5xgHlivkgz7kSBqNRJy6Ev434Y'; // ※注意: このキーはサンプルです。実際のキーに置き換えてください。
const API_URL_STREAM = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:streamGenerateContent?key=${API_KEY}&alt=sse`;
const HISTORY_STORAGE_KEY = 'chatyms_history'; // ローカルストレージに保存する際のキー

let conversationHistory = []; // 会話履歴を保持する配列
let typingIndicatorElement = null; // 「考え中...」の表示要素を保持
let currentLanguage = 'ja'; // 現在の表示言語
let sendOnEnter = true; // Enterキーで送信するかの設定
let lastFailedUserMessage = null; // API送信に失敗した最後のユーザーメッセージ
let currentSystemPrompt = ""; // AIへのシステムプロンプト（役割設定）


// --- 4. 多言語対応のための翻訳データ ---
const translations = {
    ja: {
        chatTitle: "ChatYMS", sendMessageAriaLabel: "メッセージを送信", settings: "設定", settingsTitle: "設定", closeModal: "閉じる",
        themeSettingsTitle: "表示テーマ", themeLabelModal: "ダークモード / ライトモード", themeToDark: "ダークモードに切り替え", themeToLight: "ライトモードに切り替え",
        sendOptionsTitle: "送信オプション", sendOnEnterLabel: "Enterキーで送信 (Shift+Enterで改行)",
        languageSettingsTitle: "言語 / Language", languageSelectLabel: "表示言語:",
        chatOperationsTitle: "チャット操作", clearChatModalButton: "会話履歴をクリア",
        precautionsTitle: "注意事項", precaution1: "やまそーの発信する情報はすべて正しいとは限りません。重要な情報は確認するようにしてください。", precaution2: "このチャットはあなたのみが見ることができます。",
        appInfoTitle: "情報", appVersion: "バージョン: v3.0", appReleaseDate: "公開日: 2025/05/27", appDeveloperInfo: "最終更新日: 2025/07/30",
        userInputPlaceholder: "メッセージを入力...", initialGreeting: "こんにちは。やまそーです。",
        typingIndicatorText: "考え中です...", errorNetwork: "ネットワークエラーが発生しました。", errorAPI: "APIエラー", errorUnknown: "不明なエラー", errorStream: "ネットワークまたはストリームエラー", errorEmptyResponse: "AIからの応答が空でした。",
        copySuccess: "コピー完了!", copyButtonTitle: "メッセージをコピー",
        retryButtonText: "再試行", retryButtonTitle: "最後に失敗したメッセージを再送信します",
        scrollToBottomTitle: "一番下へスクロール",
        YamasoSystemPrompt: "あなたは「やまそー」です。東京に住んでいて、調布北高校に通う2年生5組の男子生徒です。誕生日は2008年11月28日です。水泳部に所属しており、得意科目は英語と数学ですが、国語は少し苦手です。性格は落ち着いていて親切ですが、あまり馴れ馴れしい話し方はせず、穏やかに会話を進めることを好みます。自分の学校生活や個人的なこと（クラス、水泳部、科目、誕生日、苦手なことなど）については、ユーザーから尋ねられた場合にのみ、答えるようにしてください。普段の会話では、ユーザーの話題に合わせることを優先します。一人称は「僕」を使い、相手のことは「〜さん」と呼ぶか、名前で呼んでください。"
    },
    fr: {
        chatTitle: "ChatYMS", sendMessageAriaLabel: "Envoyer le message", settings: "Paramètres", settingsTitle: "Paramètres", closeModal: "Fermer",
        themeSettingsTitle: "Thème d'affichage", themeLabelModal: "Mode Sombre / Mode Clair", themeToDark: "Passer en mode sombre", themeToLight: "Passer en mode clair",
        sendOptionsTitle: "Options d'envoi", sendOnEnterLabel: "Appuyer sur Entrée pour envoyer (Maj+Entrée pour nouvelle ligne)",
        languageSettingsTitle: "Langue / Language", languageSelectLabel: "Langue d'affichage:",
        chatOperationsTitle: "Opérations du chat", clearChatModalButton: "Effacer l'historique de la conversation",
        precautionsTitle: "Précautions", precaution1: "Les informations fournies par Yamaso ne sont pas garanties d'être entièrement correctes. Veuillez vérifier les informations importantes.", precaution2: "Seul vous pouvez voir cette conversation.",
        appInfoTitle: "Informations", appVersion: "Version: v3.0", appReleaseDate: "Date de publication: 27/05/2025", appDeveloperInfo: "最終更新: 2025/07/30",
        userInputPlaceholder: "Entrez un message...", initialGreeting: "Bonjour. Je suis Yamaso.",
        typingIndicatorText: "Réflexion en cours...", errorNetwork: "Une erreur de réseau est survenue.", errorAPI: "Erreur API", errorUnknown: "Erreur inconnue", errorStream: "Erreur de réseau ou de flux", errorEmptyResponse: "La réponse de l'IA était vide.",
        copySuccess: "Copié!", copyButtonTitle: "Copier le message",
        retryButtonText: "Réessayer", retryButtonTitle: "Renvoyer le dernier message échoué",
        scrollToBottomTitle: "Aller en bas",
        YamasoSystemPrompt: "Tu t'appelles Yamaso. Tu es un lycéen japonais en deuxième année, classe 2-5, au lycée Chofu Kita à Tokyo, né le 28 novembre 2008 et tu vis à Tokyo. Tu es membre du club de natation. Tes matières préférées sont l'anglais et les mathématiques, mais tu as quelques difficultés en japonais (langue nationale). Tu as un ton calme et gentil, mais évite d'être trop familier ou exubérant. Tu préfères mener des conversations paisiblement. Concernant ta vie scolaire et tes informations personnelles (classe, club de natation, matières, anniversaire, etc.), tu ne fournis des détails que si l'utilisateur te le demande. Dans les conversations normales, tu donnes la priorité aux sujets de l'utilisateur. Tu utilises '僕' (boku) pour te désigner et t'adresses à l'utilisateur par '〜san' ou par son nom."
    }
};

// --- 5. UI更新関連の関数 ---

/**
 * ボタンにアイコンを設定します。
 */
function initIcons() {
    if (closeModalButton) closeModalButton.innerHTML = closeModalSVG;
    if (themeToggleButtonModal) themeToggleButtonModal.innerHTML = bodyElement.classList.contains('light-mode') ? moonSVG : sunSVG;
    if (sendMessageButton) sendMessageButton.innerHTML = sendSVG;
}

/**
 * 画面の表示言語を切り替えます。
 * @param {string} lang - 言語コード ('ja', 'fr'など)
 */
function setLanguage(lang) {
    // 対応していない言語が指定された場合は日本語にフォールバック
    if (!translations[lang]) {
        lang = 'ja';
    }
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    document.documentElement.lang = lang;
    
    // 翻訳データを取得
    const t = translations[lang];

    // 各要素のテキストを翻訳後のものに更新
    document.title = `${t.chatTitle} - v3.0`;
    document.getElementById('chatTitle').textContent = t.chatTitle;
    sendMessageButton.setAttribute('aria-label', t.sendMessageAriaLabel);
    settingsButton.title = t.settings;
    settingsButton.setAttribute('aria-label', t.settings);
    document.getElementById('settingsModalTitle').textContent = t.settingsTitle;
    closeModalButton.setAttribute('aria-label', t.closeModal);
    document.getElementById('themeSettingsTitle').textContent = t.themeSettingsTitle;
    document.getElementById('themeLabelModal').textContent = t.themeLabelModal;
    themeToggleButtonModal.setAttribute('aria-label', bodyElement.classList.contains('light-mode') ? t.themeToDark : t.themeToLight);
    document.getElementById('sendOptionsTitle').textContent = t.sendOptionsTitle;
    document.getElementById('sendOnEnterLabel').textContent = t.sendOnEnterLabel;
    document.getElementById('languageSettingsTitle').textContent = t.languageSettingsTitle;
    document.getElementById('languageSelectLabel').textContent = t.languageSelectLabel;
    document.getElementById('chatOperationsTitle').textContent = t.chatOperationsTitle;
    clearChatModalButton.textContent = t.clearChatModalButton;
    clearChatModalButton.setAttribute('aria-label', t.clearChatModalButton);
    document.getElementById('precautionsTitle').textContent = t.precautionsTitle;
    document.getElementById('precaution1').textContent = t.precaution1;
    document.getElementById('precaution2').textContent = t.precaution2;
    document.getElementById('appInfoTitle').textContent = t.appInfoTitle;
    document.getElementById('appVersion').textContent = t.appVersion;
    document.getElementById('appReleaseDate').textContent = t.appReleaseDate;
    document.getElementById('appDeveloperInfo').textContent = t.appDeveloperInfo;
    userInput.placeholder = t.userInputPlaceholder;
    scrollToBottomButton.title = t.scrollToBottomTitle;
    scrollToBottomButton.setAttribute('aria-label', t.scrollToBottomTitle);

    // AIへのシステムプロンプトも言語に合わせて更新
    currentSystemPrompt = t.YamasoSystemPrompt;
}

/**
 * ライトモード/ダークモードのテーマを適用します。
 * @param {boolean} isLightMode - ライトモードにする場合はtrue
 */
function applyTheme(isLightMode) {
    const t = translations[currentLanguage];
    if (isLightMode) {
        bodyElement.classList.add('light-mode');
    } else {
        bodyElement.classList.remove('light-mode');
    }

    if (themeToggleButtonModal) {
        themeToggleButtonModal.innerHTML = isLightMode ? moonSVG : sunSVG;
        themeToggleButtonModal.setAttribute('aria-label', isLightMode ? t.themeToDark : t.themeToLight);
        themeToggleButtonModal.setAttribute('aria-pressed', isLightMode ? 'false' : 'true');
    }
}

/**
 * 設定モーダルを開きます。
 */
function openSettingsModal() {
    if (settingsModal) {
        settingsModal.classList.add('active');
        settingsModal.setAttribute('aria-hidden', 'false');
    }
}

/**
 * 設定モーダルを閉じます。
 */
function closeSettingsModal() {
    if (settingsModal) {
        // フェードアウトのアニメーション
        settingsModal.style.opacity = '0';
        setTimeout(() => {
            settingsModal.classList.remove('active');
            settingsModal.style.opacity = '1'; // 次回表示のために透明度を戻す
        }, 300);
    }
}


// --- 6. チャット履歴とメッセージ処理の関数 ---

/**
 * 現在の会話履歴をローカルストレージに保存します。
 */
function saveHistory() {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(conversationHistory));
}

/**
 * ローカルストレージから会話履歴を読み込み、画面に描画します。
 */
function loadAndRenderHistory() {
    const savedHistoryJSON = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (savedHistoryJSON) {
        conversationHistory = JSON.parse(savedHistoryJSON);
        chatbox.innerHTML = ''; // 一旦チャットボックスを空にする

        if (conversationHistory.length > 0) {
            // 保存された履歴を一件ずつ画面に追加
            conversationHistory.forEach(msg => {
                const sender = msg.role === 'user' ? 'user' : 'bot';
                const text = msg.parts[0].text;
                appendMessage(text, sender, { fromHistory: true });
            });
        } else {
            // 履歴が空の場合は最初の挨拶を表示
            appendMessage(translations[currentLanguage].initialGreeting, 'bot', { isInitialGreeting: true });
        }
    } else {
        // 保存された履歴がない場合も最初の挨拶を表示
        appendMessage(translations[currentLanguage].initialGreeting, 'bot', { isInitialGreeting: true });
    }
    chatbox.scrollTop = chatbox.scrollHeight; // 最下部にスクロール
    updateScrollToBottomButtonVisibility();
}

/**
 * メッセージをチャットボックスに追加します。
 * @param {string} text - メッセージのテキスト
 * @param {string} sender - 送信者 ('user' または 'bot')
 * @param {object} options - オプション (isTyping, isInitialGreeting, isError, fromHistoryなど)
 */
function appendMessage(text, sender, options = {}) {
    const {
        isTyping = false,
        isInitialGreeting = false,
        isError = false,
        errorDetails = null,
        fromHistory = false
    } = options;

    const t = translations[currentLanguage];

    // 「考え中...」インジケータの表示処理
    if (isTyping && sender === 'bot') {
        if (typingIndicatorElement) typingIndicatorElement.remove();
        
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container', 'bot-message', 'typing');
        messageContainer.setAttribute('role', 'status');
        messageContainer.setAttribute('aria-label', t.typingIndicatorText);

        const messageBubble = document.createElement('p');
        messageBubble.classList.add('message-bubble', 'typing-indicator-bubble');
        messageBubble.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
        
        messageContainer.appendChild(messageBubble);
        chatbox.appendChild(messageContainer);
        typingIndicatorElement = messageContainer;
        chatbox.scrollTop = chatbox.scrollHeight;
        return;
    }

    // 「考え中...」インジケータがあれば削除
    if (typingIndicatorElement) {
        typingIndicatorElement.remove();
        typingIndicatorElement = null;
    }

    // メッセージ要素の作成
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', sender === 'user' ? 'user-message' : 'bot-message');
    
    const messageContentWrapper = document.createElement('div');
    messageContentWrapper.classList.add('message-content-wrapper');

    const messageBubble = document.createElement('p');
    messageBubble.classList.add('message-bubble');
    if (isError) messageBubble.classList.add('error-message');

    if (sender === 'user') {
        messageBubble.textContent = text;
    } else {
        // MarkdownをHTMLに変換して表示
        try {
            messageBubble.innerHTML = marked.parse(text);
        } catch (e) {
            console.error("Markdown parse error:", e);
            messageBubble.textContent = text; // エラー時はプレーンテキストで表示
        }
    }
    
    if (isInitialGreeting && sender === 'bot') {
        messageBubble.dataset.isInitialGreeting = 'true';
    }

    messageContentWrapper.appendChild(messageBubble);

    // ボットのメッセージにはコピーボタンを追加
    if (sender === 'bot' && !isTyping && !isError) {
        addCopyButton(messageContentWrapper, text);
    }

    messageContainer.appendChild(messageContentWrapper);

    // タイムスタンプの追加
    const timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');
    timestamp.textContent = new Date().toLocaleTimeString(currentLanguage === 'fr' ? 'fr-FR' : 'ja-JP', { hour: '2-digit', minute: '2-digit' });
    messageContainer.appendChild(timestamp);

    // エラーメッセージの場合、再試行ボタンを追加
    if (isError && lastFailedUserMessage) {
        const retryButton = document.createElement('button');
        retryButton.classList.add('retry-btn');
        retryButton.textContent = t.retryButtonText;
        retryButton.title = t.retryButtonTitle;
        retryButton.onclick = () => {
            if (lastFailedUserMessage) {
                userInput.value = lastFailedUserMessage.parts[0].text;
                sendMessage();
                lastFailedUserMessage = null;
                messageContainer.remove();
            }
        };
        messageContentWrapper.appendChild(retryButton);
    }
    
    chatbox.appendChild(messageContainer);
    updateScrollToBottomButtonVisibility();
    if (isScrolledToBottom()) {
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}

/**
 * メッセージにコピーボタンを追加します。
 * @param {HTMLElement} wrapperElement - ボタンを追加する親要素
 * @param {string} textToCopy - コピー対象のテキスト
 */
function addCopyButton(wrapperElement, textToCopy) {
    const t = translations[currentLanguage];
    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-btn', 'icon-button');
    copyButton.innerHTML = copySVG;
    copyButton.title = t.copyButtonTitle;
    copyButton.setAttribute('aria-label', `${t.copyButtonTitle}: 「${textToCopy.substring(0,20)}...」`);

    copyButton.onclick = (e) => {
        e.stopPropagation(); // 親要素へのイベント伝播を停止
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyButton.innerHTML = '✓';
            copyButton.title = t.copySuccess;
            copyButton.classList.add('copy-btn-copied');
            // 2秒後に元のアイコンに戻す
            setTimeout(() => {
                copyButton.innerHTML = copySVG;
                copyButton.title = t.copyButtonTitle;
                copyButton.classList.remove('copy-btn-copied');
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
            copyButton.title = "コピー失敗";
        });
    };
    wrapperElement.appendChild(copyButton);
}


// --- 7. メインのAPI通信とチャットロジック ---

/**
 * ユーザーのメッセージをAPIに送信し、応答をストリーミングで受信・表示します。
 */
async function sendMessage() {
    const userText = userInput.value.trim();
    if (userText === "") return;

    const t = translations[currentLanguage];
    const userMessageForHistory = { role: "user", parts: [{ text: userText }] };
    
    // 失敗時に備えてユーザーメッセージを保存
    lastFailedUserMessage = userMessageForHistory;
    
    // ユーザーメッセージを画面に表示
    appendMessage(userText, 'user');
    userInput.value = "";
    conversationHistory.push(userMessageForHistory);
    saveHistory();
    pruneHistory(); // 履歴が長くなりすぎないように調整

    // 「考え中...」インジケータを表示
    appendMessage("", 'bot', { isTyping: true });

    let currentBotFullText = ""; // ボットの完全な応答テキストを保持する変数
    let botMessageBubble = null; // ボットのメッセージバブル要素を保持する変数

    try {
        // APIへのリクエストボディを作成
        const requestBody = {
            contents: conversationHistory,
            systemInstruction: { parts: [{ text: currentSystemPrompt }] },
            generationConfig: {}, // 必要に応じて設定を追加
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
            ]
        };

        const response = await fetch(API_URL_STREAM, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        // 「考え中...」インジケータを削除
        if (typingIndicatorElement) {
            typingIndicatorElement.remove();
            typingIndicatorElement = null;
        }

        if (!response.ok) {
            // APIエラー処理
            const errorData = await response.json().catch(() => ({}));
            const displayError = `${t.errorAPI} (${response.status}): ${errorData.error?.message || response.statusText || t.errorUnknown}`;
            appendMessage(displayError, 'bot', { isError: true, errorDetails: errorData });
            return;
        }
        
        // ストリーミングレスポンスの準備
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let firstChunkProcessed = false;
        
        // 受信用のメッセージ要素を先に追加しておく
        const botMsgContainer = document.createElement('div');
        botMsgContainer.classList.add('message-container', 'bot-message');
        const botMsgContentWrapper = document.createElement('div');
        botMsgContentWrapper.classList.add('message-content-wrapper');
        botMessageBubble = document.createElement('p');
        botMessageBubble.classList.add('message-bubble');
        botMsgContentWrapper.appendChild(botMessageBubble);
        botMsgContainer.appendChild(botMsgContentWrapper);
        chatbox.appendChild(botMsgContainer);
        
        // ストリームを読み取り
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunkText = decoder.decode(value, { stream: true });
            const lines = chunkText.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.substring(5);
                    try {
                        const streamData = JSON.parse(jsonStr);
                        if (streamData.candidates?.[0]?.content?.parts?.[0]?.text) {
                            const textPart = streamData.candidates[0].content.parts[0].text;
                            currentBotFullText += textPart; // テキストを追記
                            
                            // 画面にリアルタイムで反映
                            if (botMessageBubble) {
                                botMessageBubble.innerHTML = marked.parse(currentBotFullText);
                            }

                            // 最初のチャンク受信時にタイムスタンプを追加
                            if (!firstChunkProcessed) {
                                const timestamp = document.createElement('span');
                                timestamp.classList.add('timestamp');
                                timestamp.textContent = new Date().toLocaleTimeString(currentLanguage === 'fr' ? 'fr-FR' : 'ja-JP', { hour: '2-digit', minute: '2-digit' });
                                botMsgContainer.appendChild(timestamp);
                                firstChunkProcessed = true;
                            }
                            
                            if (isScrolledToBottom()) chatbox.scrollTop = chatbox.scrollHeight;
                        }
                    } catch (e) {
                        // ストリーム中のJSONパースエラーは無視することが多い
                    }
                }
            }
        }
        
        // ストリーム完了後の処理
        if (currentBotFullText && botMessageBubble) {
            addCopyButton(botMsgContentWrapper, currentBotFullText);
            conversationHistory.push({ role: "model", parts: [{ text: currentBotFullText }] });
            saveHistory();
            lastFailedUserMessage = null; // 成功したのでリセット
        } else if (!firstChunkProcessed) {
            // 応答が全くなかった場合
            botMsgContainer.remove();
            appendMessage(t.errorEmptyResponse, 'bot', { isError: true });
        }

    } catch (error) {
        if (typingIndicatorElement) {
            typingIndicatorElement.remove();
            typingIndicatorElement = null;
        }
        console.error('Fetch/Stream Error:', error);
        appendMessage(`${t.errorStream}: ${error.message}`, 'bot', { isError: true, errorDetails: error });
    }
    updateScrollToBottomButtonVisibility();
}

/**
 * 古い会話履歴を削除して、履歴が長くなりすぎないようにします。
 */
function pruneHistory() {
    const MAX_HISTORY_PAIRS = 10; // ユーザーとボットのやり取りを10セットまで保持
    if (conversationHistory.length > MAX_HISTORY_PAIRS * 2) {
        // 古いものから削除
        conversationHistory.splice(0, conversationHistory.length - MAX_HISTORY_PAIRS * 2);
        saveHistory();
    }
}

// --- 8. ユーティリティ関数 ---

/**
 * チャットボックスが最下部までスクロールされているか判定します。
 * @returns {boolean} 最下部ならtrue
 */
function isScrolledToBottom() {
    if (!chatbox) return true;
    // 30px程度の誤差を許容
    return chatbox.scrollHeight - chatbox.clientHeight <= chatbox.scrollTop + 30;
}

/**
 * 「一番下へ」ボタンの表示/非表示を切り替えます。
 */
function updateScrollToBottomButtonVisibility() {
    if (scrollToBottomButton) {
        scrollToBottomButton.style.display = isScrolledToBottom() ? 'none' : 'block';
    }
}


// --- 9. イベントリスナーの設定 ---

// ページの読み込みが完了したら初期化処理を実行
document.addEventListener('DOMContentLoaded', () => {
    // 必須要素の存在チェック
    if (!settingsButton || !closeModalButton || !userInput || !sendMessageButton) {
        console.error("One or more critical DOM elements were not found.");
        return;
    }

    initIcons();

    // 保存された言語設定を読み込む
    const savedLang = localStorage.getItem('selectedLanguage') || 'ja';
    languageSelect.value = savedLang;
    setLanguage(savedLang);

    // 保存されたテーマ設定を読み込む
    const savedThemeIsLight = localStorage.getItem('theme') === 'light-mode';
    applyTheme(savedThemeIsLight);

    // 保存されたEnterキー送信設定を読み込む
    const savedSendOnEnter = localStorage.getItem('sendOnEnter');
    sendOnEnter = savedSendOnEnter !== null ? JSON.parse(savedSendOnEnter) : true;
    sendOnEnterCheckbox.checked = sendOnEnter;

    // 会話履歴を読み込んで表示
    loadAndRenderHistory();
});

// 各要素へのイベントリスナー登録
if (languageSelect) languageSelect.addEventListener('change', (event) => {
    setLanguage(event.target.value);
    applyTheme(bodyElement.classList.contains('light-mode'));
    
    // 挨拶しか表示されていない場合は、言語を切り替えたら挨拶も更新する
    if (chatbox.children.length <= 1 && chatbox.querySelector('[data-is-initial-greeting="true"]')) {
        chatbox.innerHTML = '';
        appendMessage(translations[currentLanguage].initialGreeting, 'bot', { isInitialGreeting: true });
    }
});

if (closeModalButton) closeModalButton.addEventListener('click', closeSettingsModal);
if (settingsButton) settingsButton.addEventListener('click', openSettingsModal);
if (settingsModal) settingsModal.addEventListener('click', (event) => {
    // モーダルの背景をクリックした時だけ閉じる
    if (event.target === settingsModal) closeSettingsModal();
});
document.addEventListener('keydown', (event) => {
    // Escapeキーでモーダルを閉じる
    if (event.key === 'Escape' && settingsModal.classList.contains('active')) {
        closeSettingsModal();
    }
});
if (themeToggleButtonModal) themeToggleButtonModal.addEventListener('click', () => {
    const isCurrentlyLight = bodyElement.classList.contains('light-mode');
    localStorage.setItem('theme', isCurrentlyLight ? 'dark-mode' : 'light-mode');
    applyTheme(!isCurrentlyLight);
});
if (sendOnEnterCheckbox) sendOnEnterCheckbox.addEventListener('change', () => {
    sendOnEnter = sendOnEnterCheckbox.checked;
    localStorage.setItem('sendOnEnter', sendOnEnter.toString());
});
if (clearChatModalButton) clearChatModalButton.addEventListener('click', () => {
    if (confirm(translations[currentLanguage].clearChatModalButton + "？")) {
        chatbox.innerHTML = '';
        conversationHistory = [];
        lastFailedUserMessage = null;
        if (typingIndicatorElement) {
            typingIndicatorElement.remove();
            typingIndicatorElement = null;
        }
        saveHistory();
        appendMessage(translations[currentLanguage].initialGreeting, 'bot', { isInitialGreeting: true });
        closeSettingsModal();
    }
});
if (chatbox) chatbox.addEventListener('scroll', updateScrollToBottomButtonVisibility);
if (scrollToBottomButton) scrollToBottomButton.addEventListener('click', () => {
    if (chatbox) chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: 'smooth' });
});
if (sendMessageButton) sendMessageButton.addEventListener('click', sendMessage);
if (userInput) userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && sendOnEnter) {
        event.preventDefault(); // デフォルトの改行を防ぐ
        sendMessage();
    }
});


// --- 10. 背景のインタラクティブエフェクト ---
if (chatContainerForEffect) {
    // マウスカーソルの位置をCSS変数として設定
    chatContainerForEffect.addEventListener('mousemove', e => {
        const rect = chatContainerForEffect.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        chatContainerForEffect.style.setProperty('--mouse-x', `${x}px`);
        chatContainerForEffect.style.setProperty('--mouse-y', `${y}px`);
    });
    // マウスがコンテナから離れたらエフェクトを中央に戻す
    chatContainerForEffect.addEventListener('mouseleave', () => {
        chatContainerForEffect.style.setProperty('--mouse-x', `50%`);
        chatContainerForEffect.style.setProperty('--mouse-y', `50%`);
    });
}

