// Utility functions
const utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    isMobile() {
        return window.innerWidth <= 768;
    },

    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },

    isDesktop() {
        return window.innerWidth > 1024;
    },

    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

// Initialize AOS with responsive settings
function initAOS() {
    AOS.init({
        duration: utils.isMobile() ? 600 : 1000,
        once: true,
        offset: utils.isMobile() ? 50 : 100,
        delay: utils.isMobile() ? 0 : 100,
        easing: 'ease-out-cubic'
    });
}

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Scroll effect
    const handleScroll = utils.debounce(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }, 10);

    window.addEventListener('scroll', handleScroll);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (utils.isMobile() &&
            !navbar.contains(e.target) &&
            navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });

    // Close mobile menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (utils.isMobile() && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const offset = utils.isMobile() ? 100 : 80;
        if (rect.top <= offset && rect.bottom >= offset) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = utils.isMobile() ? 70 : 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const duration = utils.isMobile() ? 1500 : 2000;

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += step;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// Intersection Observer for animations
function initIntersectionObserver() {
    const aboutSection = document.querySelector('#about');
    const skillsSection = document.querySelector('#skills');

    const observerOptions = {
        threshold: utils.isMobile() ? 0.2 : 0.5,
        rootMargin: utils.isMobile() ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    };

    // About section observer for counter animation
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }

    // Skills section observer for skill animation
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    }, { threshold: 0.3 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

// Skill animations
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    const delay = utils.isMobile() ? 50 : 100;

    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
            setTimeout(() => {
                item.classList.remove('animate');
            }, 600);
        }, index * delay);
    });
}

// Project data and management
// let projects = [{
//         id: 1,
//         title: "EduSync (CLG ERP)",
//         description: "A full-featured College ERP platform built with Python and Django. Features include user authentication (OTP Verification), Attendance management, and an admin dashboard.",
//         image: "{% static 'images/erp.png' %}",
//         technologies: ["Python", "Django", "JavaScript", "PostgreSQL", "HTML", "CSS"],
//         github: "https://github.com/Anujpandey12345/my_college_erp",
//         live: "https://myerp-8shi.onrender.com"
//     },
//     {
//         id: 2,
//         title: "Authentication",
//         description: "Built a powerful authentication system using Django authentication which provides top-level security.",
//         image: "{% static 'images/auth.png' %}",
//         technologies: ["Python", "Django", "SQLite"],
//         github: "https://github.com/Anujpandey12345/Authentication_site",
//         live: ""
//     },
//     // {
//     //     id: 3,
//     //     title: "Real-time Chat Application",
//     //     description: "Multi-room chat application with real-time messaging, file sharing, and user presence indicators built with Flask and Socket.IO.",
//     //     image: "https://via.placeholder.com/400x250/06b6d4/ffffff?text=Chat+Application",
//     //     technologies: ["Flask", "JavaScript", "Redis", "Socket.IO"],
//     //     github: "https://github.com/yourusername/chat-app",
//     //     live: "https://your-chat-app.com"
//     // }
// ];

// Render projects with responsive layout
function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = '';

    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        container.appendChild(projectCard);
    });

    // Re-initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Create responsive project card
function createProjectCard(project, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 col-sm-12 mb-4';
    col.setAttribute('data-aos', 'fade-up');

    // Simple mobile check instead of utils.isMobile()
    const isMobile = window.innerWidth < 768;
    col.setAttribute('data-aos-delay', (index * (isMobile ? 50 : 100)).toString());

    const techTags = project.technologies.map(tech =>
        `<span class="tech-tag">${tech}</span>`
    ).join('');

    const githubLink = project.github ?
        `<a href="${project.github}" target="_blank" class="project-link github-link" rel="noopener noreferrer">
            <i class="fab fa-github"></i> GitHub
        </a>` : '';

    const liveLink = project.live ?
        `<a href="${project.live}" target="_blank" class="project-link live-link" rel="noopener noreferrer">
            <i class="fas fa-external-link-alt"></i> Live Demo
        </a>` : '';

    col.innerHTML = `
        <div class="project-card h-100">
            <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
            <div class="project-content d-flex flex-column">
                <h4 class="project-title">${project.title}</h4>
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${techTags}
                </div>
                <div class="project-links mt-auto">
                    ${githubLink}
                    ${liveLink}
                </div>
            </div>
        </div>
    `;

    return col;
}

// Run after DOM is loaded
document.addEventListener("DOMContentLoaded", renderProjects);

