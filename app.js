/* ===================================
   PHILIP DREßEL PORTFOLIO - JAVASCRIPT
   Interaktive Effekte und Animationen
   =================================== */

/* ===== GLOBALE VARIABLEN ===== */
/* Sammlung aller wichtigen DOM-Elemente und Konfigurationswerte */
const spotlightCursor = document.getElementById('cursorSpotlight');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav__link');
const fadeInElements = document.querySelectorAll('.fade-in-element');
const portfolioItems = document.querySelectorAll('.portfolio__item');

/* Konfiguration für verschiedene Effekte */
const CONFIG = {
    spotlight: {
        size: 200,              // Größe des Spotlight-Bereichs in Pixeln
        opacity: 0.8,           // Deckkraft des abgedunkelten Bereichs
        transition: 0.1,        // Übergangsgeschwindigkeit in Sekunden
        enabled: window.innerWidth >= 768  // Nur auf Desktop aktiviert
    },
    scrollAnimation: {
        threshold: 0.1,         // Wie viel vom Element sichtbar sein muss (10%)
        rootMargin: '0px 0px -50px 0px'  // Margin um den Root-Bereich
    }
};

/* ===== SPOTLIGHT CURSOR EFFEKT ===== */
/* Erstellt einen "Taschenlampen-Effekt" der der Mausbewegung folgt */

/**
 * Initialisiert den Spotlight-Cursor Effekt
 * Versteckt den Standard-Cursor und aktiviert den benutzerdefinierten Spotlight
 */
function initSpotlightCursor() {
    // Prüft ob Spotlight auf diesem Gerät aktiviert werden soll
    if (!CONFIG.spotlight.enabled) {
        document.body.style.cursor = 'auto';
        spotlightCursor.style.display = 'none';
        return;
    }

    // Event-Listener für Mausbewegung hinzufügen
    document.addEventListener('mousemove', updateSpotlightPosition);
    
    // Event-Listener für Maus-Enter/Leave des Fensters
    document.addEventListener('mouseenter', showSpotlight);
    document.addEventListener('mouseleave', hideSpotlight);
    
    console.log('✨ Spotlight-Cursor aktiviert');
}

/**
 * Aktualisiert die Position des Spotlight-Cursors basierend auf Mausposition
 * @param {MouseEvent} event - Das Mausereignis mit Positionsdaten
 */
function updateSpotlightPosition(event) {
    // Berechnet die relative Position der Maus im Viewport
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    
    // Setzt CSS Custom Properties für die Spotlight-Position
    spotlightCursor.style.setProperty('--x', `${x}%`);
    spotlightCursor.style.setProperty('--y', `${y}%`);
}

/**
 * Zeigt den Spotlight-Effekt an wenn die Maus das Fenster betritt
 */
function showSpotlight() {
    if (CONFIG.spotlight.enabled) {
        spotlightCursor.style.opacity = '1';
    }
}

/**
 * Versteckt den Spotlight-Effekt wenn die Maus das Fenster verlässt
 */
function hideSpotlight() {
    spotlightCursor.style.opacity = '0';
}

/* ===== SCROLL-ANIMATIONEN ===== */
/* Implementiert Fade-in Animationen beim Scrollen mit Intersection Observer */

/**
 * Initialisiert den Intersection Observer für Scroll-Animationen
 * Überwacht Elemente und löst Animationen aus wenn sie ins Viewport kommen
 */
function initScrollAnimations() {
    // Intersection Observer erstellen mit konfigurierten Optionen
    const observer = new IntersectionObserver(
        handleIntersection,
        CONFIG.scrollAnimation
    );

    // Alle Elemente mit der Klasse 'fade-in-element' überwachen
    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    console.log(`🎬 Scroll-Animationen für ${fadeInElements.length} Elemente aktiviert`);
}

/**
 * Behandelt Intersection Events und löst Animationen aus
 * @param {IntersectionObserverEntry[]} entries - Array der beobachteten Elemente
 */
function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Element ist sichtbar - Animation starten
            const delay = Math.random() * 200; // Zufällige Verzögerung für natürlicheren Effekt
            
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            
            // Element nicht mehr beobachten (Animation nur einmal ausführen)
            observer.unobserve(entry.target);
        }
    });
}

