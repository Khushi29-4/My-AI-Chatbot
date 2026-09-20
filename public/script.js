

const instructionsInput =
    document.getElementById("instructions");

const mobileMenuButton =
    document.getElementById("mobile-menu-btn");

const closeSidebarButton =
    document.getElementById("close-sidebar-btn");

const sidebar =
    document.querySelector(".sidebar");

const app =
    document.querySelector(".app");

const chatBox =
    document.getElementById("chat-box");

const chatForm =
    document.getElementById("chat-form");

const userInput =
    document.getElementById("user-input");

const messageCount =
    document.getElementById("message-count");

const chatCategory =
    document.getElementById("chat-category");

const aiModeSelect =
    document.getElementById("ai-mode-select");

const themeBtn =
    document.getElementById("theme-btn");
const themeMenu =
    document.getElementById("theme-menu");
const summaryBtn =
    document.getElementById("summary-btn");


// ============================================================
// SIDEBAR
// ============================================================

const savedSidebarState =
    localStorage.getItem("sidebarState");

if (
    savedSidebarState === "closed" &&
    sidebar &&
    app
) {
    sidebar.classList.add("desktop-closed");
    app.classList.add("sidebar-closed");
}


if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.remove(
                "desktop-closed"
            );

            sidebar.classList.add(
                "mobile-open"
            );

            app.classList.remove(
                "sidebar-closed"
            );

            localStorage.setItem(
                "sidebarState",
                "open"
            );
        }
    );
}


if (closeSidebarButton) {

    closeSidebarButton.addEventListener(
        "click",
        () => {

            sidebar.classList.add(
                "desktop-closed"
            );

            sidebar.classList.remove(
                "mobile-open"
            );

            app.classList.add(
                "sidebar-closed"
            );

            localStorage.setItem(
                "sidebarState",
                "closed"
            );
        }
    );
}


// Close mobile sidebar when clicking outside

document.addEventListener(
    "click",
    event => {

        if (window.innerWidth > 700) {
            return;
        }

        if (
            !sidebar ||
            !sidebar.classList.contains(
                "mobile-open"
            )
        ) {
            return;
        }

        if (
            !sidebar.contains(event.target) &&
            event.target !== mobileMenuButton
        ) {

            sidebar.classList.remove(
                "mobile-open"
            );
        }
    }
);


// ============================================================
// THEME
// ============================================================

const savedTheme =
    localStorage.getItem("theme") || "dark";


function applyTheme(theme) {

    document.body.classList.remove(
        "light-theme",
        "dark-theme",
        "study-theme",
        "code-theme",
        "interview-theme",
        "creative-theme"
    );
    if (theme === "light") {

        document.body.classList.add(
            "light-theme"
        );

    } else if (theme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    } else if (theme === "study") {

        document.body.classList.add(
            "study-theme"
        );

    } else if (theme === "code") {

        document.body.classList.add(
            "code-theme"
        );

    } else if (theme === "interview") {

        document.body.classList.add(
            "interview-theme"
        );

    } else if (theme === "creative") {

        document.body.classList.add(
            "creative-theme"
        );

    } else {

        theme = "dark";

        document.body.classList.add(
            "dark-theme"
        );
    }


    localStorage.setItem(
        "theme",
        theme
    );


    if (themeBtn) {

        const themeIcons = {

            light: "☀️",
            dark: "🌙",
            study: "📚",
            code: "💻",
            interview: "🎤",
            creative: "🎨"
        };

        themeBtn.textContent =
            themeIcons[theme] || "🌙";
    }
}
    



applyTheme(savedTheme);

if (themeBtn && themeMenu) {

    themeBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            themeMenu.classList.toggle(
                "active"
            );
        }
    );


    themeMenu
        .querySelectorAll("[data-theme]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const selectedTheme =
                        button.dataset.theme;

                    applyTheme(
                        selectedTheme
                    );

                    themeMenu.classList.remove(
                        "active"
                    );
                }
            );
        });


    document.addEventListener(
        "click",
        event => {

            if (
                !themeMenu.contains(event.target) &&
                event.target !== themeBtn
            ) {

                themeMenu.classList.remove(
                    "active"
                );
            }
        }
    );
}
// ============================================================
// AI MODE
// ============================================================

const savedAiMode =
    localStorage.getItem("aiMode");

if (
    savedAiMode &&
    aiModeSelect
) {

    aiModeSelect.value =
        savedAiMode;
}


// ============================================================
// CHAT STORAGE
// ============================================================

let chats =
    JSON.parse(
        localStorage.getItem("chats") || "[]"
    );

let selectedCategory =
    "all";

let currentChatId =
    localStorage.getItem("currentChatId");


// ============================================================
// CREATE INITIAL CHAT
// ============================================================

if (!currentChatId) {

    currentChatId =
        Date.now().toString();

    chats.push({

        id:
            currentChatId,

        title:
            "New Chat",

        customTitle:
            false,

        category:
            "general",

        messages:
            []
    });

    saveChats();

    localStorage.setItem(
        "currentChatId",
        currentChatId
    );
}


// ============================================================
// FIND CURRENT CHAT
// ============================================================

let currentChat =
    chats.find(
        chat =>
            String(chat.id) ===
            String(currentChatId)
    );


// ============================================================
// RECOVER CURRENT CHAT IF MISSING
// ============================================================

if (!currentChat) {

    currentChatId =
        Date.now().toString();

    currentChat = {

        id:
            currentChatId,

        title:
            "New Chat",

        customTitle:
            false,

        category:
            "general",

        messages:
            []
    };

    chats.push(
        currentChat
    );

    saveChats();

    localStorage.setItem(
        "currentChatId",
        currentChatId
    );
}


// Make sure older chats have required properties

chats.forEach(
    chat => {

        if (!chat.category) {
            chat.category = "general";
        }

        if (!Array.isArray(chat.messages)) {
            chat.messages = [];
        }

        if (
            typeof chat.customTitle ===
            "undefined"
        ) {
            chat.customTitle = false;
        }
    }
);


let conversation =
    currentChat.messages;


// ============================================================
// SAVE CHATS
// ============================================================

function saveChats() {

    localStorage.setItem(
        "chats",
        JSON.stringify(chats)
    );
}


// ============================================================
// GLOBAL STATE
// ============================================================

let selectedFile =
    null;

let showFavoritesOnly =
    false;

let isRegenerating =
    false;

let lastDisplayedDate =
    null;

let currentReader =
    null;

let currentSpeechButton =
    null;

let editingMessageIndex =
    null;


// ============================================================
// MESSAGE COUNTER
// ============================================================

if (userInput && messageCount) {

    userInput.addEventListener(
        "input",
        () => {

            const count =
                userInput.value.length;

            const words =
                userInput.value
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .length;

            messageCount.textContent =
                `${count} character${count === 1 ? "" : "s"} · ${words} word${words === 1 ? "" : "s"}`;
        }
    );
}


// ============================================================
// AUTO RESIZE TEXTAREA
// ============================================================

if (userInput) {

    userInput.addEventListener(
        "input",
        () => {

            userInput.style.height =
                "auto";

            userInput.style.height =
                Math.min(
                    userInput.scrollHeight,
                    150
                ) + "px";
        }
    );
}


// ============================================================
// ENTER TO SEND
// ============================================================

if (userInput && chatForm) {

    userInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                chatForm.requestSubmit();
            }
        }
    );
}


// ============================================================
// FILE / SEARCH ELEMENTS
// ============================================================

const exportButton =
    document.getElementById("export-btn");

const chatSearch =
    document.getElementById("chat-search");

const messageSearchInput =
    document.getElementById(
        "message-search-input"
    );

const messageSearchButton =
    document.getElementById(
        "message-search-btn"
    );

const imageInput =
    document.getElementById("image-input");

const documentInput =
    document.getElementById("document-input");

const attachButton =
    document.getElementById("attach-btn");

const attachMenu =
    document.getElementById("attach-menu");

const imageOption =
    document.getElementById("image-option");

const documentOption =
    document.getElementById("document-option");

const filePreviewContainer =
    document.getElementById(
        "file-preview-container"
    );


// ============================================================
// ATTACHMENT MENU
// ============================================================

if (attachButton && attachMenu) {

    attachButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            attachMenu.classList.toggle(
                "show"
            );
        }
    );
}


if (imageOption && imageInput) {

    imageOption.addEventListener(
        "click",
        () => {

            if (attachMenu) {
                attachMenu.classList.remove(
                    "show"
                );
            }

            imageInput.click();
        }
    );
}


if (documentOption && documentInput) {

    documentOption.addEventListener(
        "click",
        () => {

            if (attachMenu) {
                attachMenu.classList.remove(
                    "show"
                );
            }

            documentInput.click();
        }
    );
}


document.addEventListener(
    "click",
    () => {

        if (attachMenu) {
            attachMenu.classList.remove(
                "show"
            );
        }
    }
);


// ============================================================
// FOLLOW-UP SUGGESTIONS
// ============================================================

function showFollowUpSuggestions(
    suggestions
) {

    const container =
        document.getElementById(
            "follow-up-suggestions"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        "";

    suggestions.forEach(
        suggestion => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "follow-up-btn";

            button.textContent =
                suggestion;

            button.addEventListener(
                "click",
                () => {

                    userInput.value =
                        suggestion;

                    userInput.dispatchEvent(
                        new Event("input")
                    );

                    if (chatForm) {
                        chatForm.requestSubmit();
                    }

                    container.innerHTML =
                        "";
                }
            );

            container.appendChild(
                button
            );
        }
    );
}


// ============================================================
// GENERATE FOLLOW-UP SUGGESTIONS
// ============================================================

function generateFollowUpSuggestions(
    response
) {

    if (
        !response ||
        response.trim().length < 40
    ) {
        return [];
    }

    const text =
        response.toLowerCase();


    if (
        text.includes("code") ||
        text.includes("javascript") ||
        text.includes("python") ||
        text.includes("program")
    ) {

        return [

            "Can you explain this code step-by-step?",

            "Can you show me an example?",

            "Can you give me a simpler version?"
        ];
    }


    if (
        text.includes("definition") ||
        text.includes("means") ||
        text.includes("concept")
    ) {

        return [

            "Can you explain this more simply?",

            "Can you give me a real-world example?",

            "What are the key points?"
        ];
    }


    if (
        text.includes("interview") ||
        text.includes("question")
    ) {

        return [

            "Can you give me another question?",

            "Can you explain the answer?",

            "Can you give me an interview example?"
        ];
    }


    return [];
}


