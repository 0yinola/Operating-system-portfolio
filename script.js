const lockScreen = document.getElementById('lockScreen');
    const desktop = document.getElementById('desktop');
    const startMenu = document.getElementById('startMenu');
    const calendarPopover = document.getElementById('calendarPopover');
    const notification = document.getElementById('notification');
    const wallpaper = document.getElementById('wallpaper');
    const windows = [...document.querySelectorAll('.window')];
    let signedIn = false;

    function updateClock() {
      const now = new Date();
      const time = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
      const day = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
      const shortDate = new Intl.DateTimeFormat(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' });
      document.getElementById('lockClock').textContent = time.format(now);
      document.getElementById('lockDate').textContent = day.format(now);
      document.getElementById('taskbarClock').textContent = time.format(now);
      document.getElementById('taskbarDate').textContent = shortDate.format(now);
      document.getElementById('calendarDate').textContent = now.getDate();
      document.getElementById('calendarFullDate').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', year: 'numeric' }).format(now);
    }
    updateClock();
    setInterval(updateClock, 15000);

    function signIn() {
      if (signedIn) return;
      signedIn = true;
      lockScreen.classList.add('is-hidden');
      desktop.classList.add('is-visible');
      document.getElementById('welcomeToast').style.animation = 'toast-in .45s both';
      window.setTimeout(() => document.getElementById('workWindow').classList.add('is-open'), 450);
    }
    document.getElementById('enterButton').addEventListener('click', signIn);
    lockScreen.addEventListener('click', (event) => { if (event.target === lockScreen) signIn(); });
    document.addEventListener('keydown', (event) => {
      if (!signedIn && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); signIn(); }
      if (event.key === 'Escape') closePopovers();
    });

    function closePopovers() {
      startMenu.classList.remove('is-open');
      calendarPopover.classList.remove('is-open');
      notification.classList.remove('is-open');
      document.getElementById('startButton').classList.remove('active');
    }
    function openWindow(id) {
      closePopovers();
      windows.forEach((item) => item.classList.remove('is-open'));
      const target = document.getElementById(id);
      target.classList.add('is-open');
      document.querySelectorAll('.taskbar-button[data-open]').forEach((button) => button.classList.toggle('app-open', button.dataset.open === id));
    }
    document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => openWindow(button.dataset.open)));
    windows.forEach((win) => {
      win.querySelector('.close').addEventListener('click', () => {
        win.classList.remove('is-open', 'maximized');
        document.querySelectorAll(`.taskbar-button[data-open="${win.id}"]`).forEach((button) => button.classList.remove('app-open'));
      });
      win.querySelector('.minimize').addEventListener('click', () => win.classList.remove('is-open'));
      win.querySelector('.maximize').addEventListener('click', () => win.classList.toggle('maximized'));
    });

    document.getElementById('startButton').addEventListener('click', () => {
      const isOpen = startMenu.classList.toggle('is-open');
      document.getElementById('startButton').classList.toggle('active', isOpen);
      calendarPopover.classList.remove('is-open');
      notification.classList.remove('is-open');
      if (isOpen) document.getElementById('startSearch').focus();
    });
    document.getElementById('startSearch').addEventListener('input', (event) => {
      const query = event.target.value.trim().toLowerCase();
      document.querySelectorAll('.start-app').forEach((app) => { app.hidden = query !== '' && !app.textContent.toLowerCase().includes(query); });
    });
    document.getElementById('clockButton').addEventListener('click', () => {
      calendarPopover.classList.toggle('is-open');
      startMenu.classList.remove('is-open');
      notification.classList.remove('is-open');
    });
    document.getElementById('notificationButton').addEventListener('click', () => {
      notification.classList.toggle('is-open');
      startMenu.classList.remove('is-open');
      calendarPopover.classList.remove('is-open');
    });
    document.getElementById('wifiButton').addEventListener('click', () => {
      notification.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 8.8a15 15 0 0 1 20 0M5 12a10.5 10.5 0 0 1 14 0m-11 3.2a6 6 0 0 1 8 0M12 19h.01"/></svg><div>Network connected<br><span>You are browsing Oyinola OS</span></div>';
      notification.classList.toggle('is-open');
      startMenu.classList.remove('is-open');
      calendarPopover.classList.remove('is-open');
    });
    document.getElementById('powerButton').addEventListener('click', () => {
      closePopovers();
      windows.forEach((win) => win.classList.remove('is-open', 'maximized'));
      signedIn = false;
      desktop.classList.remove('is-visible');
      lockScreen.classList.remove('is-hidden');
    });
    document.getElementById('toastClose').addEventListener('click', () => document.getElementById('welcomeToast').remove());

    document.querySelectorAll('.wallpaper-option').forEach((button) => button.addEventListener('click', () => {
      wallpaper.dataset.wallpaper = button.dataset.choice;
      document.querySelectorAll('.wallpaper-option').forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
      try { localStorage.setItem('oyinola-wallpaper', button.dataset.choice); } catch {}
    }));
    document.querySelectorAll('[data-theme]').forEach((button) => button.addEventListener('click', () => {
      document.body.classList.toggle('light-theme', button.dataset.theme === 'light');
      document.querySelectorAll('[data-theme]').forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
      try { localStorage.setItem('oyinola-theme', button.dataset.theme); } catch {}
    }));
    document.querySelectorAll('[data-settings-tab]').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('[data-settings-tab]').forEach((item) => item.classList.toggle('active', item === button));
      const content = document.getElementById('settingsContent');
      const tab = button.dataset.settingsTab;
      if (tab === 'personalization') {
        content.innerHTML = '<h2>Personalize your desktop</h2><p>Choose a wallpaper and set your preferred appearance.</p><div class="setting-row"><div><h3>Wallpaper</h3><p>Pick a background for your desktop.</p></div><div class="wallpaper-options" aria-label="Choose wallpaper"><button class="wallpaper-option" data-choice="mountain" aria-label="Mountain wallpaper"></button><button class="wallpaper-option" data-choice="coast" aria-label="Coast wallpaper"></button><button class="wallpaper-option" data-choice="city" aria-label="City wallpaper"></button><button class="wallpaper-option" data-choice="forest" aria-label="Forest wallpaper"></button></div></div><div class="setting-row"><div><h3>Appearance</h3><p>Choose light or dark mode.</p></div><div class="theme-toggle"><button data-theme="dark">Dark</button><button data-theme="light">Light</button></div></div>';
        content.querySelectorAll('.wallpaper-option').forEach((option) => {
          option.setAttribute('aria-pressed', String(option.dataset.choice === wallpaper.dataset.wallpaper));
          option.addEventListener('click', () => {
            wallpaper.dataset.wallpaper = option.dataset.choice;
            content.querySelectorAll('.wallpaper-option').forEach((item) => item.setAttribute('aria-pressed', String(item === option)));
            try { localStorage.setItem('oyinola-wallpaper', option.dataset.choice); } catch {}
          });
        });
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        content.querySelectorAll('[data-theme]').forEach((option) => {
          option.setAttribute('aria-pressed', String(option.dataset.theme === currentTheme));
          option.addEventListener('click', () => {
            document.body.classList.toggle('light-theme', option.dataset.theme === 'light');
            content.querySelectorAll('[data-theme]').forEach((item) => item.setAttribute('aria-pressed', String(item === option)));
            try { localStorage.setItem('oyinola-theme', option.dataset.theme); } catch {}
          });
        });
      } else if (tab === 'display') {
        content.innerHTML = '<h2>Display</h2><p>Your desktop, just the way you like it.</p><div class="setting-row"><div><h3>Screen resolution</h3><p>Adapts to your current screen.</p></div><span class="work-count">Automatic</span></div><div class="setting-row"><div><h3>Window animations</h3><p>Motion respects your device preferences.</p></div><span class="work-count">Enabled</span></div>';
      } else {
        content.innerHTML = '<h2>About Oyinola OS</h2><p>A portfolio with a desktop point of view.</p><div class="setting-row"><div><h3>Made by</h3><p>Oyinola</p></div><span class="work-count">Portfolio edition</span></div><div class="setting-row"><div><h3>Built with</h3><p>HTML, CSS & JavaScript</p></div><span class="work-count">Version 1.0</span></div>';
      }
    }));
    try {
      const savedWallpaper = localStorage.getItem('oyinola-wallpaper');
      const savedTheme = localStorage.getItem('oyinola-theme');
      if (savedWallpaper) {
        wallpaper.dataset.wallpaper = savedWallpaper;
        document.querySelector(`.wallpaper-option[data-choice="${savedWallpaper}"]`)?.setAttribute('aria-pressed', 'true');
        document.querySelectorAll('.wallpaper-option').forEach((option) => { if (option.dataset.choice !== savedWallpaper) option.setAttribute('aria-pressed', 'false'); });
      }
      if (savedTheme) {
        document.body.classList.toggle('light-theme', savedTheme === 'light');
        document.querySelector(`[data-theme="${savedTheme}"]`)?.setAttribute('aria-pressed', 'true');
        document.querySelectorAll('[data-theme]').forEach((option) => { if (option.dataset.theme !== savedTheme) option.setAttribute('aria-pressed', 'false'); });
      }
    } catch {}