// Project modal functionality
function initProjectModal() {
    const addBtn = document.getElementById('add-project-btn');
    const saveBtn = document.getElementById('save-project');
    const form = document.getElementById('project-form');
    const modal = document.getElementById('projectModal');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (validateProjectForm()) {
                saveProject();
            }
        });
    }

    // Form validation
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateProjectForm()) {
                saveProject();
            }
        });
    }
}

function validateProjectForm() {
    const title = document.getElementById('project-title');
    const description = document.getElementById('project-description');

    let isValid = true;

    if (!title.value.trim()) {
        showValidationError(title, 'Project title is required');
        isValid = false;
    }

    if (!description.value.trim()) {
        showValidationError(description, 'Project description is required');
        isValid = false;
    }

    return isValid;
}

function showValidationError(input, message) {
    input.classList.add('is-invalid');

    // Remove existing error message
    const existingError = input.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);

    // Remove error on input
    input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        const errorMsg = input.parentNode.querySelector('.invalid-feedback');
        if (errorMsg) {
            errorMsg.remove();
        }
    }, { once: true });
}

function saveProject() {
    const newProject = {
        id: projects.length + 1,
        title: document.getElementById('project-title').value.trim(),
        description: document.getElementById('project-description').value.trim(),
        image: document.getElementById('project-image').value.trim() ||
            `https://via.placeholder.com/400x250/6366f1/ffffff?text=${encodeURIComponent(document.getElementById('project-title').value.trim())}`,
        technologies: document.getElementById('project-technologies').value
            .split(',')
            .map(tech => tech.trim())
            .filter(tech => tech.length > 0),
        github: document.getElementById('project-github').value.trim(),
        live: document.getElementById('project-live').value.trim()
    };

    projects.push(newProject);
    renderProjects();

    // Reset form and close modal
    document.getElementById('project-form').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('projectModal'));
    modal.hide();

    showNotification('Project added successfully!', 'success');
}

// Contact form handling with enhanced validation
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateContactForm()) {
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            const formData = new FormData(this);
            const contactData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };

            console.log('Contact form submitted:', contactData);

            // Reset form
            this.reset();
            clearFormValidation();

            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        }, utils.isMobile() ? 1500 : 2000);
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                validateInput(input);
            }
        });
    });
}

function validateContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove previous validation
    input.classList.remove('is-valid', 'is-invalid');

    if (!value && input.required) {
        isValid = false;
        errorMessage = `${input.placeholder} is required`;
    } else if (value) {
        switch (input.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = isValid ? '' : 'Please enter a valid email address';
                break;
            case 'tel':
                const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
                isValid = phoneRegex.test(value);
                errorMessage = isValid ? '' : 'Please enter a valid phone number';
                break;
            default:
                isValid = value.length >= 2;
                errorMessage = isValid ? '' : `${input.placeholder} must be at least 2 characters`;
        }
    }

    // Apply validation styling
    if (value) {
        input.classList.add(isValid ? 'is-valid' : 'is-invalid');

        if (!isValid) {
            showValidationError(input, errorMessage);
        }
    }

    return isValid;
}

function clearFormValidation() {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
        const errorMsg = input.parentNode.querySelector('.invalid-feedback');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
}

// Notification system with responsive positioning
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} position-fixed`;

    const isMobileDevice = utils.isMobile();
    notification.style.cssText = `
        ${isMobileDevice ? 'top: 80px; left: 20px; right: 20px;' : 'top: 20px; right: 20px;'}
        z-index: 9999;
        ${isMobileDevice ? '' : 'min-width: 300px; max-width: 400px;'}
        animation: slideIn${isMobileDevice ? 'Down' : 'Right'} 0.5s ease;
        box-shadow: var(--shadow-medium);
        border: none;
        border-radius: 10px;
    `;

    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            <span style="font-size: ${isMobileDevice ? '0.9rem' : '1rem'};">${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove notification
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = `slideOut${isMobileDevice ? 'Up' : 'Right'} 0.5s ease`;
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }
    }, 5000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes slideInDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideOutUp {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    const handleScroll = utils.debounce(() => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile touch gestures for navigation
function initTouchGestures() {
    if (!utils.isTouchDevice()) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();

        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        const timeDiff = touchEndTime - touchStartTime;

        // Only process quick swipes
        if (timeDiff > 500) return;

        // Horizontal swipe detection
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                navigateToNextSection();
            } else {
                navigateToPrevSection();
            }
        }

        touchStartX = 0;
        touchStartY = 0;
    }, { passive: true });
}

function navigateToNextSection() {
    const sections = ['home', 'about', 'skills', 'projects', 'contact', 'resume'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);

    if (currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        document.querySelector(`#${nextSection}`).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function navigateToPrevSection() {
    const sections = ['home', 'about', 'skills', 'projects', 'contact', 'resume'];
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);

    if (currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        document.querySelector(`#${prevSection}`).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = 'home';
    const offset = utils.isMobile() ? 100 : 80;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom >= offset) {
            currentSection = section.id;
        }
    });

    return currentSection;
}