// ============================================================
// FILE TO BASE64
// ============================================================

function fileToBase64(file) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();

            reader.onload =
                () => {

                    resolve(
                        reader.result
                    );
                };

            reader.onerror =
                reject;

            reader.readAsDataURL(
                file
            );
        }
    );
}


// ============================================================
// FILE SELECTION
// ============================================================

function handleFileSelection(
    input
) {

    const file =
        input.files[0];

    if (!file) {
        return;
    }

    selectedFile =
        file;


    const oldPreview =
        document.querySelector(
            ".file-preview"
        );

    if (oldPreview) {
        oldPreview.remove();
    }


    const filePreview =
        document.createElement(
            "div"
        );

    filePreview.className =
        "file-preview";


    const fileName =
        document.createElement(
            "span"
        );

    fileName.textContent =
        "📎 " + file.name;

    fileName.className =
        "file-name";


    if (
        file.type &&
        file.type.startsWith(
            "image/"
        )
    ) {

        const imagePreview =
            document.createElement(
                "img"
            );

        imagePreview.src =
            URL.createObjectURL(
                file
            );

        imagePreview.className =
            "attachment-thumbnail";

        filePreview.appendChild(
            imagePreview
        );

    } else {

        filePreview.appendChild(
            fileName
        );
    }


    const removeFileButton =
        document.createElement(
            "button"
        );

    removeFileButton.textContent =
        "✕";

    removeFileButton.className =
        "remove-file-btn";


    removeFileButton.addEventListener(
        "click",
        () => {

            selectedFile =
                null;

            if (imageInput) {
                imageInput.value =
                    "";
            }

            if (documentInput) {
                documentInput.value =
                    "";
            }

            filePreview.remove();
        }
    );


    filePreview.appendChild(
        removeFileButton
    );


    if (filePreviewContainer) {

        filePreviewContainer.appendChild(
            filePreview
        );
    }


    chatBox.scrollTop =
        chatBox.scrollHeight;
}


if (imageInput) {

    imageInput.addEventListener(
        "change",
        () => {

            handleFileSelection(
                imageInput
            );
        }
    );
}


if (documentInput) {

    documentInput.addEventListener(
        "change",
        () => {

            handleFileSelection(
                documentInput
            );
        }
    );
}


// ============================================================
// REACTION BUTTONS
// ============================================================

function addReactionButtons(
    container,
    message
) {

    const likeButton =
        document.createElement(
            "button"
        );

    likeButton.className =
        "reaction-btn";

    likeButton.textContent =
        "👍";

    likeButton.title =
        "Helpful";


    const dislikeButton =
        document.createElement(
            "button"
        );

    dislikeButton.className =
        "reaction-btn";

    dislikeButton.textContent =
        "👎";

    dislikeButton.title =
        "Not helpful";


    function updateReactionUI() {

        likeButton.classList.toggle(
            "selected",
            message.reaction === "like"
        );

        dislikeButton.classList.toggle(
            "selected",
            message.reaction === "dislike"
        );
    }


    likeButton.addEventListener(
        "click",
        () => {

            if (
                message.reaction ===
                "like"
            ) {

                message.reaction =
                    null;

            } else {

                message.reaction =
                    "like";
            }

            updateReactionUI();

            saveChats();
        }
    );


    dislikeButton.addEventListener(
        "click",
        () => {

            if (
                message.reaction ===
                "dislike"
            ) {

                message.reaction =
                    null;

            } else {

                message.reaction =
                    "dislike";
            }

            updateReactionUI();

            saveChats();
        }
    );


    updateReactionUI();


    container.appendChild(
        likeButton
    );

    container.appendChild(
        dislikeButton
    );
}


// ============================================================
// SEND MESSAGE
// ============================================================

