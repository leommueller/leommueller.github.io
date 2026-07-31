document.addEventListener('DOMContentLoaded', () => {
  const videoList = [
    'IMG_2042_web.webm',
    'IMG_2048_web.webm'
  ];

  const video = document.getElementById('bg-video');
  const circleBtn = document.getElementById('circle-btn');
  const infoCols = document.querySelectorAll('.hide-when-inactive');
  const nameDetail = document.querySelector('.name-detail');
  
  // Contact Links
  const mobileLink = document.getElementById('mobile-link');
  const emailLink = document.getElementById('email-link');
  const instaLink = document.getElementById('insta-link');

  // Favicon SVGs (Normal: r=50, Shrunk: r=32.5 matching scale(0.65))
  const favIconNormal = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e5e5e5'/%3E%3C/svg%3E";
  const favIconShrunk = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='32.5' fill='%23e5e5e5'/%3E%3C/svg%3E";

  // Safari-safe favicon update function
  function updateFavicon(iconUrl) {
    let existingFavicon = document.getElementById('favicon');
    if (existingFavicon) {
      existingFavicon.remove();
    }
    const newFavicon = document.createElement('link');
    newFavicon.id = 'favicon';
    newFavicon.rel = 'icon';
    newFavicon.type = 'image/svg+xml';
    newFavicon.href = iconUrl;
    document.head.appendChild(newFavicon);
  }

  // Check user motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fade in page and initialize layout transitions safely
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
    // Prevents the dot from animating on mobile during page reload
    setTimeout(() => {
      document.body.classList.add('layout-ready');
    }, 150);
  });

  // Pick random video
  const randomVideo = videoList[Math.floor(Math.random() * videoList.length)];
  video.src = randomVideo;
  video.load(); 

  function handleVideoSetup() {
    if (video.duration && !isNaN(video.duration)) {
      if (!video.dataset.randomized) {
        video.dataset.randomized = "true";
        if (!prefersReducedMotion) {
          video.currentTime = Math.random() * video.duration;
        }
      }
    }
    video.play().catch(() => {});
  }

  video.addEventListener('loadedmetadata', handleVideoSetup);
  if (video.readyState >= 1) {
    handleVideoSetup();
  }

  const revealVideo = () => video.classList.add('loaded');
  video.addEventListener('playing', revealVideo);
  video.addEventListener('canplaythrough', revealVideo);
  
  setTimeout(() => {
    if (video.readyState >= 3) revealVideo();
  }, 300);

  // Optimized Temporal Jumps
  function initTemporalJumps() {
    if (prefersReducedMotion || !video.duration || isNaN(video.duration)) return;

    function scheduleNextJump() {
      const randomInterval = Math.random() * 6000 + 4000; 
      setTimeout(() => {
        const executeJump = () => {
          if (!video.paused) {
            video.currentTime = Math.random() * video.duration;
          }
          scheduleNextJump();
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(executeJump, { timeout: 1000 });
        } else {
          requestAnimationFrame(executeJump);
        }
      }, randomInterval);
    }
    video.addEventListener('playing', scheduleNextJump, { once: true });
  }

  video.addEventListener('loadedmetadata', initTemporalJumps);
  if (video.readyState >= 1) initTemporalJumps();

  // Toggle info panel, accessibility states, and Safari-safe favicon
  function toggleInfoPanel() {
    const isBodyActive = document.body.classList.contains('info-active');
    circleBtn.setAttribute('aria-expanded', !isBodyActive);
    
    if (isBodyActive) {
      document.body.classList.remove('info-active');
      infoCols.forEach(col => col.setAttribute('aria-hidden', 'true'));
      nameDetail.setAttribute('aria-hidden', 'true');
      updateFavicon(favIconNormal); 
    } else {
      document.body.classList.add('info-active');
      infoCols.forEach(col => col.setAttribute('aria-hidden', 'false'));
      nameDetail.setAttribute('aria-hidden', 'false');
      updateFavicon(favIconShrunk); 
    }
  }

  circleBtn.addEventListener('click', toggleInfoPanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('info-active')) {
      toggleInfoPanel();
    }
  });

  // Anti-scraping obfuscation triggers
  function triggerMobile() {
    const m1 = "+41";
    const m2 = "76";
    const m3 = "232";
    const m4 = "0131";
    window.location.href = "tel" + ":" + m1 + m2 + m3 + m4;
  }

  function triggerEmail() {
    const p1 = "info";
    const p2 = "leomueller";
    const p3 = "xyz"; 
    window.location.href = "mail" + "to:" + p1 + String.fromCharCode(64) + p2 + "." + p3;
  }

  function triggerInsta() {
    const i1 = "https://www";
    const i2 = ".instagram.com/";
    const i3 = "leomarcel_";
    window.open(i1 + i2 + i3, "_blank", "noopener,noreferrer");
  }

  // Assign Click Events
  if (mobileLink) mobileLink.addEventListener('click', triggerMobile);
  if (emailLink) emailLink.addEventListener('click', triggerEmail);
  if (instaLink) instaLink.addEventListener('click', triggerInsta);
});