// Responsive particle animation
function createParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection || utils.isMobile()) return; // Skip on mobile for performance

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    heroSection.appendChild(particlesContainer);

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 3;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${animationDuration}s;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;

        particlesContainer.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, animationDuration * 1000);
    }

    // Adjust particle frequency based on device performance
    const frequency = utils.isDesktop() ? 300 : 600;
    setInterval(createParticle, frequency);
}

// Responsive typing effect
function typeWriter(element, text, speed = 100) {
    if (!element) return;

    const adjustedSpeed = utils.isMobile() ? speed * 0.7 : speed;
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, adjustedSpeed);
        }
    }

    type();
}

// Enhanced skill interactions
function initSkillInteractions() {
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach((item, index) => {
        // Mouse events for desktop
        if (!utils.isTouchDevice()) {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.skill-icon');
                icon.style.transform = 'scale(1.1) rotate(10deg)';
            });

            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.skill-icon');
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        }

        // Touch events for mobile
        item.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.classList.add('animate');
            setTimeout(() => {
                this.classList.remove('animate');
            }, 600);
        }, { passive: false });

        // Add proficiency indicators
        addProficiencyIndicator(item, index);
    });
}

function addProficiencyIndicator(skillItem, index) {
    const proficiencyLevels = [90, 85, 88, 95, 92, 87, 90, 88, 85, 82, 80, 75, 70];
    const proficiency = proficiencyLevels[index] || 80;

    const proficiencyBar = document.createElement('div');
    proficiencyBar.className = 'proficiency-bar';
    proficiencyBar.style.cssText = `
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        margin-top: 1rem;
        overflow: hidden;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const proficiencyFill = document.createElement('div');
    proficiencyFill.className = 'proficiency-fill';
    proficiencyFill.style.cssText = `
        height: 100%;
        width: 0%;
        background: var(--gradient);
        border-radius: 2px;
        transition: width 1s ease;
    `;

    const proficiencyText = document.createElement('small');
    proficiencyText.className = 'proficiency-text';
    proficiencyText.style.cssText = `
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.7rem;
        margin-top: 0.5rem;
        display: block;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    proficiencyText.textContent = `${proficiency}%`;

    proficiencyBar.appendChild(proficiencyFill);
    skillItem.appendChild(proficiencyBar);
    skillItem.appendChild(proficiencyText);

    // Show proficiency on interaction
    const showProficiency = () => {
        proficiencyBar.style.opacity = '1';
        proficiencyText.style.opacity = '1';
        setTimeout(() => {
            proficiencyFill.style.width = proficiency + '%';
        }, 100);
    };

    const hideProficiency = () => {
        proficiencyBar.style.opacity = '0';
        proficiencyText.style.opacity = '0';
        proficiencyFill.style.width = '0%';
    };

    if (utils.isTouchDevice()) {
        skillItem.addEventListener('touchstart', showProficiency);
        skillItem.addEventListener('touchend', () => {
            setTimeout(hideProficiency, 2000);
        });
    } else {
        skillItem.addEventListener('mouseenter', showProficiency);
        skillItem.addEventListener('mouseleave', hideProficiency);
    }
}