if (chatForm) {

    chatForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const message =
                userInput.value.trim();

            const file =
                selectedFile;


            if (
                !message &&
                !file &&
                !isRegenerating
            ) {
                return;
            }


            // ====================================================
            // NORMAL MESSAGE
            // ====================================================

            if (!isRegenerating) {

                let savedFile =
                    null;


                if (file) {

                    const base64 =
                        await fileToBase64(
                            file
                        );


                    savedFile = {

                        name:
                            file.name,

                        type:
                            file.type,

                        data:
                            file.type &&
                            file.type.startsWith(
                                "image/"
                            )
                                ? base64
                                : null
                    };
                }


                // =================================================
                // EDIT EXISTING MESSAGE
                // =================================================

                if (
                    editingMessageIndex !==
                    null
                ) {

                    conversation[
                        editingMessageIndex
                    ] = {

                        role:
                            "user",

                        text:
                            message,

                        file:
                            savedFile,

                        timestamp:
                            new Date().toISOString()
                    };


                    editingMessageIndex =
                        null;


                    chatBox.innerHTML =
                        "";

                    lastDisplayedDate =
                        null;


                    conversation.forEach(
                        msg => {

                            displaySavedMessage(
                                msg
                            );
                        }
                    );

                }

                // =================================================
                // NORMAL NEW MESSAGE
                // =================================================

                else {

                    if (message || savedFile) {

                        addMessage(
                            message,
                            "user",
                            savedFile
                        );
                    }


                    conversation.push({

                        role:
                            "user",

                        text:
                            message,

                        file:
                            savedFile,

                        timestamp:
                            new Date().toISOString()
                    });
                }


                currentChat.messages =
                    conversation;


                saveChats();

                updateChatHistory();


                userInput.value =
                    "";

                userInput.style.height =
                    "auto";


                messageCount.textContent =
                    "0 characters · 0 words";
            }


            // ====================================================
            // AI LOADING MESSAGE
            // ====================================================

            const loadingMessage =
                addMessage(
                    "",
                    "bot"
                );


            loadingMessage.innerHTML = `

                <div class="thinking">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>
            `;


            try {

                let imageData =
                    null;

                let pdfData =
                    null;

                let textFileData =
                    null;

                let docxFileData =
                    null;


                // =================================================
                // FILE DATA
                // =================================================

                if (
                    file &&
                    !isRegenerating
                ) {

                    const base64 =
                        await fileToBase64(
                            file
                        );


                    if (
                        file.type &&
                        file.type.startsWith(
                            "image/"
                        )
                    ) {

                        imageData =
                            base64;

                    }

                    else if (
                        file.type ===
                        "application/pdf"
                    ) {

                        pdfData =
                            base64;

                    }

                    else if (
                        file.type ===
                        "text/plain"
                    ) {

                        textFileData =
                            await file.text();

                    }

                    else if (
                        file.type ===
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ) {

                        docxFileData =
                            base64;
                    }
                }


                // =================================================
                // SEND REQUEST
                // =================================================

                const response =
                    await fetch(
                        "/chat",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    conversation:
                                        conversation,

                                    instructions:
                                        instructionsInput
                                            ? instructionsInput.value
                                            : "",

                                    aiMode:
                                        aiModeSelect
                                            ? aiModeSelect.value
                                            : "normal",

                                    image:
                                        imageData,

                                    pdf:
                                        pdfData,

                                    textFile:
                                        textFileData,

                                    docxFile:
                                        docxFileData
                                })
                        }
                    );


                // =================================================
                // ERROR RESPONSE
                // =================================================

                if (!response.ok) {

                    const errorText =
                        await response.text();


                    loadingMessage.textContent =
                        "Error: " +
                        errorText;


                    isRegenerating =
                        false;

                    currentReader =
                        null;

                    return;
                }


                if (!response.body) {

                    loadingMessage.textContent =
                        "Error: No response stream received.";

                    isRegenerating =
                        false;

                    return;
                }


                // =================================================
                // READ STREAM
                // =================================================

                const reader =
                    response.body.getReader();


                currentReader =
                    reader;


                const decoder =
                    new TextDecoder();


                let fullResponse =
                    "";

                let wasStopped =
                    false;


                loadingMessage.innerHTML =
                    "";


                const responseContent =
                    document.createElement(
                        "div"
                    );


                responseContent.className =
                    "response-content";


                loadingMessage.appendChild(
                    responseContent
                );


                // =================================================
                // STOP BUTTON
                // =================================================

                const stopButton =
                    document.createElement(
                        "button"
                    );


                stopButton.className =
                    "stop-btn";

                stopButton.textContent =
                    "🛑 Stop";

                stopButton.title =
                    "Stop generating";


                stopButton.addEventListener(
                    "click",
                    async () => {

                        wasStopped =
                            true;


                        if (currentReader) {

                            try {

                                await currentReader.cancel();

                            } catch (error) {

                                console.error(
                                    "Reader cancel failed:",
                                    error
                                );
                            }

                            currentReader =
                                null;
                        }


                        responseContent.innerHTML =
                            marked.parse(
                                fullResponse ||
                                "Generation stopped."
                            );


                        stopButton.remove();


                        if (fullResponse) {

                            const stoppedMessage = {

                                role:
                                    "model",

                                text:
                                    fullResponse,

                                reaction:
                                    null,

                                pinned:
                                    false,

                                timestamp:
                                    new Date().toISOString()
                            };


                            conversation.push(
                                stoppedMessage
                            );


                            currentChat.messages =
                                conversation;


                            saveChats();

                            updateChatHistory();
                        }


                        isRegenerating =
                            false;

                        currentReader =
                            null;
                    }
                );


                loadingMessage.appendChild(
                    stopButton
                );


                // =================================================
                // STREAM LOOP
                // =================================================

                while (true) {

                    const {
                        value,
                        done
                    } =
                        await reader.read();


                    if (done) {
                        break;
                    }


                    const chunk =
                        decoder.decode(
                            value,
                            {
                                stream:
                                    true
                            }
                        );


                    fullResponse +=
                        chunk;


                    responseContent.innerHTML =
                        marked.parse(
                            fullResponse
                        );


                    chatBox.scrollTop =
                        chatBox.scrollHeight;
                }


                currentReader =
                    null;


                if (stopButton.isConnected) {
                    stopButton.remove();
                }


                // =================================================
                // SAVE AI RESPONSE
                // =================================================

                let savedAIMessage =
                    null;


                if (!wasStopped) {

                    savedAIMessage = {

                        role:
                            "model",

                        text:
                            fullResponse,

                        reaction:
                            null,

                        pinned:
                            false,

                        timestamp:
                            new Date().toISOString()
                    };


                    conversation.push(
                        savedAIMessage
                    );

                } else {

                    savedAIMessage =
                        conversation[
                            conversation.length - 1
                        ];
                }


                // =================================================
                // COPY BUTTON
                // =================================================

                const copyButton =
                    document.createElement(
                        "button"
                    );


                copyButton.className =
                    "copy-btn";

                copyButton.title =
                    "Copy response";

                copyButton.textContent =
                    "⧉";


                copyButton.addEventListener(
                    "click",
                    async () => {

                        try {

                            await navigator.clipboard.writeText(
                                fullResponse
                            );


                            copyButton.textContent =
                                "✓";


                            copyButton.classList.add(
                                "copied"
                            );


                            setTimeout(
                                () => {

                                    copyButton.textContent =
                                        "⧉";

                                    copyButton.classList.remove(
                                        "copied"
                                    );

                                },
                                1500
                            );

                        } catch (error) {

                            console.error(
                                "Copy failed:",
                                error
                            );
                        }
                    }
                );


                loadingMessage.appendChild(
                    copyButton
                );


                // =================================================
                // REGENERATE BUTTON
                // =================================================

                const regenerateButton =
                    document.createElement(
                        "button"
                    );


                regenerateButton.className =
                    "regenerate-btn";

                regenerateButton.title =
                    "Regenerate response";

                regenerateButton.textContent =
                    "↻";


                regenerateButton.addEventListener(
                    "click",
                    () => {

                        if (
                            conversation.length >
                                0 &&
                            conversation[
                                conversation.length - 1
                            ].role === "model"
                        ) {

                            conversation.pop();
                        }


                        currentChat.messages =
                            conversation;


                        saveChats();


                        loadingMessage.remove();


                        const lastUserMessage =
                            conversation[
                                conversation.length - 1
                            ];


                        if (!lastUserMessage) {
                            return;
                        }


                        userInput.value =
                            lastUserMessage.text ||
                            "";


                        userInput.dispatchEvent(
                            new Event("input")
                        );


                        isRegenerating =
                            true;


                        chatForm.requestSubmit();
                    }
                );


                loadingMessage.appendChild(
                    regenerateButton
                );


                // =================================================
                // READ ALOUD
                // =================================================

                const speakButton =
                    document.createElement(
                        "button"
                    );


                speakButton.className =
                    "speak-btn";

                speakButton.title =
                    "Read aloud";

                speakButton.textContent =
                    "🔊";


                speakButton.addEventListener(
                    "click",
                    () => {

                        if (
                            speechSynthesis.speaking &&
                            currentSpeechButton ===
                                speakButton
                        ) {

                            speechSynthesis.cancel();

                            speakButton.textContent =
                                "🔊";

                            speakButton.title =
                                "Read aloud";

                            currentSpeechButton =
                                null;

                            return;
                        }


                        if (currentSpeechButton) {

                            currentSpeechButton.textContent =
                                "🔊";

                            currentSpeechButton.title =
                                "Read aloud";
                        }


                        speechSynthesis.cancel();


                        const speech =
                            new SpeechSynthesisUtterance(
                                fullResponse
                            );


                        currentSpeechButton =
                            speakButton;


                        speakButton.textContent =
                            "⏹️";

                        speakButton.title =
                            "Stop speaking";


                        speech.onend =
                            () => {

                                speakButton.textContent =
                                    "🔊";

                                speakButton.title =
                                    "Read aloud";

                                currentSpeechButton =
                                    null;
                            };


                        speech.onerror =
                            () => {

                                speakButton.textContent =
                                    "🔊";

                                speakButton.title =
                                    "Read aloud";

                                currentSpeechButton =
                                    null;
                            };


                        speechSynthesis.speak(
                            speech
                        );
                    }
                );


                loadingMessage.appendChild(
                    speakButton
                );


                // =================================================
                // BRANCH FROM HERE
                // =================================================

                const branchButton =
                    document.createElement(
                        "button"
                    );


                branchButton.className =
                    "branch-btn";

                branchButton.textContent =
                    "🔀";

                branchButton.title =
                    "Branch from here";


                branchButton.addEventListener(
                    "click",
                    () => {

                        const messageIndex =
                            conversation.indexOf(
                                savedAIMessage
                            );


                        if (
                            messageIndex ===
                            -1
                        ) {
                            return;
                        }


                        const branchMessages =
                            conversation.slice(
                                0,
                                messageIndex + 1
                            );


                        const newChat = {

                            id:
                                Date.now().toString(),

                            title:
                                "Branch: " +
                                (
                                    savedAIMessage.text ||
                                    "New Chat"
                                )
                                    .replace(
                                        /\s+/g,
                                        " "
                                    )
                                    .substring(
                                        0,
                                        28
                                    ),

                            customTitle:
                                false,

                            category:
                                currentChat.category ||
                                "general",

                            messages:
                                JSON.parse(
                                    JSON.stringify(
                                        branchMessages
                                    )
                                )
                        };


                        chats.push(
                            newChat
                        );


                        currentChatId =
                            newChat.id;


                        currentChat =
                            newChat;


                        conversation =
                            currentChat.messages;


                        localStorage.setItem(
                            "currentChatId",
                            currentChatId
                        );


                        saveChats();


                        lastDisplayedDate =
                            null;


                        chatBox.innerHTML =
                            "";


                        conversation.forEach(
                            branchMessage => {

                                displaySavedMessage(
                                    branchMessage
                                );
                            }
                        );


                        updateChatHistory();
                    }
                );


                loadingMessage.appendChild(
                    branchButton
                );


                // =================================================
                // REACTIONS
                // =================================================

                addReactionButtons(
                    loadingMessage,
                    savedAIMessage
                );


                // =================================================
                // PIN BUTTON
                // =================================================

                const pinButton =
                    document.createElement(
                        "button"
                    );


                pinButton.className =
                    "pin-btn";


                pinButton.textContent =
                    savedAIMessage.pinned
                        ? "📌"
                        : "📍";


                pinButton.title =
                    savedAIMessage.pinned
                        ? "Unpin message"
                        : "Pin message";


                pinButton.addEventListener(
                    "click",
                    () => {

                        savedAIMessage.pinned =
                            !savedAIMessage.pinned;


                        pinButton.textContent =
                            savedAIMessage.pinned
                                ? "📌"
                                : "📍";


                        pinButton.title =
                            savedAIMessage.pinned
                                ? "Unpin message"
                                : "Pin message";


                        saveChats();
                    }
                );


                loadingMessage.appendChild(
                    pinButton
                );


                // =================================================
                // FOLLOW-UP SUGGESTIONS
                // =================================================

                const followUpSuggestions =
                    generateFollowUpSuggestions(
                        fullResponse
                    );


                showFollowUpSuggestions(
                    followUpSuggestions
                );


                // =================================================
                // SAVE
                // =================================================

                currentChat.messages =
                    conversation;


                saveChats();

                updateChatHistory();


                // =================================================
                // CLEAR FILE
                // =================================================

                if (imageInput) {
                    imageInput.value =
                        "";
                }

                if (documentInput) {
                    documentInput.value =
                        "";
                }


                selectedFile =
                    null;


                if (filePreviewContainer) {

                    filePreviewContainer.innerHTML =
                        "";
                }


                isRegenerating =
                    false;
            }


            // ====================================================
            // ERROR HANDLING
            // ====================================================

            catch (error) {

                console.error(
                    "Chat error:",
                    error
                );


                loadingMessage.textContent =
                    "Sorry, something went wrong.";


                isRegenerating =
                    false;

                currentReader =
                    null;
            }
        }
    );
}


// ============================================================
// ADD MESSAGE
// ============================================================

