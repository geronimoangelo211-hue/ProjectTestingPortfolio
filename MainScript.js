if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

window.onload = function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 10); 
};

document.addEventListener('DOMContentLoaded', () => {

    const contactTriggers = document.querySelectorAll('.contact-icon, .contact-trigger');
    const ui1 = document.getElementById('contact-ui');  
    const ui2 = document.getElementById('contact-ui2'); 

    let isContactOpen = false;
    let isAnimating = false; 

    function toggleContactUI(e) {
        if (e) e.preventDefault(); 

        if (isAnimating) return;

        isAnimating = true;

        if (!isContactOpen) {
            ui1.classList.add('on');
            ui2.classList.add('on');

            setTimeout(() => {
                ui1.classList.add('move-left');
                ui2.classList.add('move-right');
            }, 500);

            setTimeout(() => {
                isContactOpen = true;
                isAnimating = false; 
            }, 1100);

        } else {

            ui1.classList.remove('move-left');
            ui2.classList.remove('move-right');

            setTimeout(() => {
                ui1.classList.remove('on');
                ui2.classList.remove('on');
                
                isContactOpen = false;
                isAnimating = false; 
            }, 500); 
        }
    }

    contactTriggers.forEach(btn => {
        btn.addEventListener('click', toggleContactUI);
    });

    document.addEventListener('click', (e) => {
        if (isContactOpen && !isAnimating) {
            let clickedOnTrigger = false;
            
            contactTriggers.forEach(btn => {
                if (btn.contains(e.target)) clickedOnTrigger = true;
            });

            if (!clickedOnTrigger && !ui1.contains(e.target) && !ui2.contains(e.target)) {
                toggleContactUI(null);
            }
        }
    });

    
    const roles = ["Developer", "UI Designer", "Game Creator"];
    const typeTextSpan = document.querySelector(".typing-text");

    if (typeTextSpan) {

        let roleIndex = 0;
        let charIndex = roles[0].length; 
        let isDeleting = true; 

        function typeRole() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typeTextSpan.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeTextSpan.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

      
            let typeSpeed = isDeleting ? 30 : 60; 


            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 9000; 
                isDeleting = true; 
            } 
            else if (isDeleting && charIndex === 0) {
                isDeleting = false; 
                roleIndex = (roleIndex + 1) % roles.length; 
                typeSpeed = 300; 
            }
            
            setTimeout(typeRole, typeSpeed);
        }
        setTimeout(typeRole, 11000);
    }
    
    
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

});