// Responsive background animation
function createBackgroundAnimation() {
    if (utils.isMobile()) return; // Skip on mobile for performance

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.1;
    `;

    document.body.appendChild(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', utils.debounce(resizeCanvas, 100));
    resizeCanvas();

    const dots = [];
    const dotCount = utils.isDesktop() ? 50 : 25;

    for (let i = 0; i < dotCount; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dots.forEach(dot => {
            dot.x += dot.vx;
            dot.y += dot.vy;

            if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
            if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#6366f1';
            ctx.fill();
        });

        // Connect nearby dots (only on desktop)
        if (utils.isDesktop()) {
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 - distance / 500})`;
                        ctx.stroke();
                    }
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// Keyboard navigation (desktop only)
function initKeyboardNavigation() {
    if (utils.isMobile()) return;

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            const sections = ['home', 'about', 'skills', 'projects', 'contact', 'resume'];
            const key = parseInt(e.key);

            if (key >= 1 && key <= sections.length) {
                e.preventDefault();
                document.querySelector(`#${sections[key - 1]}`).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
}

// Responsive layout adjustments
function handleResize() {
    const resizeHandler = utils.debounce(() => {
        // Refresh AOS on resize
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

        // Update particle system
        const particlesContainer = document.querySelector('.particles');
        if (particlesContainer && utils.isMobile()) {
            particlesContainer.remove();
        } else if (!particlesContainer && !utils.isMobile()) {
            createParticles();
        }

        // Update hero content alignment
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            if (utils.isMobile()) {
                heroContent.style.textAlign = 'center';
            } else {
                heroContent.style.textAlign = 'left';
            }
        }
    }, 250);

    window.addEventListener('resize', resizeHandler);
}

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Preload critical images
    const criticalImages = ['mypic.png'];
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// // Initialize preloader with responsive design
// function initPreloader() {
//     const preloader = document.createElement('div');
//     preloader.id = 'preloader';
//     preloader.style.cssText = `
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: var(--dark-color);
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         z-index: 10000;
//         transition: opacity 0.5s ease;
//     `;

//     preloader.innerHTML = `
//         <div class="preloader-content text-center text-white">
//             <div class="spinner-border text-primary mb-3" role="status" style="width: ${utils.isMobile() ? '2rem' : '3rem'}; height: ${utils.isMobile() ? '2rem' : '3rem'};">
//                 <span class="visually-hidden">Loading...</span>
//             </div>
//             <h4 style="font-size: ${utils.isMobile() ? '1rem' : '1.25rem'};">Loading Portfolio...</h4>
//         </div>
//     `;

//     document.body.appendChild(preloader);

//     window.addEventListener('load', () => {
//         setTimeout(() => {
//             preloader.style.opacity = '0';
//             setTimeout(() => {
//                 if (preloader.parentNode) {
//                     preloader.parentNode.removeChild(preloader);
//                 }
//             }, 500);
//         }, utils.isMobile() ? 500 : 1000);
//     });
// }

// Error handling
function handleErrors() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    initAOS();
    initNavbar();
    initSmoothScrolling();
    initIntersectionObserver();
    initContactForm();
    initProjectModal();
    initBackToTop();
    initSkillInteractions();

    // Initialize responsive features
    handleResize();
    initTouchGestures();
    initKeyboardNavigation();

    // Performance and error handling
    optimizePerformance();
    handleErrors();

    // Initialize preloader
    initPreloader();

    // Render initial projects
    renderProjects();

    // Start background animation (desktop only)
    createBackgroundAnimation();

    // Initialize typing effect
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, utils.isMobile() ? 80 : 100);
        }, 1000);
    }

    // Add glitch effect to logo (desktop only)
    const logo = document.querySelector('.animated-logo');
    if (logo && !utils.isTouchDevice()) {
        logo.addEventListener('mouseenter', function() {
            this.classList.add('glitch');
            this.setAttribute('data-text', this.textContent);
        });

        logo.addEventListener('mouseleave', function() {
            this.classList.remove('glitch');
        });
    }

    // Show welcome message
    setTimeout(() => {
        const welcomeMsg = utils.isMobile() ?
            'Welcome to my portfolio!' :
            'Welcome to my portfolio! Use Ctrl+1-5 for quick navigation.';
        showNotification(welcomeMsg, 'info');
    }, utils.isMobile() ? 2000 : 3000);

    console.log('Portfolio loaded successfully!');
});