function addMessage(
    text,
    type,
    file = null
) {

    const messageDiv =
        document.createElement(
            "div"
        );


    messageDiv.classList.add(
        "message",
        type
    );


    // =========================================================
    // ATTACHMENT
    // =========================================================

    if (
        type === "user" &&
        file
    ) {

        if (
            file.type &&
            file.type.startsWith(
                "image/"
            ) &&
            file.data
        ) {

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                file.data;


            image.style.maxWidth =
                "250px";


            image.style.maxHeight =
                "250px";


            image.style.borderRadius =
                "10px";


            image.style.display =
                "block";


            image.style.marginBottom =
                "8px";


            messageDiv.appendChild(
                image
            );

        }

        else if (file.name) {

            const fileLabel =
                document.createElement(
                    "div"
                );


            fileLabel.textContent =
                file.type ===
                "application/pdf"
                    ? "📄 " + file.name
                    : "📎 " + file.name;


            fileLabel.style.marginBottom =
                "8px";


            messageDiv.appendChild(
                fileLabel
            );
        }
    }


    // =========================================================
    // MESSAGE TEXT
    // =========================================================

    const messageText =
        document.createElement(
            "div"
        );


    messageText.textContent =
        text;


    if (text) {

        messageDiv.appendChild(
            messageText
        );
    }


    // =========================================================
    // USER MESSAGE
    // =========================================================

    if (type === "user") {

        const messageWrapper =
            document.createElement(
                "div"
            );


        messageWrapper.className =
            "message-wrapper";


        // =====================================================
        // EDIT BUTTON
        // =====================================================

        const editButton =
            document.createElement(
                "button"
            );


        editButton.className =
            "edit-btn";

        editButton.textContent =
            "✎";

        editButton.title =
            "Edit message";


        // =====================================================
        // COPY USER MESSAGE
        // =====================================================

        const copyUserButton =
            document.createElement(
                "button"
            );


        copyUserButton.className =
            "copy-user-btn";

        copyUserButton.textContent =
            "⧉";

        copyUserButton.title =
            "Copy message";


        copyUserButton.addEventListener(
            "click",
            async event => {

                event.stopPropagation();


                try {

                    await navigator.clipboard.writeText(
                        text
                    );


                    copyUserButton.textContent =
                        "✓";


                    setTimeout(
                        () => {

                            copyUserButton.textContent =
                                "⧉";

                        },
                        1200
                    );

                } catch (error) {

                    console.error(
                        "Copy failed:",
                        error
                    );
                }
            }
        );


        // =====================================================
        // EDIT
        // =====================================================

        editButton.addEventListener(
            "click",
            () => {

                const userMessages =
                    conversation.filter(
                        message =>
                            message.role ===
                            "user"
                    );


                const lastUserMessage =
                    userMessages[
                        userMessages.length - 1
                    ];


                const messageIndex =
                    conversation.indexOf(
                        lastUserMessage
                    );


                editingMessageIndex =
                    messageIndex;


                userInput.value =
                    text;


                userInput.focus();


                userInput.setSelectionRange(
                    userInput.value.length,
                    userInput.value.length
                );


                userInput.dispatchEvent(
                    new Event("input")
                );
            }
        );


        messageWrapper.appendChild(
            messageDiv
        );


        // =====================================================
        // USER ACTIONS
        // =====================================================

        const userActions =
            document.createElement(
                "div"
            );


        userActions.className =
            "user-actions";


        userActions.appendChild(
            editButton
        );


        userActions.appendChild(
            copyUserButton
        );


        // =====================================================
        // SAVE AS PROMPT
        // =====================================================

        const savePromptButton =
            document.createElement(
                "button"
            );


        savePromptButton.className =
            "save-prompt-response-btn";


        savePromptButton.textContent =
            savedPrompts.includes(
                text.trim()
            )
                ? "✓"
                : "📝";


        savePromptButton.title =
            savedPrompts.includes(
                text.trim()
            )
                ? "Saved"
                : "Save as Prompt";


        savePromptButton.addEventListener(
            "click",
            () => {

                const promptText =
                    text.trim();


                if (!promptText) {
                    return;
                }


                const promptIndex =
                    savedPrompts.indexOf(
                        promptText
                    );


                if (promptIndex === -1) {

                    savedPrompts.push(
                        promptText
                    );


                    savePromptButton.textContent =
                        "✓";


                    savePromptButton.title =
                        "Saved";

                } else {

                    savedPrompts.splice(
                        promptIndex,
                        1
                    );


                    savePromptButton.textContent =
                        "📝";


                    savePromptButton.title =
                        "Save as Prompt";
                }


                localStorage.setItem(
                    "savedPrompts",
                    JSON.stringify(
                        savedPrompts
                    )
                );


                renderPromptLibrary();
            }
        );


        userActions.appendChild(
            savePromptButton
        );


        messageWrapper.appendChild(
            userActions
        );


        chatBox.appendChild(
            messageWrapper
        );


        chatBox.scrollTop =
            chatBox.scrollHeight;


        return messageWrapper;
    }


    // =========================================================
    // AI MESSAGE
    // =========================================================

    chatBox.appendChild(
        messageDiv
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;


    return messageDiv;
}


// ============================================================
// DISPLAY SAVED MESSAGE
// ============================================================

function displaySavedMessage(
    message
) {

    // =========================================================
    // DATE SEPARATOR
    // =========================================================

    if (message.timestamp) {

        const messageDate =
            new Date(
                message.timestamp
            ).toLocaleDateString();


        if (
            messageDate !==
            lastDisplayedDate
        ) {

            const dateDiv =
                document.createElement(
                    "div"
                );


            dateDiv.className =
                "message-date";


            dateDiv.textContent =
                new Date(
                    message.timestamp
                ).toLocaleDateString(
                    [],
                    {
                        day:
                            "numeric",

                        month:
                            "long",

                        year:
                            "numeric"
                    }
                );


            chatBox.appendChild(
                dateDiv
            );


            lastDisplayedDate =
                messageDate;
        }
    }


    // =========================================================
    // MESSAGE
    // =========================================================

    if (!message.text && !message.file) {
        return;
    }


    const messageDiv =
        addMessage(
            message.text || "",
            message.role === "user"
                ? "user"
                : "bot",
            message.file
        );


    // =========================================================
    // AI SAVED MESSAGE
    // =========================================================

    if (
        message.role ===
        "model"
    ) {

        messageDiv.innerHTML =
            marked.parse(
                message.text || ""
            );


        // =====================================================
        // COPY
        // =====================================================

        const copyButton =
            document.createElement(
                "button"
            );


        copyButton.className =
            "copy-btn";

        copyButton.textContent =
            "⧉";

        copyButton.title =
            "Copy response";


        copyButton.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard.writeText(
                        message.text || ""
                    );


                    copyButton.textContent =
                        "✓";


                    setTimeout(
                        () => {

                            copyButton.textContent =
                                "⧉";

                        },
                        1200
                    );

                } catch (error) {

                    console.error(
                        "Copy failed:",
                        error
                    );
                }
            }
        );


        // =====================================================
        // REGENERATE
        // =====================================================

        const regenerateButton =
            document.createElement(
                "button"
            );


        regenerateButton.className =
            "regenerate-btn";

        regenerateButton.textContent =
            "↻";

        regenerateButton.title =
            "Regenerate response";


        regenerateButton.addEventListener(
            "click",
            () => {

                const messageIndex =
                    conversation.indexOf(
                        message
                    );


                if (
                    messageIndex !==
                    -1
                ) {

                    conversation.splice(
                        messageIndex,
                        1
                    );
                }


                currentChat.messages =
                    conversation;


                saveChats();


                userInput.value =
                    conversation[
                        conversation.length - 1
                    ]?.text || "";


                userInput.dispatchEvent(
                    new Event("input")
                );


                isRegenerating =
                    true;


                chatForm.requestSubmit();
            }
        );


        // =====================================================
        // READ ALOUD
        // =====================================================

        const speakButton =
            document.createElement(
                "button"
            );


        speakButton.className =
            "speak-btn";

        speakButton.textContent =
            "🔊";

        speakButton.title =
            "Read aloud";


        speakButton.addEventListener(
            "click",
            () => {

                if (
                    speechSynthesis.speaking &&
                    currentSpeechButton ===
                        speakButton
                ) {

                    speechSynthesis.cancel();

                    speakButton.textContent =
                        "🔊";

                    speakButton.title =
                        "Read aloud";

                    currentSpeechButton =
                        null;

                    return;
                }


                if (currentSpeechButton) {

                    currentSpeechButton.textContent =
                        "🔊";

                    currentSpeechButton.title =
                        "Read aloud";
                }


                speechSynthesis.cancel();


                const utterance =
                    new SpeechSynthesisUtterance(
                        message.text || ""
                    );


                currentSpeechButton =
                    speakButton;


                speakButton.textContent =
                    "⏹️";

                speakButton.title =
                    "Stop speaking";


                utterance.onend =
                    () => {

                        speakButton.textContent =
                            "🔊";

                        speakButton.title =
                            "Read aloud";

                        currentSpeechButton =
                            null;
                    };


                utterance.onerror =
                    () => {

                        speakButton.textContent =
                            "🔊";

                        speakButton.title =
                            "Read aloud";

                        currentSpeechButton =
                            null;
                    };


                speechSynthesis.speak(
                    utterance
                );
            }
        );


        messageDiv.appendChild(
            copyButton
        );

        messageDiv.appendChild(
            regenerateButton
        );

        messageDiv.appendChild(
            speakButton
        );


        // =====================================================
        // BRANCH
        // =====================================================

        const branchButton =
            document.createElement(
                "button"
            );


        branchButton.className =
            "branch-btn";

        branchButton.textContent =
            "🔀";

        branchButton.title =
            "Branch from here";


        branchButton.addEventListener(
            "click",
            () => {

                const messageIndex =
                    conversation.indexOf(
                        message
                    );


                if (
                    messageIndex ===
                    -1
                ) {
                    return;
                }


                const branchMessages =
                    conversation.slice(
                        0,
                        messageIndex + 1
                    );


                const newChat = {

                    id:
                        Date.now().toString(),

                    title:
                        "Branch: " +
                        (
                            message.text ||
                            "New Chat"
                        )
                            .replace(
                                /\s+/g,
                                " "
                            )
                            .substring(
                                0,
                                28
                            ),

                    customTitle:
                        false,

                    category:
                        currentChat.category ||
                        "general",

                    messages:
                        JSON.parse(
                            JSON.stringify(
                                branchMessages
                            )
                        )
                };


                chats.push(
                    newChat
                );


                currentChatId =
                    newChat.id;


                currentChat =
                    newChat;


                conversation =
                    currentChat.messages;


                localStorage.setItem(
                    "currentChatId",
                    currentChatId
                );


                saveChats();


                lastDisplayedDate =
                    null;


                chatBox.innerHTML =
                    "";


                conversation.forEach(
                    branchMessage => {

                        displaySavedMessage(
                            branchMessage
                        );
                    }
                );


                updateChatHistory();
            }
        );


        messageDiv.appendChild(
            branchButton
        );


        // =====================================================
        // PIN
        // =====================================================

        const pinButton =
            document.createElement(
                "button"
            );


        pinButton.className =
            "pin-btn";


        pinButton.textContent =
            message.pinned
                ? "📌"
                : "📍";


        pinButton.title =
            message.pinned
                ? "Unpin message"
                : "Pin message";


        pinButton.addEventListener(
            "click",
            () => {

                message.pinned =
                    !message.pinned;


                pinButton.textContent =
                    message.pinned
                        ? "📌"
                        : "📍";


                pinButton.title =
                    message.pinned
                        ? "Unpin message"
                        : "Pin message";


                saveChats();
            }
        );


        messageDiv.appendChild(
            pinButton
        );


        // =====================================================
        // REACTIONS
        // =====================================================

        addReactionButtons(
            messageDiv,
            message
        );
    }


    // =========================================================
    // TIMESTAMP
    // =========================================================

    if (message.timestamp) {

        const timeDiv =
            document.createElement(
                "div"
            );


        timeDiv.className =
            "message-time";


        timeDiv.textContent =
            new Date(
                message.timestamp
            ).toLocaleTimeString(
                [],
                {
                    hour:
                        "numeric",

                    minute:
                        "2-digit"
                }
            );


        messageDiv.appendChild(
            timeDiv
        );
    }
}


