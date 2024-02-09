var linkElement = document.createElement('link');
var bootlinkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.type = 'text/css';
linkElement.href = './css/chatbot.css';
bootlinkElement.rel = 'stylesheet';
bootlinkElement.type = 'text/css';
bootlinkElement.href = './css/chatbotbootstrap.min.css';
document.head.appendChild(linkElement);
document.head.appendChild(bootlinkElement);

var chatWidgetContainer = document.createElement("div");
chatWidgetContainer.className = "frame-content chatbot-class";
chatWidgetContainer.innerHTML = `
<div class="widget-position-right sidebar-position-right onlyBubble chatContainer" id="chatContainer">
      <div class="chat no-clip-path chrome moveFromRight-enter-done">
        <div class="chat-header project-online">
          <img src="E:/Learning path school/bot/UI/images/learning_path_logo.png" alt="cybrain Logo" class="cybrain-logo">
          <h2 class="oneline">
            <span>Learning Path School</span>
          </h2>
          <button class="material-icons exit-chat ripple tidio-1s5t5ku" id="minimize-button" type="button"
            aria-label="Minimize">
            <img src="./images/close.png">
          </button>
          <div class="offline-message">
            <span class="online">
              <span>🟢 We are online</span>
            </span>
            <div class="more">
              <input type="checkbox" id="button">
              <label for="button">
                <span>&#8942;</span>
              </label>
              <ul>
                <li class="header-menu-item">
                  <div id="restart-chat">
                    <i class="reload-icon" id="reload" title="Refresh Chat"></i>
                    <span class="header-menu-item-text-restart">Restart Chat</span>
                  </div>
                  <div id="mute-chat">
                    <i class="mute-icon" id="mute" title="Mute"></i>
                    <span class="header-menu-item-text">Unmute Notifications</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div id="conversation-group" role="log">


        </div>

              <div class="smat-footer bot-google-font">
          <span>Powered By </span>
          <span class="bot-google-font">    
            <a class="smat-branding-a" target="_blank" href="https://www.cybrain.co.in">
              <img src="./images/cybrainlogopdby2.png" style="height: 16px;">
            </a>
          </span>
        </div>
      </div>
    </div>
    <div id="chat-button" data-testid="widgetButton" class="chat-closed mobile-size__medium">
      <button type="button" id="button-body" data-testid="widgetButtonBody" class="chrome" tabindex="0"
        aria-label="Open chat widget">
        <i class="material-icons type1 for-closed active" style="color: rgb(255, 255, 255);">
          <svg id="ic_bubble" fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
            <path d="M0 0h24v24H0z" fill="none"></path>
          </svg>
        </i>
      </button>
    </div>
  </div>
`;
document.body.appendChild(chatWidgetContainer);