// Project filter functionality
function initProjectFilter() {
    const projectsSection = document.querySelector('#projects .container');
    if (!projectsSection) return;

    const filterContainer = document.createElement('div');
    filterContainer.className = 'project-filter text-center mb-4';
    filterContainer.innerHTML = `
        <div class="btn-group-responsive" role="group">
            <button type="button" class="btn btn-outline-primary btn-sm active" data-filter="all">All</button>
            <button type="button" class="btn btn-outline-primary btn-sm" data-filter="python">Python</button>
            <button type="button" class="btn btn-outline-primary btn-sm" data-filter="javascript">JavaScript</button>
            <button type="button" class="btn btn-outline-primary btn-sm" data-filter="django">Django</button>
        </div>
    `;

    // Insert after title row
    const titleRow = projectsSection.querySelector('.row:first-child');
    titleRow.after(filterContainer);

    // Style button group for mobile
    const style = document.createElement('style');
    style.textContent = `
        .btn-group-responsive {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: center;
        }
        
        .btn-group-responsive .btn {
            flex: ${utils.isMobile() ? '1 1 calc(50% - 0.25rem)' : '0 0 auto'};
            min-width: ${utils.isMobile() ? 'auto' : '100px'};
            font-size: ${utils.isMobile() ? '0.8rem' : '0.875rem'};
            padding: ${utils.isMobile() ? '0.375rem 0.5rem' : '0.375rem 0.75rem'};
        }
    `;
    document.head.appendChild(style);

    // Filter functionality
    const filterButtons = filterContainer.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const cardElement = card.closest('.col-lg-4');
        const technologies = card.querySelector('.project-technologies').textContent.toLowerCase();

        if (filter === 'all' || technologies.includes(filter.toLowerCase())) {
            cardElement.style.display = 'block';
            cardElement.style.animation = 'fadeInUp 0.5s ease';
        } else {
            cardElement.style.display = 'none';
        }
    });
}

// Responsive image loading
function initResponsiveImages() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });

        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/400x250/6366f1/ffffff?text=Image+Not+Found';
        });
    });
}

// Enhanced scroll performance
function initScrollOptimization() {
    let ticking = false;

    function updateScrollEffects() {
        // Update scroll progress
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / documentHeight) * 100, 100);

        // Update progress bar if it exists
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }

        // Parallax effect for hero section (desktop only)
        if (!utils.isMobile()) {
            const heroSection = document.querySelector('.hero-section');
            if (heroSection && scrollTop < window.innerHeight) {
                const parallaxSpeed = 0.5;
                heroSection.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
            }
        }

        ticking = false;
    }

    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
}

// Add scroll progress bar
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--gradient);
        z-index: 9999;
        transition: width 0.1s ease;
    `;

    document.body.appendChild(progressBar);
}

// Enhanced form features
function initFormEnhancements() {
    const formInputs = document.querySelectorAll('.form-control');

    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Character counter for textarea
        if (input.tagName === 'TEXTAREA') {
            const maxLength = 500;
            const counter = document.createElement('small');
            counter.className = 'character-counter';
            counter.style.cssText = `
                display: block;
                text-align: right;
                color: rgba(255, 255, 255, 0.6);
                margin-top: 0.25rem;
                font-size: 0.75rem;
            `;

            input.setAttribute('maxlength', maxLength);
            input.parentElement.appendChild(counter);

            const updateCounter = () => {
                const remaining = maxLength - input.value.length;
                counter.textContent = `${remaining} characters remaining`;
                counter.style.color = remaining < 50 ? '#ff6b6b' : 'rgba(255, 255, 255, 0.6)';
            };

            input.addEventListener('input', updateCounter);
            updateCounter();
        }
    });
}

// Device-specific optimizations
function applyDeviceOptimizations() {
    const body = document.body;

    // Add device classes
    body.classList.add(
        utils.isMobile() ? 'mobile-device' : 'desktop-device',
        utils.isTouchDevice() ? 'touch-device' : 'no-touch'
    );

    // Disable hover effects on touch devices
    if (utils.isTouchDevice()) {
        const style = document.createElement('style');
        style.textContent = `
            .no-hover:hover {
                transform: none !important;
                box-shadow: inherit !important;
            }
        `;
        document.head.appendChild(style);

        // Add no-hover class to elements
        document.querySelectorAll('.skill-item, .project-card, .social-link').forEach(el => {
            el.classList.add('no-hover');
        });
    }

    // Optimize animations for mobile
    if (utils.isMobile()) {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .particle, .particles {
                    display: none !important;
                }
                
                .skill-icon {
                    animation: none !important;
                }
                
                .profile-img {
                    animation-duration: 6s !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Orientation change handling
function handleOrientationChange() {
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            // Refresh AOS
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }

            // Recalculate dimensions
            if (typeof renderProjects === 'function') {
                renderProjects();
            }

            // Update viewport height for mobile browsers
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 100);
    });
}

// Custom cursor effect (desktop only)
function initCustomCursor() {
    if (utils.isMobile() || utils.isTouchDevice()) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
        opacity: 0;
    `;

    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Scale cursor on hover
    const interactiveElements = document.querySelectorAll('a, button, .skill-item, .project-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    if (!utils.isMobile()) return;

    let frameCount = 0;
    let lastTime = performance.now();

    function checkPerformance() {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
            const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));

            // Disable expensive animations if performance is poor
            if (fps < 30) {
                document.body.classList.add('low-performance');
                const style = document.createElement('style');
                style.textContent = `
                    .low-performance * {
                        animation-duration: 0.1s !important;
                        transition-duration: 0.1s !important;
                    }
                `;
                document.head.appendChild(style);
            }

            frameCount = 0;
            lastTime = currentTime;
        }

        requestAnimationFrame(checkPerformance);
    }

    requestAnimationFrame(checkPerformance);
}

