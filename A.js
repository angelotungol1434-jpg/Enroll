// DOM Elements
const signupModal = document.getElementById('signupModal');
const loginModal = document.getElementById('loginModal');
const dashboard = document.getElementById('dashboard');
const profileSidebar = document.getElementById('profileSidebar');
const profileOverlay = document.getElementById('profileOverlay');

// Navigation buttons
const showLoginBtn = document.getElementById('showLoginBtn');
const showSignupBtn = document.getElementById('showSignupBtn');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

// Dashboard navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.dashboard-section');

// Profile elements
const profileBtn = document.getElementById('profileBtn');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const profilePicInput = document.getElementById('profilePicInput');
const profileImage = document.getElementById('profileImage');
const sidebarProfileImage = document.getElementById('sidebarProfileImage');
const editNameBtn = document.getElementById('editNameBtn');
const profileNameDisplay = document.getElementById('profileNameDisplay');
const profileNameInput = document.getElementById('profileNameInput');
const saveNameBtn = document.getElementById('saveNameBtn');
const cancelNameBtn = document.getElementById('cancelNameBtn');
const nameEditContainer = document.getElementById('nameEditContainer');
const userDisplayName = document.getElementById('userDisplayName');

// Calculator elements
const calcDisplay = document.getElementById('calcDisplay');
const calcButtons = document.querySelectorAll('.calc-btn');

// User data storage
let users = [];
let currentUser = null;
let calcExpression = '';

// Modal switching
showLoginBtn.addEventListener('click', () => {
  signupModal.classList.remove('active');
  setTimeout(() => {
    loginModal.classList.add('active');
  }, 300);
});

showSignupBtn.addEventListener('click', () => {
  loginModal.classList.remove('active');
  setTimeout(() => {
    signupModal.classList.add('active');
  }, 300);
});

// Signup form submission
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(signupForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');
  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    alert('Email already registered!');
    return;
  }
  
  // Register user
  users.push({ email, password, name });
  alert('Account created successfully! Please login.');
  
  // Switch to login modal
  signupModal.classList.remove('active');
  setTimeout(() => {
    loginModal.classList.add('active');
  }, 300);
  
  signupForm.reset();
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const email = formData.get('email');
  const password = formData.get('password');
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = {
      email: user.email,
      name: user.name,
      profilePic: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop'
    };
    
    // Update UI with user info
    userDisplayName.textContent = currentUser.name;
    profileNameDisplay.textContent = currentUser.name;
    profileNameInput.value = currentUser.name;
    
    loginModal.classList.remove('active');
    setTimeout(() => {
      dashboard.classList.add('active');
      animateDashboardElements();
    }, 300);
  } else {
    alert('Invalid credentials!');
  }
});

// Dashboard navigation
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    const target = this.getAttribute('data-section');
    
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    
    sections.forEach(section => {
      section.classList.remove('active');
      if (section.id === target) {
        section.classList.add('active');
        animateSection(section);
      }
    });
  });
});

// Profile sidebar toggle
profileBtn.addEventListener('click', () => {
  profileSidebar.classList.add('active');
  profileOverlay.classList.add('active');
});

closeProfileBtn.addEventListener('click', closeProfile);
profileOverlay.addEventListener('click', closeProfile);

function closeProfile() {
  profileSidebar.classList.remove('active');
  profileOverlay.classList.remove('active');
}

// Profile picture change
sidebarProfileImage.addEventListener('click', () => {
  profilePicInput.click();
});

profilePicInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.src = e.target.result;
      sidebarProfileImage.src = e.target.result;
      if (currentUser) currentUser.profilePic = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Edit name functionality
editNameBtn.addEventListener('click', () => {
  profileNameDisplay.style.display = 'none';
  editNameBtn.style.display = 'none';
  nameEditContainer.style.display = 'flex';
});

saveNameBtn.addEventListener('click', () => {
  const newName = profileNameInput.value.trim();
  if (newName && currentUser) {
    currentUser.name = newName;
    profileNameDisplay.textContent = newName;
    profileNameDisplay.style.display = 'block';
    userDisplayName.textContent = newName;
    editNameBtn.style.display = 'block';
    nameEditContainer.style.display = 'none';
  }
});

cancelNameBtn.addEventListener('click', () => {
  if (currentUser) profileNameInput.value = currentUser.name;
  profileNameDisplay.style.display = 'block';
  editNameBtn.style.display = 'block';
  nameEditContainer.style.display = 'none';
});

// Calculator functionality
calcButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const value = this.getAttribute('data-value');
    
    if (value === 'C') {
      calcExpression = '';
      calcDisplay.value = '0';
    } else if (value === 'CE') {
      calcExpression = calcExpression.slice(0, -1);
      calcDisplay.value = calcExpression || '0';
    } else if (value === '=') {
      try {
        const result = eval(calcExpression.replace(/×/g, '*').replace(/÷/g, '/'));
        calcDisplay.value = result;
        calcExpression = result.toString();
      } catch (error) {
        calcDisplay.value = 'Error';
        calcExpression = '';
      }
    } else if (value === '±') {
      if (calcExpression && calcExpression !== '0') {
        if (calcExpression.startsWith('-')) {
          calcExpression = calcExpression.slice(1);
        } else {
          calcExpression = '-' + calcExpression;
        }
        calcDisplay.value = calcExpression;
      }
    } else if (value === '%') {
      try {
        const result = eval(calcExpression) / 100;
        calcDisplay.value = result;
        calcExpression = result.toString();
      } catch (error) {
        calcDisplay.value = 'Error';
      }
    } else {
      calcExpression += value;
      calcDisplay.value = calcExpression;
    }
    
    // Button press animation
    this.classList.add('pressed');
    setTimeout(() => {
      this.classList.remove('pressed');
    }, 100);
  });
});

// Enrollment form submission
const enrollmentForm = document.getElementById('enrollmentForm');
enrollmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Enrollment submitted successfully! We will contact you soon.');
  enrollmentForm.reset();
});

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
  currentUser = null;
  dashboard.classList.remove('active');
  closeProfile();
  setTimeout(() => {
    loginModal.classList.add('active');
  }, 300);
});

// Animation functions
function animateDashboardElements() {
  const elements = document.querySelectorAll('.animate-in');
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, index * 100);
  });
}

function animateSection(section) {
  const elements = section.querySelectorAll('.animate-item');
  elements.forEach((el, index) => {
    el.classList.remove('visible');
    setTimeout(() => {
      el.classList.add('visible');
    }, index * 100);
  });
}