document.addEventListener('DOMContentLoaded', () => {
    
    const card = document.getElementById('hanging-card');
    const wrapper = document.getElementById('physics-wrapper');
    const lanyard = document.getElementById('lanyard-image'); 
    const glare = document.querySelector('.card-glare');
    
    if (card && wrapper && lanyard) {

        const TENSION = 0.01;     
        const FRICTION = 0.95;    
        const MOUSE_PULL = 0.5;   

        let position = { x: 0, y: -800 }; 
        let velocity = { x: 0, y: 0 }; 
        let target = { x: 0, y: 0 };
        
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        card.addEventListener('mousedown', (e) => {
            isDragging = true;
            card.style.cursor = 'grabbing';
            e.preventDefault(); 

            const rect = wrapper.getBoundingClientRect();
            const wrapperCenterX = rect.left + rect.width / 2;
            const wrapperCenterY = rect.top + 150; 

            dragOffset.x = (e.clientX - wrapperCenterX) - position.x;
            dragOffset.y = (e.clientY - wrapperCenterY) - position.y;
            
            velocity = { x: 0, y: 0 }; 
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                card.style.cursor = 'grab';
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const rect = wrapper.getBoundingClientRect();
            const wrapperCenterX = rect.left + rect.width / 2;
            const wrapperCenterY = rect.top + 150; 

            let rawX = (e.clientX - wrapperCenterX) - dragOffset.x;
            let rawY = (e.clientY - wrapperCenterY) - dragOffset.y;

            const MAX_X = 2000; 
            const MAX_Y = 2650; 

            target.x = Math.max(-MAX_X, Math.min(MAX_X, rawX));
            target.y = Math.max(-MAX_Y, Math.min(MAX_Y, rawY));
        });

        function animatePhysics() {
            

            if (isDragging) {
                position.x += (target.x - position.x) * MOUSE_PULL;
                position.y += (target.y - position.y) * MOUSE_PULL;
                
                velocity.x = (target.x - position.x) * 0.1;
                velocity.y = (target.y - position.y) * 0.1;

            } else {
                const time = Date.now() * 0.0015; 
                
                const swayX = Math.sin(time) * 15; 
                const swayY = Math.cos(time * 2) * 5; 

                const forceX = (swayX - position.x) * TENSION;
                const forceY = (swayY - position.y) * TENSION;

                velocity.x += forceX;
                velocity.y += forceY;

                velocity.x *= FRICTION;
                velocity.y *= FRICTION;

                position.x += velocity.x;
                position.y += velocity.y;
            }

            let rotation = position.x * 0.1;
            rotation = Math.max(-60, Math.min(60, rotation));

            card.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`;

            const deltaX = position.x;
            const deltaY = 150 + position.y; 
            
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angleRad = Math.atan2(deltaY, deltaX);
            const angleDeg = (angleRad * 180 / Math.PI) - 90;

            lanyard.style.height = `${length + 20}px`;
            lanyard.style.transform = `translateX(-50%) rotate(${angleDeg}deg)`;

            const glareX = 50 - (rotation * 3);
            const glareY = 50 - (position.y * 0.2);
            glare.style.transform = `translate(${glareX}px, ${glareY}px)`;

            requestAnimationFrame(animatePhysics);
        }

        setTimeout(() => {
            wrapper.classList.add('visible'); 
            animatePhysics(); 
        }, 2600);
    }
});

    
const aboutWrapper = document.querySelector('.tilt-wrapper');
    const tiltCard = document.querySelector('.tilt-card');
    const layer1 = document.querySelector('.layer-1-bg'); 

    if (aboutWrapper && tiltCard && layer1) {
        
        aboutWrapper.addEventListener('mousemove', (e) => {
            const rect = aboutWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -20; 
            const rotateY = ((x - centerX) / centerX) * 20;

            const bgPosX = (x / rect.width) * 100;
            const bgPosY = (y / rect.height) * 100;

            tiltCard.style.transition = 'none'; 
            layer1.style.transition = 'none'; 

            tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            layer1.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
        });

        aboutWrapper.addEventListener('mouseleave', () => {
            tiltCard.style.transition = 'transform 0.5s ease'; 
            layer1.style.transition = 'background-position 0.5s ease';
            
            tiltCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
            layer1.style.backgroundPosition = `50% 50%`;
        });
    }

const aboutSection = document.querySelector('#about');
    const aboutBox = document.querySelector('.about-text-box');
    
    const cardWrapper = document.querySelector('.tilt-wrapper'); 
    
    const descElement = document.querySelector('.about-typing-desc');
    const statsContainer = document.getElementById('stats-container');
    const statExp = document.getElementById('count-exp');
    const statProj = document.getElementById('count-proj');
    
    let hasAnimated = false; 

    if (aboutSection && aboutBox && descElement) {
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    runAboutSequence();
                }
            });
        }, { threshold: 0.50 }); 

        observer.observe(aboutSection);

        function runAboutSequence() {
            aboutBox.classList.add('visible');
            
            if(cardWrapper) {
                cardWrapper.classList.add('card-in');
            }

            setTimeout(() => {
                const text = descElement.getAttribute('data-text');
                typeText(descElement, text, 0, () => {
                    
                    if(statsContainer) {
                        statsContainer.classList.add('pop-visible');
                        
                        setTimeout(() => {
                            animateCounterSlow(statExp);
                            animateCounterSlow(statProj);
                        }, 300);
                    }
                });
            }, 500);
        }

        function typeText(element, text, index, callback) {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                let speed = Math.floor(Math.random() * 15) + 5; 
                setTimeout(() => {
                    typeText(element, text, index + 1, callback);
                }, speed);
            } else {
                if (callback) callback();
            }
        }

        function animateCounterSlow(element) {
            if(!element) return;
            const target = +element.getAttribute('data-target'); 
            const totalDuration = 2500; 
            const stepTime = Math.abs(Math.floor(totalDuration / target));
            let current = 0;
            const timer = setInterval(() => {
                current += 1;
                element.innerText = current + "+";
                if (current >= target) clearInterval(timer);
            }, stepTime);
        }
    }

const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    function highlightNav() {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    
    highlightNav();

    const projectSection = document.getElementById('project');
    const projectContainer = document.querySelector('.project-container');
    const deckContainer = document.querySelector('.cards-deck');
    const allCards = Array.from(document.querySelectorAll('.project-card'));
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indP1 = document.getElementById('ind-p1');
    const indP2 = document.getElementById('ind-p2');
    
    
    const detailsPanel = document.querySelector('.project-details-panel');
    const closeDetailsBtn = document.getElementById('close-details');
    const detTitle = document.getElementById('detail-title');
    const detDesc = document.getElementById('detail-desc');
    const linkDemo = document.getElementById('link-demo');
    const linkGit = document.getElementById('link-github');
    const detImg1 = document.getElementById('det-img1');
    const detImg2 = document.getElementById('det-img2');

    
    let currentPage = 0; 
    const pageSize = 5;
    let hasIntroRun = false; 
    let isFanOpen = false;
    let isTransitioning = false; 
    let isExpanded = false; 
    let descTimer = null; 
    let shuffleInterval = null; 
    

    let animTimeouts = []; 

    if (projectSection && allCards.length > 0) {
        
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    if (!hasIntroRun) {
                        hasIntroRun = true;
                        runIntroSequence();
                    } else if (!isFanOpen && !isExpanded) {
                        isFanOpen = true;
                        shuffleAndFan(); 
                    }
                } 
    
                else {
                
                    clearAnimTimeouts();
                    stopShuffle(); 
                    
                    if (!isExpanded) {
                        isFanOpen = false;
                        setDeckLock(true); 
                        
                
                        allCards.forEach(card => {
                            card.classList.remove('no-transition');
                        });
                    }
                }
            });
        }, { threshold: 0.2 });

        observer.observe(projectSection);

    
        
        function clearAnimTimeouts() {
            animTimeouts.forEach(id => clearTimeout(id));
            animTimeouts = [];
        }

        function stopShuffle() {
            if (shuffleInterval) {
                clearInterval(shuffleInterval);
                shuffleInterval = null;
            }
            allCards.forEach(card => card.classList.remove('no-transition'));
        }

        function setDeckLock(locked) {
            if (locked) { 
                deckContainer.classList.add('deck-locked'); 
                isTransitioning = true; 
            } else { 
                deckContainer.classList.remove('deck-locked'); 
                isTransitioning = false; 
            }
        }

        function updateIndicators(targetPage) {
            if (targetPage === 0) { 
                if(indP1) indP1.classList.add('active-page'); 
                if(indP2) indP2.classList.remove('active-page'); 
            } else { 
                if(indP1) indP1.classList.remove('active-page'); 
                if(indP2) indP2.classList.add('active-page'); 
            }
        }

        function typeProjectDesc(text, index) {
            if (index < text.length) {
                detDesc.innerHTML += text.charAt(index);
                descTimer = setTimeout(() => typeProjectDesc(text, index + 1), 20);
            }
        }


        function runIntroSequence() {
            setDeckLock(true);
            
            const introOverlay = document.querySelector('.project-intro');
            const mainContent = document.querySelector('.project-main-content');
            
            setTimeout(() => {
                if(introOverlay) introOverlay.classList.add('fade-out');
                setTimeout(() => {
                    if(mainContent) mainContent.classList.remove('content-hidden');
                    allCards.forEach((card, i) => { if(i<5) card.style.transform = 'translate(0px, 0px) rotate(0deg)'; });
                    
                    setTimeout(() => { 
                        isFanOpen = true; 
                        shuffleAndFan(); 
                    }, 2000); 
                }, 800);
            }, 2000);
        }

        function shuffleAndFan() {
            setDeckLock(true); 
            stopShuffle(); 
            clearAnimTimeouts(); 

            let shuffles = 0;
            const maxShuffles = 25; 
            const start = currentPage * pageSize;
            const end = start + pageSize;

            allCards.forEach((card, index) => {
                if (index >= start && index < end) {
                    card.style.display = 'block';
                    card.classList.remove('hidden-card');
                    card.classList.add('no-transition'); 
                    card.style.transform = 'translate(0px, 0px) rotate(0deg)';
                } else {
                    card.classList.add('hidden-card');
                }
            });

            shuffleInterval = setInterval(() => {
                allCards.forEach((card, index) => {
                    if (index >= start && index < end) {
                        const rX = Math.random() * 20 - 10;
                        const rY = Math.random() * 20 - 10;
                        const rR = Math.random() * 6 - 3;

                        card.style.transform = `translate(${rX}px, ${rY}px) rotate(${rR}deg)`;
                        card.style.zIndex = Math.floor(Math.random() * 5) + 10; 
                    }
                });
                shuffles++;
                
                if (shuffles >= maxShuffles) {
                    stopShuffle(); 
                    updatePage(); 
                }
            }, 60); 
        }

        function updatePage() {
            const start = currentPage * pageSize;
            const end = start + pageSize;
            updateIndicators(currentPage);

            allCards.forEach((card, index) => {
                if (index >= start && index < end) {
                    card.classList.remove('no-transition'); 
                    const localIndex = index - start;
                    const angles = [-30, -15, 0, 15, 30]; 
                    const xOffsets = [-140, -70, 0, 70, 140];
                    
                    const homeString = `translateX(${xOffsets[localIndex]}px) rotate(${angles[localIndex]}deg)`;
                    const pulledString = `translateX(${xOffsets[localIndex]}px) rotate(${angles[localIndex]}deg) translateY(-70px) scale(1.1)`;
                    
                    card.dataset.home = homeString;
                    card.dataset.pulled = pulledString;
                    card.dataset.baseZ = 10 + localIndex; 

                    let tId = setTimeout(() => {
                        card.style.transform = homeString;
                        card.style.zIndex = 10 + localIndex; 
                    }, localIndex * 150); 
                    animTimeouts.push(tId);

                } else {
                    card.classList.add('hidden-card');
                    let tId = setTimeout(() => { 
                        if(card.classList.contains('hidden-card')) card.style.display = 'none'; 
                    }, 500);
                    animTimeouts.push(tId);
                }
            });
            
            let uId = setTimeout(() => { 
                setDeckLock(false); 
            }, 1500);
            animTimeouts.push(uId);
        }

        function handlePageChange(targetPage) {
            if(isTransitioning) return; 
            
            setDeckLock(true); 
            
            updateIndicators(targetPage);
            
            const start = currentPage * pageSize;
            const end = start + pageSize;
            
            allCards.forEach((card, index) => {
                if(index >= start && index < end) {
                    card.style.transition = 'transform 0.6s ease-in-out'; 
                    card.style.transform = 'translate(0px, 0px) rotate(0deg)';
                }
            });

            setTimeout(() => {
                currentPage = targetPage;
                shuffleAndFan();
            }, 700); 
        }

        nextBtn.addEventListener('click', () => {
            if (isTransitioning || isExpanded) return;
            let nextPage = ((currentPage + 1) * pageSize < allCards.length) ? currentPage + 1 : 0;
            handlePageChange(nextPage);
        });

        prevBtn.addEventListener('click', () => {
            if (isTransitioning || isExpanded) return;
            let prevPage = (currentPage > 0) ? currentPage - 1 : Math.ceil(allCards.length / pageSize) - 1;
            handlePageChange(prevPage);
        });

        allCards.forEach(card => {
            
            card.addEventListener('mouseenter', () => {
                if (deckContainer.classList.contains('deck-locked') || card.classList.contains('hidden-card') || isExpanded) return;
                
                deckContainer.classList.add('has-active');
                card.classList.add('is-pulled');
                card.style.zIndex = 500; 
                card.style.transform = card.dataset.pulled;
            });

            card.addEventListener('mouseleave', () => {
                if (isExpanded) return; 
                deckContainer.classList.remove('has-active');
                card.classList.remove('is-pulled');
                card.style.zIndex = card.dataset.baseZ; 
                card.style.transform = card.dataset.home;
            });

            card.addEventListener('click', () => {
                if (isTransitioning || isExpanded || deckContainer.classList.contains('deck-locked')) return;
                
                isExpanded = true;
                projectContainer.classList.add('expanded-view');
                card.classList.add('is-expanded');
                detailsPanel.classList.add('active'); 
                
                const infoBox = card.querySelector('.card-floating-info');
                const titleText = infoBox.querySelector('h3').innerText;
                const shortDesc = infoBox.querySelector('p').innerText;
                const longDesc = card.getAttribute('data-panel-desc') || shortDesc;
                const demoLink = card.getAttribute('data-demo');
                const gitLink = card.getAttribute('data-github');
                const img1Src = card.getAttribute('data-img1');
                const img2Src = card.getAttribute('data-img2');
                const img3Src = card.getAttribute('data-img3'); 

                detTitle.innerText = titleText;
                linkDemo.href = demoLink;
                linkGit.href = gitLink;
                
                if (detImg1) detImg1.src = img1Src || 'Image/Logo.jpeg';
                if (detImg2) detImg2.src = img2Src || 'Image/Logo.jpeg';
                
                const detImg3 = document.getElementById('det-img3');
                if (detImg3) {
                    if (img3Src) { detImg3.style.display = 'block'; detImg3.src = img3Src; }
                    else { detImg3.style.display = 'none'; }
                }

                if (descTimer) clearTimeout(descTimer);
                detDesc.innerHTML = ""; 
                setTimeout(() => { typeProjectDesc(longDesc, 0); }, 400);
            });
        });

        closeDetailsBtn.addEventListener('click', () => {
            setDeckLock(true);
            isExpanded = false;
            detailsPanel.classList.remove('active');
            projectContainer.classList.remove('expanded-view');
            if (descTimer) clearTimeout(descTimer);
            detDesc.innerHTML = ""; 

            const activeCard = document.querySelector('.project-card.is-expanded');
            if(activeCard) {
                activeCard.classList.remove('is-expanded', 'is-pulled');
                deckContainer.classList.remove('has-active');
                activeCard.style.transform = activeCard.dataset.home;
                
                setTimeout(() => { 
                    activeCard.style.zIndex = activeCard.dataset.baseZ; 
                    setDeckLock(false);
                }, 600);
            } else {
                setDeckLock(false);
            }
        });
    }

const lbOverlay = document.getElementById('lightbox-overlay');
    const lbImg = document.getElementById('lightbox-img');
    const lbClose = document.getElementById('lightbox-close');

    function openLightbox(src) {
        if (!lbOverlay || !lbImg) return;
        lbImg.src = src;
        lbOverlay.classList.add('active');
    }

    function closeLightbox() {
        if (!lbOverlay) return;
        lbOverlay.classList.remove('active');
        setTimeout(() => { 
            if(lbImg) lbImg.src = ''; 
        }, 300);
    }

    document.addEventListener('click', (e) => {
        const target = e.target;

        if (target.id === 'det-img1' || target.id === 'det-img2') {
            if (target.src && target.src !== '') {
                openLightbox(target.src);
            }
            return; 
        }

        const certWrapper = target.closest('.cert-img-wrapper');
        
        if (certWrapper) {
            const img = certWrapper.querySelector('img'); 
            if (img && img.src) {
                openLightbox(img.src);
            }
            return; 
        }

        if (target.closest('#lightbox-close')) {
            closeLightbox();
        }

        if (target === lbOverlay) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

const certSection = document.getElementById('certificates');
    const certTitle = document.querySelector('.cert-header .section-title');
    const certSubtitle = document.querySelector('.cert-subtitle');
    const certCards = document.querySelectorAll('.cert-card');
    const certButtons = document.querySelector('.cert-connect-wrapper'); 

    if (certSection) {
        const certObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    
                    if (certTitle) certTitle.classList.add('visible');

                    setTimeout(() => {
                        if (certSubtitle) certSubtitle.classList.add('visible');
                    }, 200);

                    if (certCards) {
                        certCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('visible');
                            }, 2000 + (index * 150)); 
                        });
                    }

                    if (certButtons) {
                        setTimeout(() => {
                            certButtons.classList.add('visible');
                        }, 2500); 
                    }
                    
                    certObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        certObserver.observe(certSection);
    }

const quoteBox = document.querySelector('.about-quote-box');
    const quoteTextElem = document.getElementById('quote-text');
    
    const quoteContent = '"I write code not just to build, but to build prime for myself"';
    
    let hasQuoteTyped = false;

    if (quoteBox && quoteTextElem) {
        const quoteObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasQuoteTyped) {
                    hasQuoteTyped = true;
                    
                    setTimeout(() => {
                        typeQuote(0);
                    }, 1000); 
                    
                    quoteObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        quoteObserver.observe(quoteBox);

        function typeQuote(index) {
            if (index < quoteContent.length) {
                quoteTextElem.textContent += quoteContent.charAt(index);
                
                const speed = Math.random() * 40 + 30; 
                
                setTimeout(() => {
                    typeQuote(index + 1);
                }, speed);
            }
        }
    }

const contactBtn = document.querySelector('.contact-icon');
    let notifyInterval;

    if (contactBtn) {
        
        function triggerNotification() {
            contactBtn.classList.remove('notify-jump');
            void contactBtn.offsetWidth; 
            
            contactBtn.classList.add('notify-jump');
            
            setTimeout(() => {
                contactBtn.classList.remove('notify-jump');
            }, 1000);
        }

        notifyInterval = setInterval(triggerNotification, 10000);
        
        contactBtn.addEventListener('click', () => {
            contactBtn.classList.remove('notify-jump');
            
            clearInterval(notifyInterval);
            
            notifyInterval = setInterval(triggerNotification, 30000);
        });
    }

const watermark = document.querySelector('.fixed-watermark');
    const targetSections = document.querySelectorAll('#project, #certificates');
    let visibleSections = new Set();

    if (watermark && targetSections.length > 0) {
        const wmObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibleSections.add(entry.target.id);
                } else {
                    visibleSections.delete(entry.target.id);
                }
            });

            if (visibleSections.size > 0) {
                watermark.classList.add('visible');
            } else {
                watermark.classList.remove('visible');
            }
        }, { threshold: 0.1 }); 

        targetSections.forEach(section => {
            wmObserver.observe(section);
        });
    }

document.addEventListener('DOMContentLoaded', () => {
    const mascotContainer = document.getElementById('mascot-container');
    const dialogueBox = document.getElementById('dialogue-box');
    const dialogueText = document.getElementById('dialogue-text');
    const allMascotImages = document.querySelectorAll('.mascot-img');
    const allSections = document.querySelectorAll('section, #contact'); 

    let isSpeaking = false;
    let dialogueTimeout;
    let typingInterval;

    const TYPING_SPEED_MS = 40;      
    const READ_TIME_MS = 2500;

    const ORIGINAL_SECTION_MSGS = {
        'home': [
            "Welcome to my Partner's Portfolio, User!",
            "Feel Free to explore!",
            "Ngl my partner is idiot, you know that."
        ],
        'about': [
            "Ah, the Experience! Numbers don't lie.",
            "Look at me with my partner. I'm actually spinning!",
            "Get to know my partner behind the screen."
        ],
        'project': [
            "Don't forget to shuffle the cards!",
            "These projects are built with passion. right partner?",
            "PROJECT PROJECT PROJECT PROJECT!"
        ],
        'certificates': [
            "Look at those achievements!",
            "Always learning, always growing.",
            "Certified and verified."
        ],
        'contact': [
            "Don't be shy, say hello!",
            "You and my PARTNER build something together.",
            "Markangelo's inbox is always open."
        ]
    };

    const ORIGINAL_CLICK_MSGS = [
        "Stop hitting me!",
        "Warning you!",
        "Ouch! That actually hurt.",
        "Do I look like a button to you?",
        "Hey! Watch the pixels.",
        "ARAY KO!",
        "STOP IT!!",
        "Please, personal space!!",
        "Why are you like this?"
    ];

    const ORIGINAL_GENERIC_MSGS = ["I am watching you scroll...", "Need a break?", "Stay hydrated!"];

    let sectionPools = JSON.parse(JSON.stringify(ORIGINAL_SECTION_MSGS));
    let clickPool = [...ORIGINAL_CLICK_MSGS];
    let genericPool = [...ORIGINAL_GENERIC_MSGS];

    function getUniqueMessage(poolArray, originalArray) {
        if (poolArray.length === 0) {
            poolArray.push(...originalArray);
        }

        const randomIndex = Math.floor(Math.random() * poolArray.length);
        
        const message = poolArray[randomIndex];
        
        poolArray.splice(randomIndex, 1);

        return message;
    }

    function typeWriter(text, index = 0) {
        if (index < text.length) {
            dialogueText.textContent += text.charAt(index);
            index++;
            typingInterval = setTimeout(() => typeWriter(text, index), TYPING_SPEED_MS);
        } else {
            dialogueTimeout = setTimeout(() => {
                hideDialogue();
            }, READ_TIME_MS);
        }
    }

    function hideDialogue() {
        dialogueBox.classList.remove('active');
        setTimeout(() => {
            dialogueText.textContent = "";
            isSpeaking = false;
            mascotContainer.classList.remove('state-speaking', 'state-reaction', 'state-transition', 'state-auto-talk');
        }, 300);
    }

    function playSectionDialogue(sectionId) {
        if (isSpeaking) return; 
        isSpeaking = true;

        let msg = "";
        
        if (sectionPools[sectionId]) {
            msg = getUniqueMessage(sectionPools[sectionId], ORIGINAL_SECTION_MSGS[sectionId]);
        } else {
            msg = getUniqueMessage(genericPool, ORIGINAL_GENERIC_MSGS);
        }

        mascotContainer.classList.add('state-auto-talk'); 
        dialogueText.textContent = "";
        dialogueBox.classList.add('active');
        typeWriter(msg);
    }

    function playClickSequence() {
        if (isSpeaking) return;
        isSpeaking = true;
        
        mascotContainer.classList.add('state-reaction');

        setTimeout(() => {
            mascotContainer.classList.remove('state-reaction');
            mascotContainer.classList.add('state-speaking'); 
            
            const msg = getUniqueMessage(clickPool, ORIGINAL_CLICK_MSGS);
            
            dialogueText.textContent = "";
            dialogueBox.classList.add('active');
            typeWriter(msg);

        }, 500); 
    }

    if (mascotContainer) {
        
        setTimeout(() => {
            
            mascotContainer.classList.add('mascot-show');

            allMascotImages.forEach(img => {
                img.addEventListener('click', playClickSequence);
            });

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            playSectionDialogue(entry.target.id);
                        }, 700); 
                    }
                });
            }, { threshold: 0.2 }); 

            allSections.forEach(section => {
                sectionObserver.observe(section);
            });

        }, 2500); 
    }
});

document.body.classList.add('loading-active');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

function finishLoading() {
    const loader = document.getElementById('loader-wrapper');
    if (!loader) return;
    
    if (loader.classList.contains('loaded')) return;

    loader.classList.add('loaded');
    
    document.body.classList.remove('loading-active');
}

window.addEventListener('load', () => {
    setTimeout(finishLoading, 3000); 
});

setTimeout(finishLoading, 6000);

document.addEventListener('DOMContentLoaded', () => {
    
    let isScrollingTimer;
    let isAutoScrolling = false; 
    
    const fixedSections = new Set(); 

    const allSections = document.querySelectorAll('section, #home, #about, #project, #certificates, #contact');

    window.addEventListener('scroll', () => {
        if (isAutoScrolling) return;
        
        window.clearTimeout(isScrollingTimer);


        isScrollingTimer = setTimeout(() => {
            snapToClosestSection();
        }, 700); 
    });

    function snapToClosestSection() {
        if (document.body.classList.contains('loading-active')) return;

        let closestSection = null;
        let minDistance = Infinity;

        allSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top); 

            if (distance < minDistance) {
                minDistance = distance;
                closestSection = section;
            }
        });

        if (closestSection) {
            
            const sectionId = closestSection.id || closestSection;

            if (!fixedSections.has(sectionId)) {
                
                fixedSections.add(sectionId);
                
                isAutoScrolling = true;
                
                closestSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                setTimeout(() => {
                    isAutoScrolling = false;
                }, 1000);
            }
        }
    }
});

const heroContent = document.querySelector('.home-content');
    const nameVisual = document.getElementById('name-visual');
    const creativeTitle = document.querySelector('.home-title'); 
    const homeDescElement = document.querySelector('.typing-desc'); 
    const homeButtons = document.querySelectorAll('.home-buttons a');
    
    let charSpans = [];
    if (nameVisual) {
        nameVisual.classList.add('intro-zoom');

        const text = nameVisual.textContent;
        nameVisual.innerHTML = ''; 
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.classList.add('char-anim');
            nameVisual.appendChild(span);
            charSpans.push(span);
        });
    }

    let homeDescText = "";
    if (homeDescElement) {
        homeDescText = homeDescElement.getAttribute('data-text') || homeDescElement.textContent;
        homeDescElement.textContent = ""; 
    }

    setTimeout(() => {
        
        if (heroContent) {
            heroContent.classList.add('visible');
        }

        if (charSpans.length > 0) {
            charSpans.forEach((span, index) => {
                setTimeout(() => {
                    span.classList.add('run-anim');
                }, index * 40); 
            });
            
            const nameDuration = charSpans.length * 40; 
            

            setTimeout(() => {
                
                if (nameVisual) {
                    nameVisual.classList.remove('intro-zoom');
                }

        
                setTimeout(() => {
                    
                    if (creativeTitle) {
                        creativeTitle.classList.add('drop-bounce');
                    }

                    setTimeout(() => {
                        
                        if (homeDescElement && homeDescText) {
                            typeHomeDesc(homeDescText, 0);
                        }

                        if (homeButtons.length > 0) {
                            homeButtons.forEach((btn, idx) => {
                                setTimeout(() => {
                                    btn.classList.add('btn-visible');
                                }, idx * 200); 
                            });
                        }

                    }, 1400); 

                }, 1000); 

            }, nameDuration + 1000); 
        }
        
    }, 3000); 

    function typeHomeDesc(text, index) {
        if (index < text.length) {
            homeDescElement.textContent += text.charAt(index);
            setTimeout(() => typeHomeDesc(text, index + 1), 20); 
        }
    }