// ============================================================
// SUGGESTION BUTTONS
// ============================================================

function setupSuggestionButtons() {

    const buttons =
        document.querySelectorAll(
            ".suggestions button"
        );


    const mode =
        aiModeSelect
            ? aiModeSelect.value
            : "normal";


    const suggestions = {

        normal: [

            "💡 Explain something",

            "❓ Ask a question",

            "📝 Help me write",

            "🧠 Give me an idea"
        ],


        study: [

            "📖 Explain this topic simply",

            "🧠 Teach me step-by-step",

            "📝 Make me a quiz",

            "📚 Summarize my notes"
        ],


        code: [

            "🐛 Find the bug",

            "💡 Explain this code",

            "⚡ Optimize my code",

            "🧪 Write test cases"
        ],


        interview: [

            "🎯 Ask me an interview question",

            "🗣️ Give me an interview answer",

            "💻 Practice coding questions",

            "📋 Improve my interview answer"
        ],


        creative: [

            "✨ Give me some ideas",

            "✍️ Improve my writing",

            "📖 Create a story",

            "💡 Brainstorm with me"
        ]
    };


    const currentSuggestions =
        suggestions[mode] ||
        suggestions.normal;


    buttons.forEach(
        (button, index) => {

            button.textContent =
                currentSuggestions[index] ||
                "";


            button.onclick =
                () => {

                    const text =
                        button.textContent;


                    if (
                        text
                            .toLowerCase()
                            .includes("image")
                    ) {

                        if (imageInput) {
                            imageInput.click();
                        }

                        return;
                    }


                    userInput.value =
                        text.replace(
                            /^[^\w]+/,
                            ""
                        );


                    userInput.focus();


                    userInput.dispatchEvent(
                        new Event("input")
                    );
                };
        }
    );
}


if (aiModeSelect) {

    aiModeSelect.addEventListener(
        "change",
        () => {

            localStorage.setItem(
                "aiMode",
                aiModeSelect.value
            );


            setupSuggestionButtons();
        }
    );
}


// ============================================================
// LEARNING JOURNEY
// ============================================================

const learningJourneyButton =
    document.getElementById(
        "learning-journey-btn"
    );

const pinnedMessagesButton =
    document.getElementById(
        "pinned-messages-btn"
    );

const quickActionsButton =
    document.getElementById(
        "quick-actions-btn"
    );

const quickActionsMenu =
    document.getElementById(
        "quick-actions-menu"
    );


// ============================================================
// PINNED MESSAGES
// ============================================================

if (pinnedMessagesButton) {

    pinnedMessagesButton.addEventListener(
        "click",
        () => {

            const pinnedMessages =
                [];


            chats.forEach(
                chat => {

                    (chat.messages || []).forEach(
                        message => {

                            if (
                                message.role ===
                                    "model" &&
                                message.pinned
                            ) {

                                pinnedMessages.push({

                                    chat:
                                        chat.title,

                                    message:
                                        message.text
                                });
                            }
                        }
                    );
                }
            );


            if (
                pinnedMessages.length ===
                0
            ) {

                chatBox.innerHTML = `

                    <div class="learning-empty">

                        <div class="learning-empty-icon">
                            📌
                        </div>

                        <h3>
                            No pinned messages yet
                        </h3>

                        <p>
                            Pin useful AI responses and
                            they will appear here.
                        </p>

                    </div>
                `;

                return;
            }


            chatBox.innerHTML = `

                <div class="learning-journey">

                    <div class="learning-header">

                        <h2>
                            📌 Pinned Messages
                        </h2>

                        <p>
                            Your saved AI responses.
                        </p>

                    </div>

                    <div class="pinned-messages-list">

                        ${pinnedMessages
                            .map(
                                item => `

                                    <div class="pinned-message-card">

                                        <div class="pinned-message-chat">
                                            ${item.chat}
                                        </div>

                                        <div class="pinned-message-text">
                                            ${marked.parse(
                                                item.message ||
                                                ""
                                            )}
                                        </div>

                                    </div>
                                `
                            )
                            .join("")}

                    </div>

                </div>
            `;
        }
    );
}


// ============================================================
// LEARNING JOURNEY
// ============================================================

if (learningJourneyButton) {

    learningJourneyButton.addEventListener(
        "click",
        () => {

            const topicKeywords = {

                "HTML":
                    ["html"],

                "CSS":
                    ["css"],

                "JavaScript":
                    [
                        "javascript",
                        "js"
                    ],

                "Python":
                    ["python"],

                "Java":
                    ["java"],

                "C++":
                    ["c++"],

                "Web Development":
                    [
                        "web development",
                        "website",
                        "frontend",
                        "backend"
                    ],

                "Data Structures":
                    [
                        "data structure",
                        "array",
                        "linked list",
                        "stack",
                        "queue",
                        "tree",
                        "graph"
                    ],

                "Computer Networks":
                    [
                        "computer network",
                        "networking",
                        "tcp",
                        "udp",
                        "http",
                        "https"
                    ]
            };


            const detectedTopics =
                [];


            Object.entries(
                topicKeywords
            ).forEach(
                ([topic, keywords]) => {

                    let count =
                        0;


                    chats.forEach(
                        chat => {

                            const chatText =
                                (
                                    chat.messages ||
                                    []
                                )
                                    .map(
                                        message =>
                                            message.text ||
                                            ""
                                    )
                                    .join(" ")
                                    .toLowerCase();


                            const found =
                                keywords.some(
                                    keyword => {

                                        if (
                                            keyword ===
                                            "java"
                                        ) {

                                            return /\bjava\b/i.test(
                                                chatText
                                            );
                                        }


                                        return chatText.includes(
                                            keyword
                                        );
                                    }
                                );


                            if (found) {
                                count++;
                            }
                        }
                    );


                    if (count > 0) {

                        let status =
                            "Started";

                        let progress =
                            25;


                        if (count === 2) {

                            status =
                                "Exploring";

                            progress =
                                50;
                        }


                        if (count === 3) {

                            status =
                                "Practicing";

                            progress =
                                75;
                        }


                        if (count >= 4) {

                            status =
                                "Practicing";

                            progress =
                                100;
                        }


                        detectedTopics.push({

                            name:
                                topic,

                            status:
                                status,

                            progress:
                                progress,

                            count:
                                count,

                            lastStudied:
                                new Date()
                                    .toLocaleDateString()
                        });
                    }
                }
            );


            let topicsHTML =
                "";


            if (
                detectedTopics.length >
                0
            ) {

                topicsHTML =
                    detectedTopics
                        .map(
                            topic => `

                                <div
                                    class="learning-topic"
                                    data-topic="${topic.name}"
                                >

                                    <div class="learning-topic-top">

                                        <span class="learning-topic-name">
                                            ${topic.name}
                                        </span>

                                        <span class="learning-status">
                                            ${topic.status}
                                        </span>

                                    </div>

                                    <div class="learning-progress">

                                        <div
                                            class="learning-progress-bar"
                                            style="width: ${topic.progress}%"
                                        ></div>

                                    </div>

                                    <div class="learning-progress-text">
                                        ${topic.progress}% progress
                                    </div>

                                    <div class="learning-last-studied">
                                        Last studied: ${topic.lastStudied}
                                    </div>

                                    <div class="learning-chat-count">
                                        ${topic.count}
                                        conversation${topic.count === 1 ? "" : "s"}
                                    </div>

                                </div>
                            `
                        )
                        .join("");

            } else {

                topicsHTML = `

                    <div class="learning-empty">

                        <div class="learning-empty-icon">
                            📚
                        </div>

                        <h3>
                            Your learning journey starts here
                        </h3>

                        <p>
                            Ask My AI questions about programming,
                            technology, or any subject you want to learn.
                        </p>

                    </div>
                `;
            }


            const chatsStudied =
                chats.filter(
                    chat =>
                        (chat.messages || [])
                            .some(
                                message =>
                                    message.role ===
                                    "user"
                            )
                ).length;


            const topicsInProgress =
                detectedTopics.filter(
                    topic =>
                        topic.progress >=
                        50
                ).length;


            chatBox.innerHTML = `

                <div class="learning-journey">

                    <div class="learning-header">

                        <h2>
                            🧠 Learning Journey
                        </h2>

                        <p>
                            Topics you've explored through your conversations.
                        </p>

                        <div class="learning-summary">

                            <div class="learning-summary-item">

                                <span class="learning-summary-value">
                                    ${detectedTopics.length}
                                </span>

                                <span class="learning-summary-label">
                                    Topics explored
                                </span>

                            </div>

                            <div class="learning-summary-item">

                                <span class="learning-summary-value">
                                    ${chatsStudied}
                                </span>

                                <span class="learning-summary-label">
                                    Chats studied
                                </span>

                            </div>

                            <div class="learning-summary-item">

                                <span class="learning-summary-value">
                                    ${topicsInProgress}
                                </span>

                                <span class="learning-summary-label">
                                    Topics in progress
                                </span>

                            </div>

                        </div>

                    </div>

                    <div class="learning-topics">

                        ${topicsHTML}

                    </div>

                </div>
            `;


            // =================================================
            // OPEN MATCHING CHAT
            // =================================================

            document
                .querySelectorAll(
                    ".learning-topic"
                )
                .forEach(
                    topicCard => {

                        topicCard.addEventListener(
                            "click",
                            () => {

                                const topic =
                                    topicCard.dataset.topic;


                                const keywords =
                                    topicKeywords[
                                        topic
                                    ];


                                const matchingChat =
                                    [...chats]
                                        .reverse()
                                        .find(
                                            chat => {

                                                const chatText =
                                                    (
                                                        chat.messages ||
                                                        []
                                                    )
                                                        .map(
                                                            message =>
                                                                message.text ||
                                                                ""
                                                        )
                                                        .join(" ")
                                                        .toLowerCase();


                                                return keywords.some(
                                                    keyword => {

                                                        if (
                                                            keyword ===
                                                            "java"
                                                        ) {

                                                            return /\bjava\b/i.test(
                                                                chatText
                                                            );
                                                        }

                                                        return chatText.includes(
                                                            keyword
                                                        );
                                                    }
                                                );
                                            }
                                        );


                                if (
                                    !matchingChat
                                ) {
                                    return;
                                }


                                currentChatId =
                                    matchingChat.id;


                                currentChat =
                                    matchingChat;


                                conversation =
                                    currentChat.messages;


                                localStorage.setItem(
                                    "currentChatId",
                                    currentChatId
                                );


                                lastDisplayedDate =
                                    null;


                                chatBox.innerHTML = `

                                    <button
                                        class="back-learning-btn"
                                        id="back-learning-btn"
                                    >
                                        ← Learning Journey
                                    </button>
                                `;


                                conversation.forEach(
                                    message => {

                                        displaySavedMessage(
                                            message
                                        );
                                    }
                                );


                                const backButton =
                                    document.getElementById(
                                        "back-learning-btn"
                                    );


                                if (backButton) {

                                    backButton.addEventListener(
                                        "click",
                                        () => {

                                            learningJourneyButton.click();
                                        }
                                    );
                                }


                                updateChatHistory();
                            }
                        );
                    }
                );
        }
    );
}


