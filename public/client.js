// public/client.js
let currentUser = '';
let activeRecipient = null;
const socket = io();

async function registerAccount() {
    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('password-input').value.trim();

    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        alert('Account created successfully! Now click Login.');
    } catch (err) {
        alert(err.message);
    }
}

async function login() {
    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('password-input').value.trim();

    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        currentUser = username;
        socket.emit('register', currentUser);

        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('messenger-container').style.display = 'flex';
        document.getElementById('current-username').innerText = currentUser;
    } catch (err) {
        alert(err.message);
    }
}

function logout() {
    location.reload();
}

socket.on('updateUserList', (users) => {
    const userListDiv = document.getElementById('user-list');
    userListDiv.innerHTML = '';
    users.forEach(user => {
        if (user !== currentUser) {
            const userElement = document.createElement('div');
            userElement.className = 'user-item';
            userElement.innerText = user;
            userElement.style.padding = '12px 15px';
            userElement.style.cursor = 'pointer';
            userElement.style.borderBottom = '1px solid #eee';
            userElement.onclick = () => selectUser(user);
            userListDiv.appendChild(userElement);
        }
    });
});

function selectUser(user) {
    activeRecipient = user;
    document.getElementById('current-chat-title').innerText = `Chat with ${user}`;
    document.getElementById('chat-input-area').style.display = 'flex';
    document.getElementById('chat-messages').innerHTML = '';
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (!message || !activeRecipient) return;

    socket.emit('privateMessage', {
        sender: currentUser,
        recipient: activeRecipient,
        message: message
    });

    messageInput.value = '';
}

async function sendImage(event) {
    const file = event.target.files[0];
    if (!file || !activeRecipient) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('sender', currentUser);
    formData.append('recipient', activeRecipient);

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
    } catch (err) {
        alert(err.message);
    }
    event.target.value = '';
}

socket.on('privateMessage', (data) => {
    if (data.sender === activeRecipient || data.recipient === activeRecipient) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.style.margin = '10px 0';
        messageDiv.style.textAlign = data.sender === currentUser ? 'right' : 'left';
        
        messageDiv.innerHTML = `
            <div style="display: inline-block; padding: 10px 15px; border-radius: 10px; background: ${data.sender === currentUser ? '#dcf8c6' : '#fff'}; text-align: left; max-width: 70%; word-break: break-word; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                <div>${data.message}</div>
                <div style="font-size: 10px; color: #888; text-align: right; margin-top: 4px;">${data.timestamp}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});