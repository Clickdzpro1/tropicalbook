// Configuration
const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');

// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Parallax
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initParallax();
    initEventListeners();
    initScrollEffects();
    setMinDates();
});

// Animations
function initAnimations() {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Animate feature cards on scroll
    gsap.utils.toArray('[data-animate]').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Section headers animation
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%'
            },
            opacity: 0,
            y: 30,
            duration: 1
        });
    });
}

// Parallax Effect
function initParallax() {
    const heroParallax = document.getElementById('heroParallax');
    if (heroParallax && window.Parallax) {
        new Parallax(heroParallax, {
            relativeInput: true,
            hoverOnly: false
        });
    }
}

// Event Listeners
function initEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Auth buttons
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('signupBtn').addEventListener('click', showSignupModal);

    // Booking buttons
    document.getElementById('bookNowBtn').addEventListener('click', scrollToBooking);
    document.getElementById('ctaBookBtn').addEventListener('click', scrollToBooking);
    document.getElementById('learnMoreBtn').addEventListener('click', () => {
        document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
    });

    // Booking form
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSearch);

    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

// Scroll Effects
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Set minimum dates for booking form
function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').min = today;
    document.getElementById('checkOut').min = today;

    // Update checkout min date when checkin changes
    document.getElementById('checkIn').addEventListener('change', (e) => {
        document.getElementById('checkOut').min = e.target.value;
    });
}

// Booking Functions
function scrollToBooking() {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

async function handleBookingSearch(e) {
    e.preventDefault();
    
    const airport = document.getElementById('airport').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    if (!airport || !checkIn || !checkOut) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/locations/search?airport=${airport}&checkIn=${checkIn}&checkOut=${checkOut}`);
        const data = await response.json();

        if (data.success) {
            displaySearchResults(data.locations, checkIn, checkOut);
        } else {
            showNotification('No locations found', 'error');
        }
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Search failed. Please try again.', 'error');
    }
}

function displaySearchResults(locations, checkIn, checkOut) {
    // Create results section
    let resultsSection = document.getElementById('searchResults');
    if (!resultsSection) {
        resultsSection = document.createElement('section');
        resultsSection.id = 'searchResults';
        resultsSection.className = 'search-results';
        document.getElementById('booking').after(resultsSection);
    }

    resultsSection.innerHTML = `
        <div class="container">
            <h2>Available Locations</h2>
            <div class="results-grid">
                ${locations.map(location => `
                    <div class="location-card">
                        <h3>${location.name}</h3>
                        <p><strong>${location.airport.name} (${location.airport.code})</strong></p>
                        <p>Daily Rate: $${location.pricing.daily}</p>
                        <p>Available Spots: ${location.capacity.available}</p>
                        <div class="location-features">
                            ${location.features.map(f => `<span class="badge">${f}</span>`).join('')}
                        </div>
                        <button class="btn btn-primary" onclick="bookLocation('${location._id}', '${checkIn}', '${checkOut}', ${location.pricing.daily})">Book Now</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

window.bookLocation = async function(locationId, checkIn, checkOut, dailyRate) {
    if (!authToken) {
        showLoginModal();
        showNotification('Please login to book', 'info');
        return;
    }

    const vehicle = prompt('Enter your vehicle license plate:');
    if (!vehicle) return;

    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                locationId,
                checkIn,
                checkOut,
                dailyRate,
                vehicle: { licensePlate: vehicle }
            })
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Booking created successfully!', 'success');
            // Redirect to payment or confirmation
        } else {
            showNotification(data.message || 'Booking failed', 'error');
        }
    } catch (error) {
        console.error('Booking error:', error);
        showNotification('Booking failed. Please try again.', 'error');
    }
};

// Authentication Functions
function showLoginModal() {
    const modal = document.getElementById('authModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2>Login</h2>
        <form id="loginForm">
            <div class="form-group">
                <label for="loginEmail">Email</label>
                <input type="email" id="loginEmail" required>
            </div>
            <div class="form-group">
                <label for="loginPassword">Password</label>
                <input type="password" id="loginPassword" required>
            </div>
            <button type="submit" class="btn btn-primary btn-large">Login</button>
            <p style="margin-top: 1rem;">Don't have an account? <a href="#" onclick="showSignupModal()">Sign up</a></p>
        </form>
    `;

    modal.style.display = 'block';

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function showSignupModal() {
    const modal = document.getElementById('authModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2>Sign Up</h2>
        <form id="signupForm">
            <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" required>
            </div>
            <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" required>
            </div>
            <div class="form-group">
                <label for="signupEmail">Email</label>
                <input type="email" id="signupEmail" required>
            </div>
            <div class="form-group">
                <label for="signupPassword">Password</label>
                <input type="password" id="signupPassword" required minlength="6">
            </div>
            <div class="form-group">
                <label for="phone">Phone (optional)</label>
                <input type="tel" id="phone">
            </div>
            <button type="submit" class="btn btn-primary btn-large">Sign Up</button>
            <p style="margin-top: 1rem;">Already have an account? <a href="#" onclick="showLoginModal()">Login</a></p>
        </form>
    `;

    modal.style.display = 'block';

    document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            closeModal();
            showNotification('Login successful!', 'success');
            updateUIForAuth(data.user);
        } else {
            showNotification(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('signupEmail').value,
        password: document.getElementById('signupPassword').value,
        phone: document.getElementById('phone').value
    };

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            closeModal();
            showNotification('Account created successfully!', 'success');
            updateUIForAuth(data.user);
        } else {
            showNotification(data.message || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Signup failed. Please try again.', 'error');
    }
}

function updateUIForAuth(user) {
    const navActions = document.querySelector('.nav-actions');
    navActions.innerHTML = `
        <span>Welcome, ${user.firstName}!</span>
        <button class="btn btn-outline" onclick="logout()">Logout</button>
    `;
}

window.logout = function() {
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    const navActions = document.querySelector('.nav-actions');
    navActions.innerHTML = `
        <button class="btn btn-outline" id="loginBtn">Login</button>
        <button class="btn btn-primary" id="signupBtn">Sign Up</button>
    `;
    
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('signupBtn').addEventListener('click', showSignupModal);
    
    showNotification('Logged out successfully', 'info');
};

// Modal Functions
function closeModal() {
    document.getElementById('authModal').style.display = 'none';
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#00bfa5' : type === 'error' ? '#ff6b6b' : '#3498db'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Check if user is already logged in
if (authToken) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        updateUIForAuth(user);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .search-results {
        padding: 4rem 0;
        background: white;
    }
    
    .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .location-card {
        padding: 2rem;
        background: #f8f9fa;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .location-card h3 {
        color: #00bfa5;
        margin-bottom: 1rem;
    }
    
    .location-features {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin: 1rem 0;
    }
    
    .badge {
        padding: 0.25rem 0.75rem;
        background: #00bfa5;
        color: white;
        border-radius: 20px;
        font-size: 0.85rem;
    }
`;
document.head.appendChild(style);