// ============================================================
// NEW CHAT
// ============================================================

const newChatButton =
    document.querySelector(
        ".new-chat"
    );


if (newChatButton) {

    newChatButton.addEventListener(
        "click",
        () => {

            if (
                window.innerWidth <=
                700
            ) {

                sidebar.classList.remove(
                    "mobile-open"
                );
            }


            const newChat = {

                id:
                    Date.now().toString(),

                title:
                    "New Chat",

                customTitle:
                    false,

                category:
                    chatCategory
                        ? chatCategory.value
                        : "general",

                messages:
                    []
            };


            chats.push(
                newChat
            );


            currentChatId =
                newChat.id;


            currentChat =
                newChat;


            conversation =
                currentChat.messages;


            if (chatCategory) {

                chatCategory.value =
                    "general";
            }


            saveChats();


            localStorage.setItem(
                "currentChatId",
                currentChatId
            );


            if (imageInput) {
                imageInput.value =
                    "";
            }


            if (documentInput) {
                documentInput.value =
                    "";
            }


            selectedFile =
                null;


            isRegenerating =
                false;


            editingMessageIndex =
                null;


            lastDisplayedDate =
                null;


            const filePreview =
                document.querySelector(
                    ".file-preview"
                );


            if (filePreview) {
                filePreview.remove();
            }


            showFollowUpSuggestions([]);


            showWelcomeScreen();

            updateChatHistory();
        }
    );
}


// ============================================================
// WELCOME SCREEN
// ============================================================

function showWelcomeScreen() {

    chatBox.innerHTML = `

        <div class="welcome">

            <div class="welcome-icon">
                ✦
            </div>

            <h2>
                How can I help you today?
            </h2>

            <p>
                Ask questions, solve problems,
                write code, or upload an image or PDF.
            </p>

            <div class="suggestions">

                <button>
                    💡 Explain something
                </button>

                <button>
                    💻 Help me code
                </button>

                <button>
                    📚 Solve a question
                </button>

                <button>
                    🖼️ Analyze an image
                </button>

            </div>

        </div>
    `;


    setupSuggestionButtons();
}


// ============================================================
// CLEAR CHAT
// ============================================================

const clearButton =
    document.querySelector(
        ".clear-btn"
    );


if (clearButton) {

    clearButton.addEventListener(
        "click",
        () => {

            conversation =
                [];


            currentChat.messages =
                [];


            saveChats();


            if (imageInput) {
                imageInput.value =
                    "";
            }


            if (documentInput) {
                documentInput.value =
                    "";
            }


            selectedFile =
                null;


            editingMessageIndex =
                null;


            lastDisplayedDate =
                null;


            const filePreview =
                document.querySelector(
                    ".file-preview"
                );


            if (filePreview) {
                filePreview.remove();
            }


            showFollowUpSuggestions([]);


            chatBox.innerHTML = `

                <div class="message bot">

                    Chat cleared.
                    How can I help you?

                </div>
            `;


            updateChatHistory();
        }
    );
}


// ============================================================
// LOAD CURRENT CHAT
// ============================================================

function loadConversation() {

    if (
        !conversation ||
        conversation.length ===
            0
    ) {

        showWelcomeScreen();

        return;
    }


    chatBox.innerHTML =
        "";

    lastDisplayedDate =
        null;


    conversation.forEach(
        message => {

            displaySavedMessage(
                message
            );
        }
    );


    // =========================================================
    // RESTORE FOLLOW-UP SUGGESTIONS
    // =========================================================

    const lastAIMessage =
        [...conversation]
            .reverse()
            .find(
                message =>
                    message.role ===
                    "model"
            );


    if (lastAIMessage) {

        showFollowUpSuggestions(
            generateFollowUpSuggestions(
                lastAIMessage.text
            )
        );

    } else {

        showFollowUpSuggestions([]);
    }
}


// ============================================================
// UPDATE CHAT HISTORY
// ============================================================

function updateChatHistory(
    searchText = ""
) {

    const historyList =
        document.getElementById(
            "history-list"
        );


    if (!historyList) {
        return;
    }


    historyList.innerHTML =
        "";


    let visibleChats =
        0;


    const sortedChats =
        [...chats].reverse();


    sortedChats.forEach(
        chat => {

            if (
                showFavoritesOnly &&
                !chat.favorite
            ) {
                return;
            }


            if (
                selectedCategory !==
                    "all" &&
                (chat.category ||
                    "general") !==
                    selectedCategory
            ) {
                return;
            }


            const title =
                chat.title ||
                "New Chat";


            if (
                searchText &&
                !title
                    .toLowerCase()
                    .includes(
                        searchText
                    ) &&
                !(chat.messages || [])
                    .some(
                        message =>
                            message.role ===
                                "user" &&
                            message.text &&
                            message.text
                                .toLowerCase()
                                .includes(
                                    searchText
                                )
                    )
            ) {

                return;
            }


            const firstUserMessage =
                (chat.messages || [])
                    .find(
                        message =>
                            message.role ===
                            "user"
                    );


            // Don't show empty chats

            if (!firstUserMessage) {
                return;
            }


            visibleChats++;


            // =================================================
            // AUTOMATIC TITLE
            // =================================================

            if (
                !chat.customTitle
            ) {

                if (
                    firstUserMessage.text
                ) {

                    const cleanTitle =
                        firstUserMessage.text
                            .replace(
                                /\s+/g,
                                " "
                            )
                            .trim();


                    if (
                        cleanTitle.length >
                        28
                    ) {

                        const shortTitle =
                            cleanTitle.substring(
                                0,
                                28
                            );


                        const lastSpace =
                            shortTitle.lastIndexOf(
                                " "
                            );


                        chat.title =
                            (
                                lastSpace >
                                    0
                                    ? shortTitle.substring(
                                        0,
                                        lastSpace
                                    )
                                    : shortTitle
                            ) +
                            "...";

                    } else {

                        chat.title =
                            cleanTitle;
                    }

                } else if (
                    firstUserMessage.file
                ) {

                    chat.title =
                        firstUserMessage.file.name;

                } else {

                    chat.title =
                        "New Chat";
                }
            }


            // =================================================
            // HISTORY ITEM
            // =================================================

            const historyItem =
                document.createElement(
                    "div"
                );


            historyItem.className =
                "history-item";


            historyItem.dataset.chatId =
                chat.id;


            // =================================================
            // FAVORITE
            // =================================================

            const favoriteButton =
                document.createElement(
                    "button"
                );


            favoriteButton.className =
                "favorite-chat";


            favoriteButton.textContent =
                chat.favorite
                    ? "★"
                    : "☆";


            favoriteButton.title =
                chat.favorite
                    ? "Remove from favorites"
                    : "Favorite chat";


            // =================================================
            // TITLE
            // =================================================

            const titleSpan =
                document.createElement(
                    "span"
                );


            titleSpan.className =
                "history-title-text";


            titleSpan.textContent =
                chat.title;


            // =================================================
            // CATEGORY
            // =================================================

            const categorySpan =
                document.createElement(
                    "span"
                );


            categorySpan.className =
                "history-category";


            categorySpan.textContent =
                chat.category ||
                "general";


            // =================================================
            // ACTIONS
            // =================================================

            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "history-actions";


            // =================================================
            // RENAME
            // =================================================

            const renameButton =
                document.createElement(
                    "button"
                );


            renameButton.type =
                "button";


            renameButton.className =
                "rename-chat";


            renameButton.textContent =
                "✎";


            renameButton.title =
                "Rename chat";


            // =================================================
            // DELETE
            // =================================================

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.className =
                "delete-chat";


            deleteButton.textContent =
                "×";


            deleteButton.title =
                "Delete chat";


            actions.appendChild(
                favoriteButton
            );


            actions.appendChild(
                renameButton
            );


            actions.appendChild(
                deleteButton
            );


            historyItem.appendChild(
                titleSpan
            );


            historyItem.appendChild(
                categorySpan
            );


            historyItem.appendChild(
                actions
            );


            // =================================================
            // OPEN CHAT
            // =================================================

            historyItem.addEventListener(
                "click",
                event => {

                    if (
                        window.innerWidth <=
                        700
                    ) {

                        sidebar.classList.remove(
                            "mobile-open"
                        );
                    }


                    if (
                        event.target.closest(
                            "button"
                        )
                    ) {
                        return;
                    }


                    currentChatId =
                        chat.id;


                    currentChat =
                        chat;


                    conversation =
                        currentChat.messages;


                    localStorage.setItem(
                        "currentChatId",
                        currentChatId
                    );


                    if (chatCategory) {

                        chatCategory.value =
                            currentChat.category ||
                            "general";
                    }


                    if (imageInput) {
                        imageInput.value =
                            "";
                    }


                    if (documentInput) {
                        documentInput.value =
                            "";
                    }


                    selectedFile =
                        null;


                    editingMessageIndex =
                        null;


                    lastDisplayedDate =
                        null;


                    chatBox.innerHTML =
                        "";


                    conversation.forEach(
                        message => {

                            displaySavedMessage(
                                message
                            );
                        }
                    );


                    const lastAIMessage =
                        [...conversation]
                            .reverse()
                            .find(
                                message =>
                                    message.role ===
                                    "model"
                            );


                    if (lastAIMessage) {

                        showFollowUpSuggestions(
                            generateFollowUpSuggestions(
                                lastAIMessage.text
                            )
                        );

                    } else {

                        showFollowUpSuggestions([]);
                    }
                }
            );


            // =================================================
            // RENAME
            // =================================================

            renameButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const input =
                        document.createElement(
                            "input"
                        );


                    input.type =
                        "text";


                    input.value =
                        chat.title;


                    input.className =
                        "rename-input";


                    titleSpan.replaceWith(
                        input
                    );


                    input.focus();

                    input.select();


                    let saved =
                        false;


                    function saveRename() {

                        if (saved) {
                            return;
                        }


                        saved =
                            true;


                        const newTitle =
                            input.value.trim();


                        if (!newTitle) {

                            updateChatHistory();

                            return;
                        }


                        chat.title =
                            newTitle;


                        chat.customTitle =
                            true;


                        saveChats();

                        updateChatHistory();
                    }


                    input.addEventListener(
                        "keydown",
                        event => {

                            if (
                                event.key ===
                                "Enter"
                            ) {

                                event.preventDefault();

                                saveRename();
                            }


                            if (
                                event.key ===
                                "Escape"
                            ) {

                                event.preventDefault();

                                updateChatHistory();
                            }
                        }
                    );


                    input.addEventListener(
                        "blur",
                        saveRename
                    );
                }
            );


            // =================================================
            // FAVORITE
            // =================================================

            favoriteButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    chat.favorite =
                        !chat.favorite;


                    saveChats();

                    updateChatHistory();
                }
            );


            // =================================================
            // DELETE
            // =================================================

            deleteButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const confirmDelete =
                        confirm(
                            "Delete this chat?"
                        );


                    if (!confirmDelete) {
                        return;
                    }


                    chats =
                        chats.filter(
                            item =>
                                String(
                                    item.id
                                ) !==
                                String(
                                    chat.id
                                )
                        );


                    if (
                        String(
                            currentChatId
                        ) ===
                        String(
                            chat.id
                        )
                    ) {

                        const newChat = {

                            id:
                                Date.now().toString(),

                            title:
                                "New Chat",

                            customTitle:
                                false,

                            category:
                                "general",

                            messages:
                                []
                        };


                        chats.push(
                            newChat
                        );


                        currentChatId =
                            newChat.id;


                        currentChat =
                            newChat;


                        conversation =
                            newChat.messages;


                        lastDisplayedDate =
                            null;


                        localStorage.setItem(
                            "currentChatId",
                            currentChatId
                        );


                        if (chatCategory) {

                            chatCategory.value =
                                "general";
                        }


                        showWelcomeScreen();
                    }


                    saveChats();

                    updateChatHistory();
                }
            );


            historyList.appendChild(
                historyItem
            );
        }
    );


    // =========================================================
    // NO FAVORITES
    // =========================================================

    if (
        showFavoritesOnly &&
        visibleChats === 0
    ) {

        historyList.innerHTML = `

            <div class="no-favorites">
                ⭐ No favorite chats yet.
            </div>
        `;
    }


    saveChats();
}


