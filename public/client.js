socket.on('updateUserList', (users) => {
    const userListDiv = document.getElementById('user-list');
    userListDiv.innerHTML = '';
    users.forEach(user => {
        if (user !== currentUser) {
            const userElement = document.createElement('div');
            userElement.className = 'user-item';
            userElement.innerHTML = `
                <span>${user}</span>
                <span class="status-dot" title="Active"></span>
            `;
            userElement.onclick = () => selectUser(user);
            userListDiv.appendChild(userElement);
        }
    });
});