/* ===== NAVIGATION ===== */
/* Behandelt Navigation, Smooth Scrolling und Mobile Menu */

/**
 * Initialisiert alle Navigations-Funktionalitäten
 * Setzt Event-Listener für Links, Mobile Menu und Scroll-Erkennung
 */
function initNavigation() {
    // Mobile Menü Toggle
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Navigation Links für Smooth Scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Scroll-Erkennung für aktive Navigation
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    
    // Außerhalb-Klick für Mobile Menü schließen
    document.addEventListener('click', handleOutsideClick);
    
    console.log('🧭 Navigation initialisiert');
}

/**
 * Togglet das Mobile Menü zwischen geöffnet und geschlossen
 */
function toggleMobileMenu() {
    const isActive = navMenu.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

/**
 * Öffnet das Mobile Menü mit Animation
 */
function openMobileMenu() {
    navMenu.classList.add('active');
    navToggle.classList.add('active');
    document.body.style.overflow = 'hidden'; // Verhindert Scrollen im Hintergrund
}

/**
 * Schließt das Mobile Menü
 */
function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = ''; // Scrollen wieder ermöglichen
}

/**
 * Behandelt Klicks auf Navigations-Links
 * Implementiert Smooth Scrolling und schließt Mobile Menu
 * @param {Event} event - Das Klick-Event
 */
function handleNavLinkClick(event) {
    event.preventDefault();
    
    const targetId = event.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        let offsetTop;
        
        // Spezielle Behandlung für Home-Link (Hero-Sektion)
        if (targetId === '#home') {
            offsetTop = 0; // Ganz nach oben scrollen
        } else {
            offsetTop = targetElement.offsetTop - 80; // Account for fixed header
        }
        
        // Smooth Scroll zum Ziel-Element
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Mobile Menü schließen falls geöffnet
        if (navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // Aktiven Link sofort aktualisieren
        setTimeout(() => {
            updateActiveNavLink();
        }, 100);
        
    } else {
        console.warn(`Ziel-Element für ${targetId} nicht gefunden`);
    }
}

/**
 * Aktualisiert den aktiven Navigations-Link basierend auf Scroll-Position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;
    
    let currentSection = 'home'; // Default zu home
    
    // Wenn ganz oben auf der Seite, dann home aktivieren
    if (window.pageYOffset < 100) {
        currentSection = 'home';
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
    }
    
    // Aktive Klasse von allen Links entfernen
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Aktive Klasse zum entsprechenden Link hinzufügen
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Behandelt Klicks außerhalb des Mobile Menüs um es zu schließen
 * @param {Event} event - Das Klick-Event
 */
function handleOutsideClick(event) {
    if (navMenu.classList.contains('active')) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle) {
            closeMobileMenu();
        }
    }
}

/* ===== PORTFOLIO INTERAKTIONEN ===== */
/* Verbessert Portfolio-Kacheln mit Hover-Effekten und Animationen */

/**
 * Initialisiert interaktive Effekte für Portfolio-Kacheln
 * Fügt Hover-Animationen und Glow-Effekte hinzu
 */