// ============================================================
// CHAT SEARCH
// ============================================================

if (chatSearch) {

    chatSearch.addEventListener(
        "input",
        () => {

            updateChatHistory(
                chatSearch.value
                    .trim()
                    .toLowerCase()
            );
        }
    );
}


// ============================================================
// INITIAL HISTORY
// ============================================================

updateChatHistory();


// ============================================================
// EXPORT CHAT
// ============================================================

const exportMenu =
    document.getElementById(
        "export-menu"
    );

const exportMarkdown =
    document.getElementById(
        "export-markdown"
    );

const exportTxt =
    document.getElementById(
        "export-txt"
    );

const exportPrint =
    document.getElementById(
        "export-print"
    );


if (
    exportButton &&
    exportMenu
) {

    exportButton.addEventListener(
        "click",
        () => {

            exportMenu.style.display =
                exportMenu.style.display ===
                "block"
                    ? "none"
                    : "block";
        }
    );
}


// ============================================================
// EXPORT MARKDOWN
// ============================================================

if (exportMarkdown) {

    exportMarkdown.addEventListener(
        "click",
        () => {

            if (
                !conversation ||
                conversation.length ===
                    0
            ) {

                alert(
                    "There is no conversation to export."
                );

                return;
            }


            const exportDate =
                new Date().toLocaleString();


            let chatText =
                "# " +
                (
                    currentChat.title ||
                    "My AI Chat"
                ) +
                "\n\n" +
                "**Exported:** " +
                exportDate +
                "\n\n";


            conversation.forEach(
                message => {

                    const role =
                        message.role ===
                            "user"
                            ? "You"
                            : "My AI";


                    chatText +=
                        "## " +
                        role +
                        "\n\n" +
                        (
                            message.file
                                ? "📎 Attachment: " +
                                  message.file.name +
                                  "\n\n"
                                : ""
                        ) +
                        (
                            message.text ||
                            ""
                        ) +
                        "\n\n---\n\n";
                }
            );


            const blob =
                new Blob(
                    [chatText],
                    {
                        type:
                            "text/markdown"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                (
                    currentChat.title ||
                    "chat"
                ) +
                ".md";


            link.click();


            URL.revokeObjectURL(
                url
            );


            exportMenu.style.display =
                "none";
        }
    );
}


// ============================================================
// EXPORT TXT
// ============================================================

if (exportTxt) {

    exportTxt.addEventListener(
        "click",
        () => {

            if (
                !conversation ||
                conversation.length ===
                    0
            ) {

                alert(
                    "There is no conversation to export."
                );

                return;
            }


            const exportDate =
                new Date().toLocaleString();


            let chatText =
                (
                    currentChat.title ||
                    "My AI Chat"
                ) +
                "\n\n" +
                "Exported: " +
                exportDate +
                "\n\n";


            conversation.forEach(
                message => {

                    const role =
                        message.role ===
                            "user"
                            ? "You"
                            : "My AI";


                    chatText +=
                        role +
                        "\n" +
                        (
                            message.file
                                ? "Attachment: " +
                                  message.file.name +
                                  "\n"
                                : ""
                        ) +
                        (
                            message.text ||
                            ""
                        ) +
                        "\n\n--------------------\n\n";
                }
            );


            const blob =
                new Blob(
                    [chatText],
                    {
                        type:
                            "text/plain"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                (
                    currentChat.title ||
                    "chat"
                ) +
                ".txt";


            link.click();


            URL.revokeObjectURL(
                url
            );


            exportMenu.style.display =
                "none";
        }
    );
}


// ============================================================
// PRINT / SAVE AS PDF
// ============================================================

if (exportPrint) {

    exportPrint.addEventListener(
        "click",
        () => {

            if (
                !conversation ||
                conversation.length ===
                    0
            ) {

                alert(
                    "There is no conversation to print."
                );

                return;
            }


            let printContent =
                "<h1>" +
                (
                    currentChat.title ||
                    "My AI Chat"
                ) +
                "</h1>";


            printContent +=
                "<p><strong>Exported:</strong> " +
                new Date().toLocaleString() +
                "</p><hr>";


            conversation.forEach(
                message => {

                    const role =
                        message.role ===
                            "user"
                            ? "You"
                            : "My AI";


                    printContent +=
                        "<h2>" +
                        role +
                        "</h2>";


                    if (message.file) {

                        printContent +=
                            "<p>📎 Attachment: " +
                            message.file.name +
                            "</p>";
                    }


                    printContent +=
                        "<p>" +
                        (
                            message.text ||
                            ""
                        )
                            .replace(
                                /\n/g,
                                "<br>"
                            ) +
                        "</p><hr>";
                }
            );


            const printWindow =
                window.open(
                    "",
                    "_blank"
                );


            if (!printWindow) {

                alert(
                    "Please allow pop-ups to print the chat."
                );

                return;
            }


            printWindow.document.write(`

                <html>

                    <head>

                        <title>
                            My AI Chat
                        </title>

                        <style>

                            body {

                                font-family:
                                    Arial,
                                    sans-serif;

                                max-width:
                                    800px;

                                margin:
                                    40px auto;

                                line-height:
                                    1.6;

                                color:
                                    #222;
                            }

                            h1 {
                                margin-bottom:
                                    5px;
                            }

                            h2 {
                                margin-top:
                                    25px;
                            }

                            hr {

                                border:
                                    0;

                                border-top:
                                    1px solid #ddd;

                                margin:
                                    20px 0;
                            }

                        </style>

                    </head>

                    <body>

                        ${printContent}

                    </body>

                </html>
            `);


            printWindow.document.close();


            printWindow.focus();


            setTimeout(
                () => {

                    printWindow.print();

                },
                300
            );


            exportMenu.style.display =
                "none";
        }
    );
}


// ============================================================
// ALL CHATS FILTER
// ============================================================

const allChatsButton =
    document.getElementById(
        "all-chats-btn"
    );


if (allChatsButton) {

    allChatsButton.addEventListener(
        "click",
        () => {

            showFavoritesOnly =
                false;


            allChatsButton.classList.add(
                "active"
            );


            const favoriteButton =
                document.getElementById(
                    "favorite-chats-btn"
                );


            if (favoriteButton) {

                favoriteButton.classList.remove(
                    "active"
                );
            }


            updateChatHistory();
        }
    );
}


// ============================================================
// FAVORITES FILTER
// ============================================================

const favoriteChatsButton =
    document.getElementById(
        "favorite-chats-btn"
    );


if (favoriteChatsButton) {

    favoriteChatsButton.addEventListener(
        "click",
        () => {

            showFavoritesOnly =
                true;


            favoriteChatsButton.classList.add(
                "active"
            );


            const allButton =
                document.getElementById(
                    "all-chats-btn"
                );


            if (allButton) {

                allButton.classList.remove(
                    "active"
                );
            }


            updateChatHistory();
        }
    );
}


// ============================================================
// SEARCH CURRENT CONVERSATION
// ============================================================

function searchCurrentConversation() {

    const query =
        messageSearchInput.value
            .trim()
            .toLowerCase();


    // =========================================================
    // EMPTY SEARCH
    // =========================================================

    if (!query) {

        chatBox.innerHTML =
            "";

        lastDisplayedDate =
            null;


        conversation.forEach(
            message => {

                displaySavedMessage(
                    message
                );
            }
        );


        return;
    }


    // =========================================================
    // SEARCH
    // =========================================================

    chatBox.innerHTML =
        "";

    lastDisplayedDate =
        null;


    const matchingMessages =
        conversation.filter(
            message =>
                message.text &&
                message.text
                    .toLowerCase()
                    .includes(
                        query
                    )
        );


    if (
        matchingMessages.length ===
        0
    ) {

        chatBox.innerHTML = `

            <div class="search-no-results">

                🔍 No messages found

            </div>
        `;

        return;
    }


    matchingMessages.forEach(
        message => {

            displaySavedMessage(
                message
            );
        }
    );


    // =========================================================
    // HIGHLIGHT
    // =========================================================

    const escapedQuery =
        query.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    const messageElements =
        chatBox.querySelectorAll(
            ".message"
        );


    messageElements.forEach(
        element => {

            element.innerHTML =
                element.innerHTML.replace(
                    new RegExp(
                        `(${escapedQuery})`,
                        "gi"
                    ),
                    '<span class="search-highlight">$1</span>'
                );
        }
    );
}


if (messageSearchButton) {

    messageSearchButton.addEventListener(
        "click",
        () => {

            searchCurrentConversation();
        }
    );
}


if (messageSearchInput) {

    messageSearchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                searchCurrentConversation();
            }
        }
    );
}


// ============================================================
// QUICK ACTIONS
// ============================================================

if (
    quickActionsButton &&
    quickActionsMenu
) {

    quickActionsButton.addEventListener(
        "click",
        () => {

            quickActionsMenu.classList.toggle(
                "show"
            );
        }
    );


    const quickActionButtons =
        quickActionsMenu.querySelectorAll(
            "button"
        );


    quickActionButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const prompt =
                        button.dataset.prompt;


                    if (!prompt) {
                        return;
                    }


                    userInput.value =
                        prompt;


                    userInput.focus();


                    quickActionsMenu.classList.remove(
                        "show"
                    );


                    userInput.dispatchEvent(
                        new Event("input")
                    );
                }
            );
        }
    );
}


