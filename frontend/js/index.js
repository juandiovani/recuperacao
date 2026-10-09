const API_BASE_URL = 'http://localhost:3000';


const authSection = document.getElementById('auth-section');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authError = document.getElementById('auth-error');


const userInfo = document.getElementById('user-info');
const userEmailSpan = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');


const tasksSection = document.getElementById('tasks-section');
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-description');
const tasksList = document.getElementById('tasks-list');
const emptyListMsg = document.getElementById('empty-list-msg');
const loadingDiv = document.getElementById('loading');



function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}



function checkAuthStatus() {
  const token = getToken();
  if (token) {
    const decoded = parseJwt(token);
    userEmailSpan.textContent = decoded?.email || decoded?.sub || 'Usuário Logado';
    
    authSection.classList.add('hidden');
    userInfo.classList.remove('hidden');
    tasksSection.classList.remove('hidden');
    
    fetchTasks();
  } else {
    authSection.classList.remove('hidden');
    userInfo.classList.add('hidden');
    tasksSection.classList.add('hidden');
  }
}

function showError(message) {
  authError.textContent = message;
  authError.classList.remove('hidden');
}

function clearError() {
  authError.textContent = '';
  authError.classList.add('hidden');
}

tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  clearError();
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  clearError();
});


registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao realizar cadastro.');
    }

    alert('Cadastro realizado com sucesso! Faça login.');
    tabLogin.click();
    registerForm.reset();
  } catch (err) {
    showError(err.message);
  }
});


loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Credenciais inválidas.');
    }

    const token = data.token || data.accessToken;
    if (token) {
      setToken(token);
      loginForm.reset();
      checkAuthStatus();
    } else {
      throw new Error('Token não retornado pela API.');
    }
  } catch (err) {
    showError(err.message);
  }
});


logoutBtn.addEventListener('click', () => {
  removeToken();
  checkAuthStatus();
});


async function fetchTasks() {
  loadingDiv.classList.remove('hidden');
  tasksList.innerHTML = '';
  emptyListMsg.classList.add('hidden');

  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (response.status === 401) {
      removeToken();
      checkAuthStatus();
      return;
    }

    const tasks = await response.json();
    loadingDiv.classList.add('hidden');

    if (!Array.isArray(tasks) || tasks.length === 0) {
      emptyListMsg.classList.remove('hidden');
      return;
    }

    renderTasks(tasks);
  } catch (err) {
    loadingDiv.classList.add('hidden');
    console.error('Erro ao buscar tarefas:', err);
  }
}

function renderTasks(tasks) {
  tasksList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';

    li.innerHTML = `
      <div class="task-info">
        <h3>${escapeHtml(task.title)}</h3>
        ${task.description ? `<p>\${escapeHtml(task.description)}</p>` : ''}
      </div>
      <button class="btn-danger" onclick="deleteTask('${task.id}')">Excluir</button>
    `;

    tasksList.appendChild(li);
  });
}


taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = taskTitleInput.value.trim();
  const description = taskDescInput.value.trim();

  if (!title) return;

  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ title, description })
    });

    if (response.status === 401) {
      removeToken();
      checkAuthStatus();
      return;
    }

    if (!response.ok) {
      throw new Error('Falha ao criar tarefa.');
    }

    taskForm.reset();
    fetchTasks();
  } catch (err) {
    alert(err.message);
  }
});


async function deleteTask(id) {
  if (!confirm('Deseja realmente excluir esta tarefa?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (response.status === 401) {
      removeToken();
      checkAuthStatus();
      return;
    }

    if (!response.ok) {
      throw new Error('Erro ao excluir tarefa.');
    }

    fetchTasks();
  } catch (err) {
    alert(err.message);
  }
}


function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', checkAuthStatus);