document.addEventListener('DOMContentLoaded', function () {
    const frameContent = document.querySelector('.frame-content');
    const chatButton = document.getElementById("chat-button");
    const chatContainer = document.getElementById("chatContainer");
    const minimizeButton = document.getElementById("minimize-button");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("conversation-group");
    const sendButton = document.getElementById("SentButton");
    const voiceButton = document.getElementById("MicButton");
    const restartChat = document.getElementById("restart-chat")
    const muteChat = document.getElementById("mute-chat")
    const checkbox = document.getElementById("button");
    const dropdown = document.getElementById("DropdownContent");
    const eng = document.getElementById("eng");
    const hi = document.getElementById("hi");
    var label = document.querySelector('.more');
    var charCount = document.getElementById("char-count");








    // PAGE RELOAD
    localStorage.clear();
    let sender_id = generateUUID();

    // GLOBAL VARIABLES
    let isListening = false;
    const webhook_url = "http://localhost:5006/webhooks/rest/webhook";
    // const webhook_url = "https://chatbot.cybraintech.com/webhooks/rest/webhook";
    const slotFill_url = `http://localhost:5005/conversations/${sender_id}/tracker/events`

    // clearConversation();

    let refresh = true;
    let unmute = false;
    let lang = "";
    var maxLength = 300;

    // OPEN CHATBOT FUNCTION
    function openChat() {
        if (chatContainer) {
            chatContainer.classList.toggle("open");
            chatButton.classList.toggle("clicked");
        }
    };

    //  CLOSE CHATBOT FUNCTION
    function closeChat() {
        if (chatContainer) {
            chatContainer.classList.remove("open");
            chatButton.classList.remove("clicked");
            stopTexttoSpeech()
        }
    };

    // CLICK OUTSIDE FUNCTION
    function isDescendant(parent, child) {
        let node = child.parentNode;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    // CHAT BUTTON
    chatButton.addEventListener("click", function () {
        openChat()
        if (refresh) {
            clearConversation()
        }
        refresh = false;
    });

    // MINIMIZE BUTTON
    minimizeButton.addEventListener("click", function () {
        closeChat()
    });

    // CLICKED OUTSIDE
    document.addEventListener('click', function (event) {
        if (!isDescendant(frameContent, event.target)) {
            closeChat()
        }
    });

    // DROPDOWN CLICKING OUTSIDE
    document.addEventListener('click', function (event) {
        var targetElement = event.target;
        if (targetElement !== label && !label.contains(targetElement)) {
            checkbox.checked = false;
        }
    });




    // GENERATE UUID
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // SEND BUTTON
    sendButton.addEventListener('click', function () {
        const message = chatInput.value.trim();
        if (message) {
            sendMessage(message);
        }
    });

    // ENTER TAG
    // chatInput.addEventListener('keydown', function (event) {
    //     if (event.keyCode === 13) {
    //         event.preventDefault();
    //         const message = chatInput.value.trim();
    //         if (message) {
    //             sendMessage(message);
    //         }
    //     }
    // }
    // )

    // chatInput.addEventListener("input", function () {
    //     var text = chatInput.value;
    //     var currentLength = text.length;
    //     charCount.textContent = currentLength + "/" + maxLength;
    //     if (currentLength > maxLength) {
    //         chatInput.value = text.substring(0, maxLength); // Truncate the input
    //         charCount.textContent = maxLength + "/" + maxLength;
    //     }
    // });

    // VOICE BUTTON
    // voiceButton.addEventListener('click', function () {
    //     startVoiceRecognition();
    // });


    // RESTART
    restartChat.addEventListener('click', function () {
        // dropdown.style.display = "none";
        // checkbox.checked = false;
        // drop = true;
        // unmute = true;
        checkbox.checked = false;
        clearConversation()
    }
    );

    // Add a click event listener to the mute button
    muteChat.addEventListener('click', function () {
        checkbox.checked = false;
        toggleMute()
    }
    );

    // // Toggle the dropdown when the button is clicked
    // voiceButton.addEventListener("click", function() {
    //   if (dropdown.style.display === "block") {
    //     dropdown.style.display = "none";
    //   } else {
    //     dropdown.style.display = "block";
    //   }
    // });


    // // ENG BUTTON
    // eng.addEventListener('click', function () {
    //     lang="en-US"
    //     startVoiceRecognition();
    // });

    // // HI BUTTON
    // hi.addEventListener('click', function () {
    //     lang="hi-IN"
    //     startVoiceRecognition();
    // });




    // SEND MESSAGE
    function sendMessage(payload, title) {
        removeButtons()
        removeDropdown();
        deleteForm();
        stopTexttoSpeech();
        // charCount.textContent = "0/300"
        // charCount.textContent = "0/300"

        const data = {
            sender: sender_id,
            message: payload,
        };
        [data].forEach(element => {
            addUserMessage(title ? title : element.message)
        });
        // chatInput.value = '';
        // chatInput.value = "";
        typing()
        fetch(webhook_url, { method: 'POST', body: JSON.stringify(data) })
            .then(response => response.json())
            .then(handleResponse)
            .catch(handleError);
        scrollToBottom();
    }

    // SEND MESSAGE
    async function slotFill(name, email, phone) {
        stopTexttoSpeech();
        // charCount.textContent = "0/300"
        // charCount.textContent = "0/300"

        const name_payload = {
            event: "slot",
            name: "name",
            value: name
        };
        const email_payload = {
            event: "slot",
            name: "email",
            value: email
        };
        const phone_payload = {
            event: "slot",
            name: "phone-number",
            value: phone
        };
        // chatInput.value = '';
        await fetch(slotFill_url, { method: 'POST', body: JSON.stringify(name_payload) }).catch(handleError);
        await fetch(slotFill_url, { method: 'POST', body: JSON.stringify(email_payload) }).catch(handleError);
        await fetch(slotFill_url, { method: 'POST', body: JSON.stringify(phone_payload) }).catch(handleError);
        await sendMessage("/submit", "submit")
        scrollToBottom();
    }


    // HANDLE RESPONSE
    async function handleResponse(responseData) {
        const onlineSpan = document.querySelector('.online');
        onlineSpan.textContent = '🟢 We are online';
        // removeButtons();
        

        const messages = responseData.map(msg => ({
            sender: msg.recipient_id,
            message: msg.text || null,
            buttons: msg.buttons || null,
            image: msg.image || null,
            attachment: msg.attachment || null,
        }));
        deleteTyping()

        function mainMessage(Messages) {
            imageMessage(Messages)
            // attachmentMessage(Messages)
        }

        function imageMessage(Messages) {
            Messages.map(async (element) => {
                if (element.image) {
                    addImageMessage(element.image);
                }
                await scrollToBottom();
            })
            setTimeout(() => attachmentMessage(Messages), 100)
            // setTimeout(() => buttonMessage(Messages), 100)
        }

        function attachmentMessage(Messages) {
            Messages.map(async (element) => {
                if (element.attachment) {
                    addSelectBox(element.attachment);
                    element.attachment.forEach((options) => {
                        speakText(options.title);
                    });
                }
                await scrollToBottom();
            });
            setTimeout(() => Message(Messages), 100)
        }

        function Message(Messages) {
            Messages.map(async (element) => {
                if (element.message) {
                    if (element.message == "connect") {
                        addForm();
                    }
                    else {
                        addNewMessage(element.message);
                        speakText(element.message);
                    }
                }
                await scrollToBottom();
            });
            setTimeout(() => buttonMessage(Messages), 100)
            // setTimeout(() => imageMessage(Messages), 100)
        }

        function buttonMessage(Messages) {
            Messages.map(async (element) => {
                if (element.buttons) {
                    addButtons(element.buttons);
                    element.buttons.forEach((options) => {
                        speakText(options.title);
                    });
                }
                await scrollToBottom();
            });
            // setTimeout(() => linkPhone(), 100)
        }
        mainMessage(messages)


        function linkPhone() {
            var copyText = document.getElementById("bot-phone-number");
            if (copyText) {
                copyText.addEventListener("click", function () {
                    navigator.clipboard.writeText(copyText.innerText).then(function () {
                        console.log("Phone number copied to clipboard: " + copyText.innerText);
                    }).catch(function (err) {
                        console.error("Failed to copy: ", err);
                    });
                });
            }
        }
    }

    // HANDLE ERROR
    function handleError(error) {
        const onlineSpan = document.querySelector('.online');
        onlineSpan.textContent = '🔴 We are offline at this moment !';
        deleteTyping()
        console.error('An error occurred:', error);
    }

    // CLEAR CONVERSATION
    function clearConversation() {
        stopTexttoSpeech()
        // charCount.textContent = "0/300"
        // chatInput.value = '';
        chatMessages.innerHTML = '';
        backBot();
    }

    // GO BACK TO INITIAL
    function backBot() {
        typing()

        const restart = {
            sender: sender_id,
            message: "/restart"
        }
        const data = {
            sender: sender_id,
            message: 'will do me a favour'
            // message: 'hi',
        };
        fetch(webhook_url, { method: 'POST', body: JSON.stringify(restart) })
            .catch(handleError);
        fetch(webhook_url, { method: 'POST', body: JSON.stringify(data) })
            .then(response => response.json())
            .then(handleResponse)
            .catch(handleError);
    }

    // VOICE RECOGNITION
    function startVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            stopTexttoSpeech()
            if (!isListening) {
                isListening = true;
                voiceButton.classList.add('listening');
                recognition = new webkitSpeechRecognition();
                // recognition.lang = lang;
                recognition.lang = 'en-US';
                recognition.onresult = function (event) {
                    const transcript = event.results[0][0].transcript;
                    sendMessage(transcript);
                };
                recognition.onend = function () {
                    isListening = false;
                    voiceButton.classList.remove('listening');
                };
                recognition.onerror = function (event) {
                    console.error('Speech recognition error:', event.error);
                    isListening = false;
                    voiceButton.classList.remove('listening');
                };
                recognition.start();
            } else {

                recognition.stop();
            }
        } else {
            console.error('Web Speech API is not supported in this browser.');
        }
    }

    // TEXT TO SPEECH
    async function speakText(text) {
        if (unmute) {
            const speechSynthesis = window.speechSynthesis;
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const textContent = doc.body.textContent;
            const speechUtterance = new SpeechSynthesisUtterance(textContent);
            speechUtterance.lang = 'en-IN';
            // Adjust speech parameters if needed
            // speechUtterance.volume = 1;
            speechUtterance.rate = 1;
            // speechUtterance.pitch = 2;
            speechSynthesis.speak(speechUtterance);
        }
    }

    // STOP TEXT TO SPEECH
    function stopTexttoSpeech() {
        const speechSynthesis = window.speechSynthesis;
        speechSynthesis.cancel();
    }
    // MUTE BUTTON FUNCTION
    function toggleMute() {
        const muteButton = document.getElementById("mute")
        stopTexttoSpeech()
        unmute = !unmute;

        if (unmute) {
            var spanElement = document.querySelector('.header-menu-item-text');
            spanElement.textContent = 'Mute Notifications'
            muteButton.style.background = 'url(./images/unmute.png)';
            muteButton.style.cursor = 'pointer';
            muteButton.style.width = '21px';
            muteButton.style.height = '21px';
            muteButton.style.backgroundSize = '21px';
            muteButton.style.backgroundRepeat = 'no-repeat';
            muteButton.style.backgroundPosition = '50%';
            muteButton.style.float = 'left';
        }

        else {
            var spanElement = document.querySelector('.header-menu-item-text');
            spanElement.textContent = 'Unmute Notifications'
            muteButton.style.background = 'url(./images/Mute.png)';
            muteButton.style.cursor = 'pointer';
            muteButton.style.width = '21px';
            muteButton.style.height = '21px';
            muteButton.style.backgroundSize = '21px';
            muteButton.style.backgroundRepeat = 'no-repeat';
            muteButton.style.backgroundPosition = '50%';
            muteButton.style.float = 'left';
        }
    }

    // SCROLL TO BOTTOM
    async function scrollToBottom() {
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth',
        });
    }

    // BOT RESPONSE HTML
    async function addNewMessage(text) {
        const newMessageDiv = document.createElement('div');
        newMessageDiv.id = 'messages';
        newMessageDiv.setAttribute('aria-live', 'polite');
        newMessageDiv.setAttribute('aria-atomic', 'false');
        newMessageDiv.setAttribute('data-testid', 'messagesLog');
        const questionIconDiv = document.createElement('div');
        questionIconDiv.classList.add('question-icon-div');
        const img = document.createElement('img');
        // img.src = './images/cybrain_profile-pic.png';
        img.src = 'E:/Learning path school/bot/UI/images/learning_path_logo.png';
        img.classList.add('question-icon-smatest');
        questionIconDiv.appendChild(img);
        const messageDiv = document.createElement('div');
        messageDiv.style.opacity = 0;
        messageDiv.classList.add('message', 'message-operator');
        const messageContentSpan = document.createElement('span');
        messageContentSpan.classList.add('message-content');
        messageContentSpan.innerHTML = text;
        messageDiv.appendChild(messageContentSpan);
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.classList.add('message', 'message-operator', 'bots-quick-replies');
        const buttonWrapperDiv = document.createElement('div');
        buttonWrapperDiv.classList.add('button-wrapper');
        quickRepliesDiv.appendChild(buttonWrapperDiv);
        newMessageDiv.appendChild(questionIconDiv);
        newMessageDiv.appendChild(messageDiv);
        newMessageDiv.appendChild(quickRepliesDiv);
        chatMessages.appendChild(newMessageDiv);
        setTimeout(() => {
            messageDiv.style.opacity = 1;
        }, 10);
    }

    // TYPING
    function typing() {
        const newMessageDiv = document.createElement('div');
        newMessageDiv.id = 'messages';
        newMessageDiv.setAttribute('aria-live', 'polite');
        newMessageDiv.setAttribute('aria-atomic', 'false');
        newMessageDiv.setAttribute('data-testid', 'messagesLog');
        newMessageDiv.setAttribute('data-message-id', 'typing');
        const questionIconDiv = document.createElement('div');
        questionIconDiv.classList.add('question-icon-div');
        const img = document.createElement('img');
        // img.src = './images/cybrain_profile-pic.png';
        img.src = 'E:/Learning path school/bot/UI/images/learning_path_logo.png';
        img.classList.add('question-icon-smatest');
        questionIconDiv.appendChild(img);
        const messageDiv = document.createElement('div');
        messageDiv.style.opacity = 0;
        messageDiv.classList.add('message', 'message-operator');
        const messageContentSpan = document.createElement('span');
        messageContentSpan.classList.add('typing-content');
        messageContentSpan.textContent = "Typing";
        messageDiv.appendChild(messageContentSpan);
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.classList.add('message', 'message-operator', 'bots-quick-replies');
        const buttonWrapperDiv = document.createElement('div');
        buttonWrapperDiv.classList.add('button-wrapper');
        quickRepliesDiv.appendChild(buttonWrapperDiv);
        newMessageDiv.appendChild(questionIconDiv);
        newMessageDiv.appendChild(messageDiv);
        newMessageDiv.appendChild(quickRepliesDiv);
        chatMessages.appendChild(newMessageDiv);
        setTimeout(() => {
            messageDiv.style.opacity = 1;
        }, 10);
    }

    // DELETE TYPING HTML
    function deleteTyping() {
        const messageToRemove = document.querySelector(`[data-message-id="typing"]`);
        if (messageToRemove) {
            messageToRemove.remove();
        }
    }

    // BOT RESPONSE IMAGE HTML
    async function addImageMessage(imageSrc) {
        const newMessageDiv = document.createElement('div');
        newMessageDiv.id = 'messages';  // Set the id attribute
        newMessageDiv.setAttribute('aria-live', 'polite');
        newMessageDiv.setAttribute('aria-atomic', 'false');
        newMessageDiv.setAttribute('data-testid', 'messagesLog');
        const questionIconDiv = document.createElement('div');
        questionIconDiv.classList.add('question-icon-div');
        const img = document.createElement('img');
        // img.src = './images/cybrain_profile-pic.png';
        img.src = 'E:/Learning path school/bot/UI/images/learning_path_logo.png';
        img.classList.add('question-icon-smatest');
        questionIconDiv.appendChild(img);
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'message-operator');
        const imageSpan = document.createElement('span');
        imageSpan.id = 'image-for-bot'
        imageSpan.classList.add('image-bot');
        const image = document.createElement('img');
        image.src = imageSrc;
        imageSpan.appendChild(image);
        messageDiv.appendChild(imageSpan);
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.classList.add('message', 'message-operator', 'bots-quick-replies');
        const buttonWrapperDiv = document.createElement('div');
        buttonWrapperDiv.classList.add('button-wrapper');
        quickRepliesDiv.appendChild(buttonWrapperDiv);
        newMessageDiv.appendChild(questionIconDiv);
        newMessageDiv.appendChild(messageDiv);
        newMessageDiv.appendChild(quickRepliesDiv);
        chatMessages.appendChild(newMessageDiv);
    }

    // BOT RESPONSE BUTTONS HTML
    async function addButtons(buttArray) {
        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('main-options-div-smatest', 'some-animation');
        buttArray.forEach((option) => {
            const label = document.createElement('label');
            if (option.title == "Main Menu" || option.title == "Go back") {
                label.id = 'back'
            }
            label.classList.add('options-smatest', 'w-auto-i', 'm-r-6', 'pull-left', 'm-b-6', 'mx-1');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'radio_option';
            input.value = option.title;
            input.classList.add('radio-botest');
            // const checkDiv = document.createElement('div');
            // checkDiv.classList.add('check-smatest');
            const span = document.createElement('span');
            span.classList.add('w-auto-i');
            span.textContent = option.title;
            label.appendChild(input);
            // label.appendChild(checkDiv);
            label.appendChild(span);
            optionsDiv.appendChild(label);
            input.addEventListener('click', function () {
                sendMessage(option.payload, option.title);
            });
        });
        chatMessages.appendChild(optionsDiv);
    }

    // REMOVE BUTTONS
    function removeButtons() {
        const optionsDiv = document.querySelector('.main-options-div-smatest');
        if (optionsDiv) {
            optionsDiv.parentNode.removeChild(optionsDiv);
            event.stopPropagation();
        }
    }

    // DROP DOWN
    async function addSelectBox(data) {
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('container', 'chatbot-dropdown');
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        const form = document.createElement('form');
        form.classList.add('example');
        const label = document.createElement('label');
        label.classList.add('select-box');
        const select = document.createElement('select');
        data.forEach((dropdown) => {
            const option = document.createElement('option');
            option.textContent = dropdown.title;
            option.value = dropdown.payload;
            select.appendChild(option);
        });
        label.appendChild(select);
        form.appendChild(label);
        rowDiv.appendChild(form);
        containerDiv.appendChild(rowDiv);
        chatMessages.appendChild(containerDiv);
        select.addEventListener('change', function () {
            const selectedOption = select.options[select.selectedIndex];
            const payload = selectedOption.value;
            const title = selectedOption.textContent;
            if (payload == "connect") {
                sendMessage(payload, title);
            }
            // console.log(payload)
        });
    }

    // REMOVE DROPDOWN
    function removeDropdown() {
        const containerDiv = document.querySelector('.chatbot-dropdown');
        if (containerDiv) {
            containerDiv.parentNode.removeChild(containerDiv);
            event.stopPropagation();
        }
    }

    // USER MESSAGE HTML
    function addUserMessage(text) {
        const userMessageDiv = document.createElement('div');
        userMessageDiv.id = 'messages';
        userMessageDiv.setAttribute('aria-live', 'polite');
        userMessageDiv.setAttribute('aria-atomic', 'false');
        userMessageDiv.setAttribute('data-testid', 'messagesLog');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('user-message', 'message-operator');
        const messageContentSpan = document.createElement('span');
        messageContentSpan.classList.add('message-content');
        messageContentSpan.textContent = text;
        messageDiv.appendChild(messageContentSpan);
        userMessageDiv.appendChild(messageDiv);
        chatMessages.appendChild(userMessageDiv);
    }


    async function addForm() {
        // chatInput.disabled = true;
        const newMessageDiv = document.createElement('div');
        newMessageDiv.id = 'messages';
        newMessageDiv.classList.add('custom-form');
        const questionIconDiv = document.createElement('div');
        questionIconDiv.classList.add('question-icon-div');
        const img = document.createElement('img');
        // img.src = './images/cybrain_profile-pic.png';
        img.src = 'E:/Learning path school/bot/UI/images/learning_path_logo.png';
        img.classList.add('question-icon-smatest');
        questionIconDiv.appendChild(img);
        const form = document.createElement('form');
        form.id = 'bot-form';
        const nameLabel = document.createElement('label');
        nameLabel.setAttribute('for', 'name');
        nameLabel.textContent = 'Name:';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'name-bot';
        const nameErrorDiv = document.createElement('div');
        nameErrorDiv.id = 'name-error';
        nameErrorDiv.classList.add('error-message');
        const emailLabel = document.createElement('label');
        emailLabel.setAttribute('for', 'email');
        emailLabel.textContent = 'Email:';
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.id = 'email-bot';
        const emailErrorDiv = document.createElement('div');
        emailErrorDiv.id = 'email-error';
        emailErrorDiv.classList.add('error-message');
        const phoneLabel = document.createElement('label');
        phoneLabel.setAttribute('for', 'phone');
        phoneLabel.textContent = 'Phone Number:';
        const phoneInput = document.createElement('input');
        phoneInput.type = 'text';
        phoneInput.id = 'phone-bot';
        const phoneErrorDiv = document.createElement('div');
        phoneErrorDiv.id = 'phone-error';
        phoneErrorDiv.classList.add('error-message');
        const submitButton = document.createElement('input');
        submitButton.type = 'submit';
        submitButton.value = 'Submit';
        form.appendChild(nameLabel);
        form.appendChild(nameInput);
        form.appendChild(nameErrorDiv);
        form.appendChild(emailLabel);
        form.appendChild(emailInput);
        form.appendChild(emailErrorDiv);
        form.appendChild(phoneLabel);
        form.appendChild(phoneInput);
        form.appendChild(phoneErrorDiv);
        form.appendChild(submitButton);
        form.addEventListener("submit", function (event) {
            if (validateForm()) {
                event.preventDefault();
                var name = document.getElementById("name-bot").value;
                var email = document.getElementById("email-bot").value;
                var phone = document.getElementById("phone-bot").value;

                document.getElementById("name-bot").value = "";
                document.getElementById("email-bot").value = "";
                document.getElementById("phone-bot").value = "";
                slotFill(name, email, phone)
                // chatInput.disabled = false;
                // console.log(name,email,phone);
            }
            if (!validateForm()) {
                event.preventDefault();
            }

        });
        nameInput.addEventListener("input", function () {
            validateName();
        });
        emailInput.addEventListener("input", function () {
            validateEmail();
        });
        phoneInput.addEventListener("input", function () {
            validatePhone();
        });
        newMessageDiv.appendChild(questionIconDiv);
        newMessageDiv.appendChild(form);
        chatMessages.appendChild(newMessageDiv);
    }

    function validateForm() {
        n = validateName()
        e = validateEmail()
        p = validatePhone();
        if (n & e & p) {
            return true
        }
        else {
            return false
        }
    }

    function deleteForm() {
        var formElement = document.getElementById('bot-form');
        if (formElement) {
            var parentElement = formElement.parentNode;
            parentElement.removeChild(formElement);
            event.stopPropagation();
        }
    }


    function validateName() {
        var nameInput = document.getElementById("name-bot");
        var name = nameInput.value;
        var nameError = document.getElementById("name-error");
        var nameRegex = /^[A-Z][a-z]+ [A-Z][a-z]+$/;

        if (name === "") {
            nameError.innerHTML = "Name must be filled out";
            return false;
        } else if (!nameRegex.test(name)) {
            nameError.innerHTML = "Invalid Full Name";
            return false;
        } else {
            nameError.innerHTML = "";
            return true;
        }
    }

    function validateEmail() {
        var emailInput = document.getElementById("email-bot");
        var email = emailInput.value;
        var emailError = document.getElementById("email-error");
        var emailRegex = /^[-!#-'*+\/-9=?^-~]+(?:\.[-!#-'*+\/-9=?^-~]+)*@[-!#-'*+\/-9=?^-~]+(?:\.[-!#-'*+\/-9=?^-~]+)+$/;

        if (email === "") {
            emailError.innerHTML = "Email must be filled out";
            return false;
        } else if (!emailRegex.test(email)) {
            emailError.innerHTML = "Invalid email address";
            return false;
        } else {
            emailError.innerHTML = "";
            return true;
        }
    }

    function validatePhone() {
        var phoneInput = document.getElementById("phone-bot");
        var phone = phoneInput.value;
        var phoneError = document.getElementById("phone-error");
        var phoneRegex = /^[6789]\d{9}$/;
        if (phone === "") {
            phoneError.innerHTML = "Phone Number must be filled out";
            return false;
        } else if (!phoneRegex.test(phone)) {
            phoneError.innerHTML = "Invalid Phone Number";
            return false;
        } else {
            phoneError.innerHTML = "";
            return true;
        }
    }



    // let copyText = document.getElementById("bot-phone-number");
    // if (copyText) {
    //     copyText.addEventListener("click", function () {
    //         // copyText.select();
    //         // copyText.setSelectionRange(0, 99999);
    //         // navigator.clipboard.writeText(copyText.value);
    //         // alert("Copied the text: " + copyText.value);
    //         console.log("test")
    //     })
    // }
});


// Close the dropdown when the user clicks outside of it
// window.addEventListener("click", function(event) {
//   if (event.target !== button && event.target !== Dropdown) {
//     Dropdown.style.display = "none";
//   }
// });