// ============================================================
// CATEGORY FILTER
// ============================================================

const categoryFilterSelect =
    document.getElementById(
        "category-filter-select"
    );


if (categoryFilterSelect) {

    categoryFilterSelect.addEventListener(
        "change",
        () => {

            selectedCategory =
                categoryFilterSelect.value;


            updateChatHistory();
        }
    );
}


// ============================================================
// VOICE INPUT
// ============================================================

const voiceBtn =
    document.getElementById(
        "voice-btn"
    );

const voiceLanguage =
    document.getElementById(
        "voice-language"
    );


if (
    voiceBtn &&
    voiceLanguage
) {

    const savedVoiceLanguage =
        localStorage.getItem(
            "voiceLanguage"
        );


    if (savedVoiceLanguage) {

        voiceLanguage.value =
            savedVoiceLanguage;
    }


    voiceLanguage.addEventListener(
        "change",
        () => {

            localStorage.setItem(
                "voiceLanguage",
                voiceLanguage.value
            );
        }
    );


    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        voiceBtn.disabled =
            true;

        voiceBtn.title =
            "Voice input is not supported in this browser.";

    } else {

        const recognition =
            new SpeechRecognition();


        recognition.continuous =
            false;


        recognition.interimResults =
            true;


        voiceBtn.addEventListener(
            "click",
            () => {

                try {

                    if (
                        voiceBtn.classList.contains(
                            "listening"
                        )
                    ) {

                        recognition.stop();

                        return;
                    }


                    recognition.lang =
                        voiceLanguage.value;


                    recognition.start();


                    voiceBtn.classList.add(
                        "listening"
                    );


                    voiceBtn.textContent =
                        "🔴";

                } catch (error) {

                    console.log(
                        "Voice start error:",
                        error
                    );
                }
            }
        );


        recognition.onresult =
            event => {

                let transcript =
                    "";


                for (
                    let i =
                        event.resultIndex;

                    i <
                        event.results.length;

                    i++
                ) {

                    transcript +=
                        event.results[
                            i
                        ][0].transcript;
                }


                userInput.value =
                    transcript;


                userInput.dispatchEvent(
                    new Event("input")
                );
            };


        recognition.onerror =
            event => {

                console.log(
                    "Voice recognition error:",
                    event.error
                );


                voiceBtn.classList.remove(
                    "listening"
                );


                voiceBtn.textContent =
                    "🎙️";
            };


        recognition.onend =
            () => {

                voiceBtn.classList.remove(
                    "listening"
                );


                voiceBtn.textContent =
                    "🎙️";
            };
    }
}


// ============================================================
// CHAT SUMMARY
// ============================================================

function summarizeCurrentChat() {

    if (
        !conversation ||
        conversation.length ===
            0
    ) {

        alert(
            "There is no conversation to summarize."
        );

        return;
    }


    const userMessages =
        conversation
            .filter(
                message =>
                    message.role ===
                    "user"
            )
            .map(
                message =>
                    message.text ||
                    ""
            )
            .filter(
                text =>
                    text.trim()
            );


    const aiMessages =
        conversation
            .filter(
                message =>
                    message.role ===
                    "model"
            )
            .map(
                message =>
                    message.text ||
                    ""
            )
            .filter(
                text =>
                    text.trim()
            );


    const summary = `

📑 Chat Summary

💬 User messages: ${userMessages.length}
🤖 AI responses: ${aiMessages.length}

📌 Topics discussed:
${userMessages
    .slice(0, 5)
    .map(
        (text, index) =>
            `${index + 1}. ${text.substring(
                0,
                100
            )}`
    )
    .join("\n")}

📝 Conversation length:
${conversation.length} messages
`;


    alert(
        summary
    );
}


if (summaryBtn) {

    summaryBtn.addEventListener(
        "click",
        () => {

            summarizeCurrentChat();
        }
    );
}


// ============================================================
// PROMPT LIBRARY
// ============================================================

const promptLibraryBtn =
    document.getElementById(
        "prompt-library-btn"
    );

const promptLibrary =
    document.getElementById(
        "prompt-library"
    );

const closePromptLibrary =
    document.getElementById(
        "close-prompt-library"
    );

const savePromptBtn =
    document.getElementById(
        "save-prompt-btn"
    );

const promptLibraryInput =
    document.getElementById(
        "prompt-library-input"
    );

const promptList =
    document.getElementById(
        "prompt-list"
    );


let savedPrompts =
    JSON.parse(
        localStorage.getItem(
            "savedPrompts"
        ) || "[]"
    );


// ============================================================
// RENDER PROMPT LIBRARY
// ============================================================

function renderPromptLibrary() {

    if (!promptList) {
        return;
    }


    promptList.innerHTML =
        "";


    savedPrompts.forEach(
        (prompt, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "prompt-item";


            const text =
                document.createElement(
                    "span"
                );


            text.className =
                "prompt-text";


            text.textContent =
                prompt;


            text.addEventListener(
                "click",
                () => {

                    userInput.value =
                        prompt;


                    userInput.focus();


                    userInput.dispatchEvent(
                        new Event("input")
                    );


                    promptLibrary.classList.remove(
                        "active"
                    );
                }
            );


            // =================================================
            // DELETE PROMPT
            // =================================================

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-prompt-btn";


            deleteButton.textContent =
                "🗑️";
deleteButton.title =
                "Delete prompt";
deleteButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    savedPrompts.splice(
                        index,
                        1
                    );


                    localStorage.setItem(
                        "savedPrompts",
                        JSON.stringify(
                            savedPrompts
                        )
                    );


                    renderPromptLibrary();
                }
            );


            item.appendChild(
                text
            );


            item.appendChild(
                deleteButton
            );


            promptList.appendChild(
                item
            );
        }
    );
}


// ============================================================
// OPEN PROMPT LIBRARY
// ============================================================

if (promptLibraryBtn) {

    promptLibraryBtn.addEventListener(
        "click",
        () => {

            promptLibrary.classList.toggle(
                "active"
            );


            renderPromptLibrary();
        }
    );
}


// ============================================================
// CLOSE PROMPT LIBRARY
// ============================================================

if (closePromptLibrary) {

    closePromptLibrary.addEventListener(
        "click",
        () => {

            promptLibrary.classList.remove(
                "active"
            );
        }
    );
}


// ============================================================
// SAVE PROMPT
// ============================================================

if (savePromptBtn) {

    savePromptBtn.addEventListener(
        "click",
        () => {

            const prompt =
                promptLibraryInput.value.trim();


            if (!prompt) {
                return;
            }


            if (
                !savedPrompts.includes(
                    prompt
                )
            ) {

                savedPrompts.push(
                    prompt
                );
            }


            localStorage.setItem(
                "savedPrompts",
                JSON.stringify(
                    savedPrompts
                )
            );


            promptLibraryInput.value =
                "";


            renderPromptLibrary();
        }
    );
}


// ============================================================
// ENTER TO SAVE PROMPT
// ============================================================

if (promptLibraryInput) {

    promptLibraryInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                savePromptBtn.click();
            }
        }
    );
}


// ============================================================
// INITIAL PROMPT LIBRARY
// ============================================================

renderPromptLibrary();


// ============================================================
// INITIAL LOAD
// ============================================================

loadConversation();


// ============================================================
// INITIAL SUGGESTIONS
// ============================================================

setupSuggestionButtons();