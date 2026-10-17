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

    const analyticsContent = document.getElementById('analyticsContent');
    const analyticsWindow = document.getElementById('analyticsWindow');
    analyticsWindow.querySelectorAll('[data-analytics-tab]').forEach((button) => button.addEventListener('click', () => {
      analyticsWindow.querySelectorAll('[data-analytics-tab]').forEach((tab) => tab.classList.toggle('active', tab === button));
      analyticsContent.querySelectorAll('[data-analytics-page]').forEach((page) => page.classList.toggle('active', page.dataset.analyticsPage === button.dataset.analyticsTab));
    }));
    analyticsContent.querySelectorAll('[data-analytics-go]').forEach((button) => button.addEventListener('click', () => {
      analyticsWindow.querySelector('[data-analytics-tab="projects"]').click();
    }));

    const projectSearch = document.getElementById('projectSearch');
    const projectCards = [...document.querySelectorAll('.analytics-project')];
    const projectFilters = [...document.querySelectorAll('[data-project-filter]')];
    let activeProjectFilter = 'all';
    function filterAnalyticsProjects() {
      const query = projectSearch.value.trim().toLowerCase();
      let visibleCount = 0;
      projectCards.forEach((card) => {
        const matchesFilter = activeProjectFilter === 'all' || card.dataset.tools.includes(activeProjectFilter);
        const matchesQuery = card.textContent.toLowerCase().includes(query);
        card.hidden = !(matchesFilter && matchesQuery);
        if (!card.hidden) visibleCount += 1;
      });
      document.getElementById('projectEmpty').hidden = visibleCount !== 0;
    }
    projectSearch.addEventListener('input', filterAnalyticsProjects);
    projectFilters.forEach((button) => button.addEventListener('click', () => {
      activeProjectFilter = button.dataset.projectFilter;
      projectFilters.forEach((filter) => filter.classList.toggle('active', filter === button));
      filterAnalyticsProjects();
    }));

    const excelRecommendations = document.getElementById('excelRecommendations');
    const recommendationsStatus = document.getElementById('recommendationsStatus');
    try {
      excelRecommendations.value = localStorage.getItem('oyinola-excel-recommendations') || '';
    } catch {
      recommendationsStatus.textContent = 'Recommendations could not be loaded from this browser.';
    }
    excelRecommendations.addEventListener('input', () => {
      try {
        localStorage.setItem('oyinola-excel-recommendations', excelRecommendations.value);
        recommendationsStatus.textContent = 'Recommendations saved in this browser.';
      } catch {
        recommendationsStatus.textContent = 'Could not save recommendations in this browser.';
      }
    });

    const powerbiRecommendations = document.getElementById('powerbiRecommendations');
    const powerbiRecommendationsStatus = document.getElementById('powerbiRecommendationsStatus');
    try {
      powerbiRecommendations.value = localStorage.getItem('oyinola-powerbi-recommendations') || '';
    } catch {
      powerbiRecommendationsStatus.textContent = 'Recommendations could not be loaded from this browser.';
    }
    powerbiRecommendations.addEventListener('input', () => {
      try {
        localStorage.setItem('oyinola-powerbi-recommendations', powerbiRecommendations.value);
        powerbiRecommendationsStatus.textContent = 'Recommendations saved in this browser.';
      } catch {
        powerbiRecommendationsStatus.textContent = 'Could not save recommendations in this browser.';
      }
    });

    const skillSaveStatus = document.getElementById('skillSaveStatus');
    document.querySelectorAll('[data-skill-description]').forEach((description) => {
      try {
        const savedDescription = localStorage.getItem(`oyinola-skill-${description.dataset.skillDescription}`);
        if (savedDescription !== null) description.textContent = savedDescription;
      } catch {
        skillSaveStatus.textContent = 'Saved descriptions could not be loaded from this browser.';
      }
      description.addEventListener('input', () => {
        try {
          localStorage.setItem(`oyinola-skill-${description.dataset.skillDescription}`, description.textContent.trim());
          skillSaveStatus.textContent = 'Description saved in this browser.';
        } catch {
          skillSaveStatus.textContent = 'Could not save this description in this browser.';
        }
      });
    });

    const notepadText = document.getElementById('notepadText');
    const notepadStatus = document.getElementById('notepadStatus');
    try {
      notepadText.value = localStorage.getItem('oyinola-notepad') || '';
    } catch {
      notepadStatus.textContent = 'Notes could not be loaded from this browser.';
    }
    notepadText.addEventListener('input', () => {
      try {
        localStorage.setItem('oyinola-notepad', notepadText.value);
        notepadStatus.textContent = 'Saved in this browser.';
      } catch {
        notepadStatus.textContent = 'Could not save notes in this browser.';
      }
    });
    document.getElementById('clearNote').addEventListener('click', () => {
      notepadText.value = '';
      notepadText.dispatchEvent(new Event('input'));
      notepadText.focus();
    });

    const chartMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const chartData = {
      analysis: [4, 6, 3, 7, 5, 8],
      visualization: [2, 4, 5, 3, 6, 5]
    };
    const visibleChartSeries = new Set(['analysis', 'visualization']);
    function renderSampleChart() {
      const chart = document.getElementById('sampleChart');
      const plot = { left: 46, top: 18, width: 650, height: 220 };
      const bottom = plot.top + plot.height;
      const scale = plot.height / 10;
      let markup = '';
      for (let tick = 0; tick <= 10; tick += 2) {
        const y = bottom - tick * scale;
        markup += `<line class="chart-grid-line" x1="${plot.left}" y1="${y}" x2="${plot.left + plot.width}" y2="${y}"></line><text class="chart-label" x="${plot.left - 12}" y="${y + 4}" text-anchor="end">${tick}</text>`;
      }
      chartMonths.forEach((month, index) => {
        const groupWidth = plot.width / chartMonths.length;
        const center = plot.left + groupWidth * (index + .5);
        markup += `<text class="chart-label" x="${center}" y="${bottom + 24}" text-anchor="middle">${month}</text>`;
        [
          { key: 'analysis', className: 'chart-bar-analysis', offset: -14 },
          { key: 'visualization', className: 'chart-bar-visualization', offset: 14 }
        ].forEach((series) => {
          if (!visibleChartSeries.has(series.key)) return;
          const value = chartData[series.key][index];
          const height = value * scale;
          const x = center + series.offset - 10;
          const y = bottom - height;
          const label = series.key === 'analysis' ? 'Analysis' : 'Visualization';
          markup += `<rect class="${series.className}" x="${x}" y="${y}" width="20" height="${height}" rx="3"><title>${label}, ${month}: ${value} sample units</title></rect>`;
        });
      });
      chart.innerHTML = markup;
    }
    renderSampleChart();
    document.querySelectorAll('[data-chart-series]').forEach((button) => button.addEventListener('click', () => {
      const series = button.dataset.chartSeries;
      if (visibleChartSeries.has(series)) visibleChartSeries.delete(series);
      else visibleChartSeries.add(series);
      button.classList.toggle('active', visibleChartSeries.has(series));
      renderSampleChart();
    }));

    const ticBoard = document.querySelector('.tic-board');
    const ticStatus = document.getElementById('ticStatus');
    let ticCells = Array(9).fill('');
    let ticTurn = 'X';
    let ticFinished = false;
    const ticWinningLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    function renderTicBoard() {
      ticBoard.innerHTML = '';
      ticCells.forEach((mark, index) => {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'tic-cell';
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `Square ${index + 1}${mark ? `, ${mark}` : ', empty'}`);
        cell.textContent = mark;
        cell.disabled = Boolean(mark) || ticFinished;
        cell.addEventListener('click', () => playTicTurn(index));
        ticBoard.append(cell);
      });
    }
    function playTicTurn(index) {
      if (ticFinished || ticCells[index]) return;
      ticCells[index] = ticTurn;
      const winner = ticWinningLines.some((line) => line.every((cell) => ticCells[cell] === ticTurn));
      if (winner) {
        ticFinished = true;
        ticStatus.textContent = `${ticTurn} wins! Start a new game to play again.`;
      } else if (ticCells.every(Boolean)) {
        ticFinished = true;
        ticStatus.textContent = "It's a draw. Start a new game to play again.";
      } else {
        ticTurn = ticTurn === 'X' ? 'O' : 'X';
        ticStatus.textContent = `${ticTurn}'s turn`;
      }
      renderTicBoard();
    }
    function resetTicBoard() {
      ticCells = Array(9).fill('');
      ticTurn = 'X';
      ticFinished = false;
      ticStatus.textContent = "X's turn";
      renderTicBoard();
    }
    document.getElementById('ticReset').addEventListener('click', resetTicBoard);
    resetTicBoard();

    const memoryBoard = document.querySelector('.memory-board');
    const memoryStatus = document.getElementById('memoryStatus');
    const memoryMoves = document.getElementById('memoryMoves');
    const memorySymbols = ['●', '▲', '◆', '★', '♥', '✿', '☀', '■'];
    let memoryCards = [];
    let flippedCards = [];
    let memoryMatches = 0;
    let memoryMoveCount = 0;
    let memoryLocked = false;
    let memoryRound = 0;
    function renderMemoryBoard() {
      memoryBoard.innerHTML = '';
      memoryCards.forEach((symbol, index) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `memory-card${card.dataset.flipped ? ' flipped' : ''}`;
        const isFlipped = flippedCards.includes(index) || card.classList.contains('matched');
        card.textContent = isFlipped ? symbol : '?';
        card.setAttribute('aria-label', isFlipped ? `Card ${index + 1}: ${symbol}` : `Hidden card ${index + 1}`);
        card.addEventListener('click', () => flipMemoryCard(index));
        memoryBoard.append(card);
      });
    }
    function flipMemoryCard(index) {
      if (memoryLocked || flippedCards.includes(index) || memoryBoard.children[index].classList.contains('matched')) return;
      flippedCards.push(index);
      const card = memoryBoard.children[index];
      card.classList.add('flipped');
      card.textContent = memoryCards[index];
      card.setAttribute('aria-label', `Card ${index + 1}: ${memoryCards[index]}`);
      if (flippedCards.length < 2) return;
      memoryMoveCount += 1;
      memoryMoves.textContent = `Moves: ${memoryMoveCount}`;
      const [firstIndex, secondIndex] = flippedCards;
      if (memoryCards[firstIndex] === memoryCards[secondIndex]) {
        [firstIndex, secondIndex].forEach((cardIndex) => memoryBoard.children[cardIndex].classList.add('matched'));
        memoryMatches += 1;
        flippedCards = [];
        if (memoryMatches === memorySymbols.length) memoryStatus.textContent = `You found every pair in ${memoryMoveCount} moves!`;
        return;
      }
      memoryLocked = true;
      memoryStatus.textContent = 'Not a match—try again.';
      const currentRound = memoryRound;
      window.setTimeout(() => {
        if (currentRound !== memoryRound) return;
        flippedCards.forEach((cardIndex) => {
          const unmatchedCard = memoryBoard.children[cardIndex];
          unmatchedCard.classList.remove('flipped');
          unmatchedCard.textContent = '?';
          unmatchedCard.setAttribute('aria-label', `Hidden card ${cardIndex + 1}`);
        });
        flippedCards = [];
        memoryLocked = false;
        memoryStatus.textContent = 'Find all matching pairs.';
      }, 800);
    }
    function resetMemoryGame() {
      memoryRound += 1;
      memoryCards = [...memorySymbols, ...memorySymbols];
      for (let index = memoryCards.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [memoryCards[index], memoryCards[swapIndex]] = [memoryCards[swapIndex], memoryCards[index]];
      }
      flippedCards = [];
      memoryMatches = 0;
      memoryMoveCount = 0;
      memoryLocked = false;
      memoryStatus.textContent = 'Find all matching pairs.';
      memoryMoves.textContent = 'Moves: 0';
      renderMemoryBoard();
    }
    document.getElementById('memoryReset').addEventListener('click', resetMemoryGame);
    resetMemoryGame();
    document.querySelectorAll('[data-game-tab]').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('[data-game-tab]').forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      document.querySelectorAll('[data-game-panel]').forEach((panel) => {
        const active = panel.dataset.gamePanel === button.dataset.gameTab;
        panel.classList.toggle('active', active);
        panel.hidden = !active;
      });
    }));