// Network status handling
function initNetworkHandling() {
    function updateOnlineStatus() {
        if (!navigator.onLine) {
            showNotification('You are currently offline. Some features may not work.', 'warning');
        }
    }

    window.addEventListener('online', () => {
        showNotification('Connection restored!', 'success');
    });

    window.addEventListener('offline', updateOnlineStatus);
}

// Advanced responsive breakpoint detection
function initBreakpointDetection() {
    const breakpoints = {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400
    };

    function getCurrentBreakpoint() {
        const width = window.innerWidth;
        for (const [name, minWidth] of Object.entries(breakpoints).reverse()) {
            if (width >= minWidth) {
                return name;
            }
        }
        return 'xs';
    }

    let currentBreakpoint = getCurrentBreakpoint();

    const handleResize = utils.debounce(() => {
        const newBreakpoint = getCurrentBreakpoint();

        if (newBreakpoint !== currentBreakpoint) {
            document.body.setAttribute('data-breakpoint', newBreakpoint);
            document.body.dispatchEvent(new CustomEvent('breakpointChange', {
                detail: { from: currentBreakpoint, to: newBreakpoint }
            }));
            currentBreakpoint = newBreakpoint;
        }
    }, 100);

    window.addEventListener('resize', handleResize);
    document.body.setAttribute('data-breakpoint', currentBreakpoint);
}

// Initialize viewport height fix for mobile
function initViewportFix() {
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', utils.debounce(setVH, 100));
}

// Form accessibility enhancements
function initFormAccessibility() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            // Add ARIA labels if missing
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = form.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    input.setAttribute('aria-labelledby', label.id);
                } else if (input.placeholder) {
                    input.setAttribute('aria-label', input.placeholder);
                }
            }

            // Announce validation errors to screen readers
            input.addEventListener('invalid', function() {
                const errorMsg = this.validationMessage;
                this.setAttribute('aria-describedby', 'error-' + this.id);

                let errorElement = document.getElementById('error-' + this.id);
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.id = 'error-' + this.id;
                    errorElement.className = 'sr-only';
                    this.parentNode.appendChild(errorElement);
                }
                errorElement.textContent = errorMsg;
            });
        });
    });
}

// Export API for external use
window.portfolioAPI = {
    addProject(projectData) {
        projects.push({...projectData, id: projects.length + 1 });
        renderProjects();
        showNotification('Project added successfully!', 'success');
    },

    removeProject(projectId) {
        const index = projects.findIndex(p => p.id === projectId);
        if (index > -1) {
            projects.splice(index, 1);
            renderProjects();
            showNotification('Project removed successfully!', 'info');
        }
    },

    getProjects() {
        return [...projects];
    },

    updateProject(projectId, updateData) {
        const index = projects.findIndex(p => p.id === projectId);
        if (index > -1) {
            projects[index] = {...projects[index], ...updateData };
            renderProjects();
            showNotification('Project updated successfully!', 'success');
        }
    },

    showNotification,

    utils,

    refreshLayout() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        renderProjects();
    }
};

// Error boundary
function setupErrorBoundary() {
    window.addEventListener('error', (e) => {
        console.error('Portfolio Error:', e.error);
        showNotification('Something went wrong. Please refresh the page.', 'error');
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
        e.preventDefault();
    });
}

// Final initialization
function finalInit() {
    // Initialize all responsive features
    initBreakpointDetection();
    initViewportFix();
    initScrollOptimization();
    initScrollProgress();
    initFormEnhancements();
    initFormAccessibility();
    initResponsiveImages();
    initCustomCursor();
    initPerformanceMonitoring();
    initNetworkHandling();
    handleOrientationChange();
    applyDeviceOptimizations();
    setupErrorBoundary();

    // Initialize project filter
    setTimeout(initProjectFilter, 100);

    // Set initial focus for accessibility
    if (!utils.isMobile()) {
        const firstFocusable = document.querySelector('a, button, input, textarea, select');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', finalInit);

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('page-hidden');
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
});

// Service Worker registration for PWA features (optional)
if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }