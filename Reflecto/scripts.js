document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. НАВІГАЦІЯ ПО ВКЛАДКАХ ---
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('pageTitle');
    const pageHeader = document.getElementById('pageHeader');

    // Заголовки для різних сторінок
    const titles = {
        'compass': 'Привіт! Готовий звільнити голову?',
        'reflectorium': 'Твій простір думок',
        'stats': 'Твій прогрес та аналітика',
        'archive': 'Архів записів'
    };

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Прибираємо активний клас у всіх кнопок
            menuItems.forEach(link => link.classList.remove('active'));
            // 2. Додаємо активний клас натиснутій кнопці
            item.classList.add('active');

            // 3. Отримуємо ціль (наприклад, "stats")
            const target = item.getAttribute('data-target');

            // 4. Ховаємо всі секції
            sections.forEach(section => section.classList.add('hidden-section'));

            // 5. Показуємо потрібну секцію
            const activeSection = document.getElementById(`section-${target}`);
            if (activeSection) {
                activeSection.classList.remove('hidden-section');
            }

            // 6. Оновлюємо заголовки
            pageTitle.textContent = item.innerText.trim();
            pageHeader.textContent = titles[target] || 'Reflecto';
        });
    });


    // --- 2. ГРАФІК (Тільки якщо елемент існує) ---
    const chartCanvas = document.getElementById('moodChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        let gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(253, 203, 110, 0.5)');
        gradient.addColorStop(1, 'rgba(253, 203, 110, 0.0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
                datasets: [{
                    label: 'Ясність',
                    data: [4, 5, 6, 5, 8, 7, 9],
                    borderColor: '#fdcb6e',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#fdcb6e'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 10, grid: { color: '#f0f0f0' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // --- 3. ЗБЕРЕЖЕННЯ НОТАТКИ ---
    const saveBtn = document.getElementById('saveBtn');
    const inputArea = document.getElementById('thoughtInput');
    const notesListWidget = document.getElementById('notesListWidget'); // На головній
    const fullNotesList = document.getElementById('fullNotesList');   // В Рефлекторії

    if(saveBtn) {
        saveBtn.addEventListener('click', () => {
            const text = inputArea.value.trim();
            if (text) {
                const now = new Date();
                const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // HTML шаблон для нотатки
                const noteHTML = `
                    <div class="item-icon color-1"><i class="fa-solid fa-pen"></i></div>
                    <div class="item-content">
                        <span class="title">${text.substring(0, 30)}${text.length > 30 ? '...' : ''}</span>
                        <span class="time">Сьогодні, ${timeString}</span>
                        ${text.length > 30 ? `<p style="font-size:12px; color:#888;">${text}</p>` : ''}
                    </div>
                `;

                // Створюємо елементи
                const liWidget = document.createElement('li');
                liWidget.className = 'activity-item';
                liWidget.innerHTML = noteHTML;

                const liFull = document.createElement('li');
                liFull.className = 'activity-item';
                liFull.innerHTML = noteHTML;

                // Додаємо в обидва списки (на головну і в рефлекторій)
                if(notesListWidget) notesListWidget.prepend(liWidget);
                if(fullNotesList) fullNotesList.prepend(liFull);

                // Очищення
                inputArea.value = '';
                saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Збережено';
                setTimeout(() => { saveBtn.innerText = 'Зберегти в Рефлекторій'; }, 2000);
            }
        });
    }
});