// --- DOM Elements ---
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

// --- SVG Icons ---
const settingsSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61-.25-1.17.59-1.69-.98l-2.49-1c-.23-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19-.15-.24.42-.12-.64l2 3.46c.12.22.39.3.61-.22l2.49-1c.52.4 1.08.73 1.69-.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>`;
const closeModalSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
const sunSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.64 5.64L4.22 4.22c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.41 1.41c.39.39 1.02.39 1.41 0 .39-.38.39-1.02 0-1.41zM18.36 18.36l1.41 1.41c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.41-1.41c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41zM19.78 4.22l-1.41 1.41c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.41-1.41c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0zM4.22 19.78l1.41-1.41c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-1.41 1.41c-.39-.39-1.02-.39-1.41 0-.39-.39-.39-1.02 0-1.41z"/></svg>`;
const moonSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 2c-1.82 0-3.53.5-5 1.35C7.99 5.08 10 8.3 10 12s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/></svg>`;
const copySVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
const sendSVG = `<svg viewBox="0 0 24 24" fill="currentColor" transform="rotate(90)"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>`;

// --- API Config & State Variables ---
const API_KEY = 'AIzaSyB2R4PVr5xgHlivkgz7kSBqNRJy6Ev434Y';
const API_URL_STREAM = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:streamGenerateContent?key=${API_KEY}&alt=sse`;
const HISTORY_STORAGE_KEY = 'chatyms_history';
let conversationHistory = [];
let typingIndicatorElement = null;

// (translations object remains the same as before)
const translations = {
    ja: {
        chatTitle: "ChatYMS", sendMessageAriaLabel: "メッセージを送信", settings: "設定", settingsTitle: "設定", closeModal: "閉じる",
        themeSettingsTitle: "表示テーマ", themeLabelModal: "ダークモード / ライトモード", themeToDark: "ダークモードに切り替え", themeToLight: "ライトモードに切り替え",
        sendOptionsTitle: "送信オプション", sendOnEnterLabel: "Enterキーで送信 (Shift+Enterで改行)",
        languageSettingsTitle: "言語 / Language", languageSelectLabel: "表示言語:",
        chatOperationsTitle: "チャット操作", clearChatModalButton: "会話履歴をクリア",
        precautionsTitle: "注意事項", precaution1: "やまそーの発信する情報はすべて正しいとは限りません。重要な情報は確認するようにしてください。", precaution2: "このチャットはあなたのみが見ることができます。",
        appInfoTitle: "情報", appVersion: "バージョン: v1.7", appReleaseDate: "公開日: 2025/05/27",
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
        appInfoTitle: "Informations", appVersion: "Version: v1.7", appReleaseDate: "Date de publication: 27/05/2025",
        userInputPlaceholder: "Entrez un message...", initialGreeting: "Bonjour. Je suis Yamaso.",
        typingIndicatorText: "Réflexion en cours...", errorNetwork: "Une erreur de réseau est survenue.", errorAPI: "Erreur API", errorUnknown: "Erreur inconnue", errorStream: "Erreur de réseau ou de flux", errorEmptyResponse: "La réponse de l'IA était vide.",
        copySuccess: "Copié!", copyButtonTitle: "Copier le message",
        retryButtonText: "Réessayer", retryButtonTitle: "Renvoyer le dernier message échoué",
        scrollToBottomTitle: "Aller en bas",
        YamasoSystemPrompt: "Tu t'appelles Yamaso. Tu es un lycéen japonais en deuxième année, classe 2-5, au lycée Chofu Kita à Tokyo, né le 28 novembre 2008 et tu vis à Tokyo. Tu es membre du club de natation. Tes matières préférées sont l'anglais et les mathématiques, mais tu as quelques difficultés en japonais (langue nationale). Tu as un ton calme et gentil, mais évite d'être trop familier ou exubérant. Tu préfères mener des conversations paisiblement. Concernant ta vie scolaire et tes informations personnelles (classe, club de natation, matières, anniversaire, etc.), tu ne fournis des détails que si l'utilisateur te le demande. Dans les conversations normales, tu donnes la priorité aux sujets de l'utilisateur. Tu utilises '僕' (boku) pour te désigner et t'adresses à l'utilisateur par '〜san' ou par son nom."
    }
};

let currentLanguage = 'ja';
let currentSystemPrompt = translations.ja.YamasoSystemPrompt;
let lastFailedUserMessage = null;
let sendOnEnter = true;

// (The functions initIcons, setLanguage, applyTheme, saveHistory, loadAndRenderHistory, appendMessage, addCopyButton, sendMessage, pruneHistory, isScrolledToBottom, updateScrollToBottomButtonVisibility remain the same as the previous stable version)
function initIcons() { if(settingsButton) settingsButton.innerHTML = settingsSVG; if(closeModalButton) closeModalButton.innerHTML = closeModalSVG; if(themeToggleButtonModal) themeToggleButtonModal.innerHTML = bodyElement.classList.contains('light-mode') ? moonSVG : sunSVG; if(sendMessageButton) sendMessageButton.innerHTML = sendSVG; }
function setLanguage(lang) { if (!translations[lang]) { lang = 'ja'; } currentLanguage = lang; localStorage.setItem('selectedLanguage', lang); document.documentElement.lang = lang; const t = translations[lang]; document.title = t.chatTitle + " - v1.7"; const chatTitleEl = document.getElementById('chatTitle'); if(chatTitleEl) chatTitleEl.textContent = t.chatTitle; if(sendMessageButton) sendMessageButton.setAttribute('aria-label', t.sendMessageAriaLabel); if(settingsButton) { settingsButton.title = t.settings; settingsButton.setAttribute('aria-label', t.settings); } const settingsModalTitleEl = document.getElementById('settingsModalTitle'); if(settingsModalTitleEl) settingsModalTitleEl.textContent = t.settingsTitle; if(closeModalButton) closeModalButton.setAttribute('aria-label', t.closeModal); const themeSettingsTitleEl = document.getElementById('themeSettingsTitle'); if(themeSettingsTitleEl) themeSettingsTitleEl.textContent = t.themeSettingsTitle; const themeLabelModalEl = document.getElementById('themeLabelModal'); if(themeLabelModalEl) themeLabelModalEl.textContent = t.themeLabelModal; if(themeToggleButtonModal) themeToggleButtonModal.setAttribute('aria-label', bodyElement.classList.contains('light-mode') ? t.themeToDark : t.themeToLight); const sendOptionsTitleEl = document.getElementById('sendOptionsTitle'); if(sendOptionsTitleEl) sendOptionsTitleEl.textContent = t.sendOptionsTitle; const sendOnEnterLabelEl = document.getElementById('sendOnEnterLabel'); if(sendOnEnterLabelEl) sendOnEnterLabelEl.textContent = t.sendOnEnterLabel; const languageSettingsTitleEl = document.getElementById('languageSettingsTitle'); if(languageSettingsTitleEl) languageSettingsTitleEl.textContent = t.languageSettingsTitle; const languageSelectLabelEl = document.getElementById('languageSelectLabel'); if(languageSelectLabelEl) languageSelectLabelEl.textContent = t.languageSelectLabel; const chatOperationsTitleEl = document.getElementById('chatOperationsTitle'); if(chatOperationsTitleEl) chatOperationsTitleEl.textContent = t.chatOperationsTitle; if(clearChatModalButton) { clearChatModalButton.textContent = t.clearChatModalButton; clearChatModalButton.setAttribute('aria-label', t.clearChatModalButton); } const precautionsTitleEl = document.getElementById('precautionsTitle'); if(precautionsTitleEl) precautionsTitleEl.textContent = t.precautionsTitle; const precaution1El = document.getElementById('precaution1'); if(precaution1El) precaution1El.textContent = t.precaution1; const precaution2El = document.getElementById('precaution2'); if(precaution2El) precaution2El.textContent = t.precaution2; const appInfoTitleEl = document.getElementById('appInfoTitle'); if(appInfoTitleEl) appInfoTitleEl.textContent = t.appInfoTitle; const appVersionEl = document.getElementById('appVersion'); if(appVersionEl) appVersionEl.textContent = t.appVersion; const appReleaseDateEl = document.getElementById('appReleaseDate'); if(appReleaseDateEl) appReleaseDateEl.textContent = t.appReleaseDate; if(userInput) userInput.placeholder = t.userInputPlaceholder; if(scrollToBottomButton) { scrollToBottomButton.title = t.scrollToBottomTitle; scrollToBottomButton.setAttribute('aria-label', t.scrollToBottomTitle); } currentSystemPrompt = t.YamasoSystemPrompt; }
function applyTheme(isLightMode) { const t = translations[currentLanguage]; if (isLightMode) { bodyElement.classList.add('light-mode'); } else { bodyElement.classList.remove('light-mode'); } if(themeToggleButtonModal) { themeToggleButtonModal.innerHTML = isLightMode ? moonSVG : sunSVG; themeToggleButtonModal.setAttribute('aria-label', isLightMode ? t.themeToDark : t.themeToLight); themeToggleButtonModal.setAttribute('aria-pressed', isLightMode ? 'false' : 'true'); } }
function saveHistory() { localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(conversationHistory)); }
function loadAndRenderHistory() { const savedHistoryJSON = localStorage.getItem(HISTORY_STORAGE_KEY); if (savedHistoryJSON) { conversationHistory = JSON.parse(savedHistoryJSON); chatbox.innerHTML = ''; if (conversationHistory.length > 0) { conversationHistory.forEach(msg => { const sender = msg.role === 'user' ? 'user' : 'bot'; const text = msg.parts[0].text; appendMessage(text, sender, false, false, false, null, true); }); } else { appendMessage(translations[currentLanguage].initialGreeting, 'bot', false, true); } } else { appendMessage(translations[currentLanguage].initialGreeting, 'bot', false, true); } chatbox.scrollTop = chatbox.scrollHeight; updateScrollToBottomButtonVisibility(); }
let currentBotMessageBubble = null; let currentBotFullText = ""; function appendMessage(text, sender, isTyping = false, isInitialGreeting = false, isError = false, errorDetails = null, fromHistory = false) { const t = translations[currentLanguage]; if (isTyping && sender === 'bot') { if (typingIndicatorElement) typingIndicatorElement.remove(); const messageContainer = document.createElement('div'); messageContainer.classList.add('message-container', 'bot-message', 'typing'); messageContainer.setAttribute('role','status'); messageContainer.setAttribute('aria-label', t.typingIndicatorText); const messageBubble = document.createElement('p'); messageBubble.classList.add('message-bubble', 'typing-indicator-bubble'); messageBubble.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`; messageContainer.appendChild(messageBubble); chatbox.appendChild(messageContainer); typingIndicatorElement = messageContainer; chatbox.scrollTop = chatbox.scrollHeight; return; } if (typingIndicatorElement && !isInitialGreeting) { typingIndicatorElement.remove(); typingIndicatorElement = null; } const messageContainer = document.createElement('div'); messageContainer.classList.add('message-container', sender === 'user' ? 'user-message' : 'bot-message'); messageContainer.setAttribute('role', 'article'); messageContainer.tabIndex = -1; const messageContentWrapper = document.createElement('div'); messageContentWrapper.classList.add('message-content-wrapper'); const messageBubble = document.createElement('p'); messageBubble.classList.add('message-bubble'); if (isError) messageBubble.classList.add('error-message'); if (sender === 'user') { messageBubble.textContent = text; } else { if(!isError && !isInitialGreeting && !fromHistory) { currentBotMessageBubble = messageBubble; currentBotFullText = ""; } else { try { messageBubble.innerHTML = marked.parse(text); } catch (e) { console.error("Markdown parse error:", e); messageBubble.textContent = text; } } } if(isInitialGreeting && sender==='bot') messageBubble.dataset.isInitialGreeting = 'true'; messageContentWrapper.appendChild(messageBubble); if (sender === 'bot' && !isTyping && !isError && (isInitialGreeting || fromHistory)) { addCopyButton(messageContentWrapper, text, messageBubble); } messageContainer.appendChild(messageContentWrapper); const timestamp = document.createElement('span'); timestamp.classList.add('timestamp'); timestamp.textContent = new Date().toLocaleTimeString(currentLanguage === 'fr' ? 'fr-FR' : 'ja-JP', { hour: '2-digit', minute: '2-digit' }); messageContainer.appendChild(timestamp); if (isError && lastFailedUserMessage) { const retryButton = document.createElement('button'); retryButton.classList.add('retry-btn'); retryButton.textContent = t.retryButtonText; retryButton.setAttribute('aria-label', t.retryButtonTitle); retryButton.onclick = () => { if (lastFailedUserMessage && userInput) { userInput.value = lastFailedUserMessage.parts[0].text; sendMessage(); lastFailedUserMessage = null; messageContainer.remove(); }}; messageContentWrapper.appendChild(retryButton); } if(chatbox) { chatbox.appendChild(messageContainer); updateScrollToBottomButtonVisibility(); if (isScrolledToBottom()) chatbox.scrollTop = chatbox.scrollHeight; } }
function addCopyButton(wrapperElement, textToCopy, messageBubbleElement) { const t = translations[currentLanguage]; const copyButton = document.createElement('button'); copyButton.classList.add('copy-btn'); copyButton.innerHTML = copySVG; const shortText = textToCopy.length > 20 ? textToCopy.substring(0,20) + "..." : textToCopy; copyButton.setAttribute('aria-label', `${t.copyButtonTitle}: 「${shortText}」`); copyButton.title = t.copyButtonTitle; let originalContent = copyButton.innerHTML; copyButton.onclick = (e) => { e.stopPropagation(); navigator.clipboard.writeText(textToCopy).then(() => { copyButton.innerHTML = '✓'; copyButton.title = t.copySuccess; copyButton.classList.add('copy-btn-copied'); setTimeout(() => { copyButton.innerHTML = originalContent; copyButton.title = t.copyButtonTitle; copyButton.classList.remove('copy-btn-copied'); }, 2000); }).catch(err => { console.error('Copy failed:', err); copyButton.title = "コピー失敗";}); }; wrapperElement.appendChild(copyButton); }
async function sendMessage() { const t = translations[currentLanguage]; if (!userInput) return; const userText = userInput.value.trim(); if (userText === "") return; const userMessageForHistory = { role: "user", parts: [{ text: userText }] }; lastFailedUserMessage = userMessageForHistory; appendMessage(userText, 'user'); userInput.value = ""; conversationHistory.push(userMessageForHistory); saveHistory(); appendMessage("", 'bot', true); currentBotMessageBubble = null; currentBotFullText = ""; try { const requestBody = { contents: conversationHistory, systemInstruction: currentSystemPrompt ? { parts: [{ text: currentSystemPrompt }] } : undefined, generationConfig: {}, safetySettings: [ { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" } ] }; const response = await fetch(API_URL_STREAM, { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(requestBody) }); if (typingIndicatorElement) { typingIndicatorElement.remove(); typingIndicatorElement = null; } if (!response.ok) { const errorData = await response.json().catch(() => ({ error: { message: `${t.errorAPI} (HTTP: ${response.status} ${response.statusText})` }})); const displayError = `${t.errorAPI} (${response.status}): ${errorData.error?.message || response.statusText || t.errorUnknown}`; appendMessage(displayError, 'bot', false, false, true, errorData); return; } const botMsgContainer = document.createElement('div'); botMsgContainer.classList.add('message-container', 'bot-message'); botMsgContainer.setAttribute('role', 'article'); botMsgContainer.tabIndex = -1; const botMsgContentWrapper = document.createElement('div'); botMsgContentWrapper.classList.add('message-content-wrapper'); currentBotMessageBubble = document.createElement('p'); currentBotMessageBubble.classList.add('message-bubble'); botMsgContentWrapper.appendChild(currentBotMessageBubble); botMsgContainer.appendChild(botMsgContentWrapper); if(chatbox) chatbox.appendChild(botMsgContainer); const reader = response.body.getReader(); const decoder = new TextDecoder(); let firstChunkProcessed = false; while (true) { const { value, done } = await reader.read(); if (done) break; const chunkText = decoder.decode(value, { stream: true }); const lines = chunkText.split('\n'); for (const line of lines) { if (line.startsWith('data: ')) { const jsonStr = line.substring(5); try { const streamData = JSON.parse(jsonStr); if (streamData.candidates && streamData.candidates[0].content?.parts?.[0]?.text) { const textPart = streamData.candidates[0].content.parts[0].text; currentBotFullText += textPart; if (currentBotMessageBubble) currentBotMessageBubble.innerHTML = marked.parse(currentBotFullText); if(!firstChunkProcessed && currentBotMessageBubble) { const timestamp = document.createElement('span'); timestamp.classList.add('timestamp'); timestamp.textContent = new Date().toLocaleTimeString(currentLanguage === 'fr' ? 'fr-FR' : 'ja-JP', { hour: '2-digit', minute: '2-digit' }); botMsgContainer.appendChild(timestamp); firstChunkProcessed = true; } if (chatbox && isScrolledToBottom()) chatbox.scrollTop = chatbox.scrollHeight; } } catch (e) { /* Ignore JSON parse errors in stream */ } } } } if (currentBotFullText && currentBotMessageBubble) { addCopyButton(botMsgContentWrapper, currentBotFullText, currentBotMessageBubble); conversationHistory.push({ role: "model", parts: [{ text: currentBotFullText }] }); saveHistory(); lastFailedUserMessage = null; } else if (!firstChunkProcessed && chatbox && chatbox.contains(botMsgContainer)) { botMsgContainer.remove(); appendMessage(t.errorEmptyResponse, 'bot', false, false, true); } } catch (error) { if (typingIndicatorElement) { typingIndicatorElement.remove(); typingIndicatorElement = null; } console.error('Fetch/Stream Error:', error); appendMessage(`${t.errorStream}: ${error.message}`, 'bot', false, false, true, error); } pruneHistory(); updateScrollToBottomButtonVisibility(); }
function pruneHistory() { const MAX_HISTORY_PAIRS = 10; if (conversationHistory.length > MAX_HISTORY_PAIRS * 2) { conversationHistory.splice(0, conversationHistory.length - MAX_HISTORY_PAIRS * 2); saveHistory(); } }
function isScrolledToBottom() { if(!chatbox) return true; return chatbox.scrollHeight - chatbox.clientHeight <= chatbox.scrollTop + 30; }
function updateScrollToBottomButtonVisibility() { if(scrollToBottomButton) scrollToBottomButton.style.display = isScrolledToBottom() ? 'none' : 'block'; }

// --- Modal Logic ---
function openSettingsModal() {
    if(settingsModal) {
        settingsModal.classList.add('active');
        settingsModal.setAttribute('aria-hidden', 'false');
    }
}

function closeSettingsModal() {
    if(settingsModal) {
        settingsModal.style.opacity = '0';
        setTimeout(() => {
            settingsModal.classList.remove('active');
            settingsModal.style.opacity = '1';
        }, 300);
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    if (!settingsButton || !closeModalButton || !themeToggleButtonModal || !sendOnEnterCheckbox || !clearChatModalButton || !languageSelect || !userInput || !sendMessageButton || !chatbox || !scrollToBottomButton) {
        console.error("One or more critical DOM elements were not found on page load.");
        return;
    }
    initIcons();
    const savedLang = localStorage.getItem('selectedLanguage') || 'ja';
    languageSelect.value = savedLang;
    setLanguage(savedLang);
    const savedThemeIsLight = localStorage.getItem('theme') === 'dark-mode';
    applyTheme(savedThemeIsLight);
    const savedSendOnEnter = localStorage.getItem('sendOnEnter');
    sendOnEnter = savedSendOnEnter !== null ? JSON.parse(savedSendOnEnter) : true;
    sendOnEnterCheckbox.checked = sendOnEnter;
    loadAndRenderHistory();
});

if(languageSelect) languageSelect.addEventListener('change', (event) => {
    setLanguage(event.target.value);
    applyTheme(bodyElement.classList.contains('light-mode'));
    if(chatbox.children.length === 0 || (chatbox.children.length === 1 && chatbox.querySelector('.bot-message .message-bubble')?.dataset.isInitialGreeting === 'true')) {
        chatbox.innerHTML = '';
        appendMessage(translations[currentLanguage].initialGreeting, 'bot', false, true);
    }
});

// BUG FIX: Added event.stopPropagation() to the close button listener
if(closeModalButton) closeModalButton.addEventListener('click', (event) => {
    event.stopPropagation();
    closeSettingsModal();
});

if(settingsButton) settingsButton.addEventListener('click', openSettingsModal);
if(settingsModal) settingsModal.addEventListener('click', (event) => { if (event.target === settingsModal) closeSettingsModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && settingsModal && settingsModal.classList.contains('active')) closeSettingsModal(); });
if(themeToggleButtonModal) themeToggleButtonModal.addEventListener('click', () => { const isCurrentlyLight = bodyElement.classList.contains('light-mode'); localStorage.setItem('theme', isCurrentlyLight ? 'dark-mode' : 'light-mode'); applyTheme(!isCurrentlyLight); });
if(sendOnEnterCheckbox) sendOnEnterCheckbox.addEventListener('change', () => { sendOnEnter = sendOnEnterCheckbox.checked; localStorage.setItem('sendOnEnter', sendOnEnter.toString()); });
if(clearChatModalButton) clearChatModalButton.addEventListener('click', () => { chatbox.innerHTML = ''; conversationHistory = []; lastFailedUserMessage = null; if (typingIndicatorElement) { typingIndicatorElement.remove(); typingIndicatorElement = null; } saveHistory(); appendMessage(translations[currentLanguage].initialGreeting, 'bot', false, true); closeSettingsModal(); });
if(chatbox) chatbox.addEventListener('scroll', updateScrollToBottomButtonVisibility);
if(scrollToBottomButton) scrollToBottomButton.addEventListener('click', () => { if(chatbox) chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: 'smooth' }); });
if(sendMessageButton) sendMessageButton.addEventListener('click', sendMessage);
if(userInput) userInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') { if (sendOnEnter && !event.shiftKey) { event.preventDefault(); sendMessage(); } } });

// --- Liquid Glass Interactive Light Effect ---
const chatContainerForEffect = document.getElementById('chatContainer');
if (chatContainerForEffect) {
    chatContainerForEffect.addEventListener('mousemove', e => {
        const rect = chatContainerForEffect.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        chatContainerForEffect.style.setProperty('--mouse-x', `${x}px`);
        chatContainerForEffect.style.setProperty('--mouse-y', `${y}px`);
    });
    chatContainerForEffect.addEventListener('mouseleave', () => {
        chatContainerForEffect.style.setProperty('--mouse-x', `50%`);
        chatContainerForEffect.style.setProperty('--mouse-y', `50%`);
    });
}