function initPortfolioInteractions() {
    portfolioItems.forEach((item, index) => {
        // Hover-Event Listener hinzufügen
        item.addEventListener('mouseenter', (e) => handlePortfolioHover(e, true));
        item.addEventListener('mouseleave', (e) => handlePortfolioHover(e, false));
        
        // Staggered Animation Delay für natürlicheren Effekt
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    console.log(`🎨 Portfolio-Interaktionen für ${portfolioItems.length} Projekte aktiviert`);
}

/**
 * Behandelt Hover-Effekte für Portfolio-Kacheln
 * @param {Event} event - Das Hover-Event
 * @param {boolean} isEntering - Ob die Maus das Element betritt oder verlässt
 */
function handlePortfolioHover(event, isEntering) {
    const item = event.currentTarget;
    const title = item.querySelector('.portfolio__title');
    const description = item.querySelector('.portfolio__description');
    
    if (isEntering) {
        // Hover-Effekte beim Betreten
        item.style.transform = 'translateY(-10px) scale(1.02)';
        
        // Zusätzliche Text-Animation
        if (title) {
            title.style.transform = 'translateX(5px)';
        }
        
        // Subtile Puls-Animation für Beschreibung
        if (description) {
            description.style.opacity = '1';
        }
        
    } else {
        // Zurücksetzen beim Verlassen
        item.style.transform = 'translateY(0) scale(1)';
        
        if (title) {
            title.style.transform = 'translateX(0)';
        }
        
        if (description) {
            description.style.opacity = '0.8';
        }
    }
}

/* ===== UTILITY FUNCTIONS ===== */
/* Hilfsfunktionen für Performance und allgemeine Aufgaben */

/**
 * Throttle-Funktion zur Performance-Optimierung
 * Begrenzt wie oft eine Funktion aufgerufen werden kann
 * @param {Function} func - Die zu throttelnde Funktion
 * @param {number} limit - Zeitlimit in Millisekunden
 * @returns {Function} Die gedrosselte Funktion
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * Debounce-Funktion für verzögerte Ausführung
 * Wartet bis eine bestimmte Zeit ohne weitere Aufrufe vergangen ist
 * @param {Function} func - Die zu debouncende Funktion
 * @param {number} wait - Wartezeit in Millisekunden
 * @returns {Function} Die gebouncte Funktion
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Prüft ob der Nutzer ein Mobile-Gerät verwendet
 * @returns {boolean} True wenn Mobile-Gerät erkannt wird
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Prüft ob der Nutzer reduzierte Bewegungen bevorzugt (Accessibility)
 * @returns {boolean} True wenn reduzierte Bewegungen bevorzugt werden
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ===== RESPONSIVE HANDLING ===== */
/* Behandelt Änderungen der Bildschirmgröße und Orientierung */

/**
 * Behandelt Resize-Events für responsive Anpassungen
 */
function handleResize() {
    const wasSpotlightEnabled = CONFIG.spotlight.enabled;
    CONFIG.spotlight.enabled = window.innerWidth >= 768;
    
    // Spotlight aktivieren/deaktivieren basierend auf Bildschirmgröße
    if (wasSpotlightEnabled !== CONFIG.spotlight.enabled) {
        if (CONFIG.spotlight.enabled) {
            document.body.style.cursor = 'none';
            spotlightCursor.style.display = 'block';
            console.log('✨ Spotlight-Cursor aktiviert (Resize)');
        } else {
            document.body.style.cursor = 'auto';
            spotlightCursor.style.display = 'none';
            console.log('📱 Spotlight-Cursor deaktiviert (Mobile)');
        }
    }
    
    // Mobile Menu schließen bei Resize zu Desktop
    if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
}

/* ===== ERROR HANDLING ===== */
/* Globale Fehlerbehandlung für robuste User Experience */

/**
 * Globaler Error Handler für unbehandelte JavaScript-Fehler
 * @param {ErrorEvent} event - Das Error-Event
 */
function handleGlobalError(event) {
    console.error('❌ JavaScript Fehler:', event.error);
    
    // Fallback: Spotlight deaktivieren falls Probleme auftreten
    if (event.error && event.error.toString().includes('spotlight')) {
        CONFIG.spotlight.enabled = false;
        document.body.style.cursor = 'auto';
        spotlightCursor.style.display = 'none';
        console.log('🛡️ Spotlight-Cursor wegen Fehler deaktiviert');
    }
}

/* ===== PERFORMANCE MONITORING ===== */
/* Überwacht Performance-Metriken für Optimierung */

/**
 * Misst und loggt Performance-Metriken
 */
function logPerformanceMetrics() {
    if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paintMetrics = performance.getEntriesByType('paint');
        
        console.log('📊 Performance Metriken:');
        console.log(`   DOM geladen: ${Math.round(navigation.domContentLoadedEventEnd)}ms`);
        console.log(`   Seite geladen: ${Math.round(navigation.loadEventEnd)}ms`);
        
        paintMetrics.forEach(metric => {
            console.log(`   ${metric.name}: ${Math.round(metric.startTime)}ms`);
        });
    }
}

/* ===== ACCESSIBILITY ENHANCEMENTS ===== */
/* Verbessert Zugänglichkeit für verschiedene Nutzergruppen */

/**
 * Initialisiert Accessibility-Verbesserungen
 */
function initAccessibility() {
    // Tastatur-Navigation für Portfolio-Items
    portfolioItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Portfolio Projekt - Klicken für Details');
        
        // Keyboard Event Listener
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
    
    // ARIA Labels für Navigation
    navLinks.forEach(link => {
        const section = link.getAttribute('href').substring(1);
        link.setAttribute('aria-label', `Navigiere zu ${section} Sektion`);
    });
    
    // Skip Link für Tastatur-Navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Zum Hauptinhalt springen';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--accent-primary);
        color: var(--text-primary);
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    console.log('♿ Accessibility-Verbesserungen aktiviert');
}

/* ===== INITIALIZATION ===== */
/* Haupt-Initialisierungsfunktion die beim Laden der Seite ausgeführt wird */

/**
 * Haupt-Initialisierungsfunktion
 * Startet alle Module und Funktionalitäten der Website
 */
function initializeApp() {
    console.log('🚀 Portfolio-Website wird initialisiert...');
    
    try {
        // Prüfe ob alle kritischen Elemente verfügbar sind
        if (!spotlightCursor || !navToggle || !navMenu) {
            throw new Error('Kritische DOM-Elemente fehlen');
        }
        
        // Alle Module initialisieren
        initSpotlightCursor();
        initScrollAnimations();
        initNavigation();
        initPortfolioInteractions();
        initAccessibility();
        
        // Event Listeners für Window Events
        window.addEventListener('resize', debounce(handleResize, 250));
        window.addEventListener('error', handleGlobalError);
        
        // Performance-Metriken nach vollständigem Laden
        window.addEventListener('load', () => {
            setTimeout(logPerformanceMetrics, 1000);
        });
        
        // Reduzierte Bewegung prüfen
        if (prefersReducedMotion()) {
            console.log('♿ Reduzierte Bewegungen erkannt - Animationen angepasst');
            CONFIG.spotlight.enabled = false;
            document.body.style.cursor = 'auto';
            spotlightCursor.style.display = 'none';
        }
        
        console.log('✅ Portfolio-Website erfolgreich initialisiert');
        console.log(`📱 Mobile-Gerät: ${isMobileDevice()}`);
        console.log(`✨ Spotlight aktiv: ${CONFIG.spotlight.enabled}`);
        
    } catch (error) {
        console.error('❌ Fehler bei der Initialisierung:', error);
        
        // Fallback: Grundfunktionalität sicherstellen
        document.body.style.cursor = 'auto';
        if (spotlightCursor) {
            spotlightCursor.style.display = 'none';
        }
    }
}

/* ===== EVENT LISTENERS ===== */
/* Wartet auf DOM-Bereitschaft und startet die Anwendung */

// Startet die Initialisierung sobald das DOM vollständig geladen ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // Falls das DOM bereits geladen ist
    initializeApp();
}

// Zusätzliche Event-Listener für spezielle Fälle
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Seite ist nicht sichtbar - Animationen pausieren
        if (CONFIG.spotlight.enabled) {
            spotlightCursor.style.opacity = '0';
        }
    } else {
        // Seite ist wieder sichtbar - Animationen fortsetzen
        if (CONFIG.spotlight.enabled) {
            spotlightCursor.style.opacity = '1';
        }
    }
});

/* ===== DEVELOPMENT HELPERS ===== */
/* Hilfsfunktionen für Entwicklung und Debugging */

// Console-Styling für bessere Lesbarkeit (nur in Development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('%cPhilip Dreßel Portfolio', 'color: #4a9eff; font-size: 20px; font-weight: bold;');
    console.log('%cEntwickelt mit ❤️ und JavaScript', 'color: #b0b0b0; font-style: italic;');
}

// Export für mögliche Module (falls später erweitert wird)
window.PortfolioApp = {
    config: CONFIG,
    utils: {
        throttle,
        debounce,
        isMobileDevice,
        prefersReducedMotion
    }
};