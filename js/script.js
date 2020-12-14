'use strict';
'esversion: 6';


window.addEventListener('DOMContentLoaded', () => {

    //скрыть ненужные табы
    //показать нужный таб
    //создать обработчик событий, который будет манипулировать функциями

    const tabs = document.querySelectorAll('.tabheader__item'), //те три стиля питания
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items'); //родитель для последующего делегирования событий

    function hideTabContent() {
        tabsContent.forEach(tab => {
            tab.classList.add('hide');
            tab.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active'); //удаляем класс активности
        });
    }

    function showTabContent(i = 0) { //по умолчанию 0
        tabsContent[i].classList.add('show', 'fade'); //показать 
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('tabheader__item_active'); //добавляем класс активности, чтобы показывалось
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (ev) => { //обертка со всеми табами делегир одинаковое событие от клика на все
        const target = ev.target;
        if (target && target.classList.contains('tabheader__item')) { //ищем таб
            tabs.forEach((el, idx) => { //перебрать все табы
                if (target == el) { //сравнить табы с искомым
                    hideTabContent(); //скрыть старые табы
                    showTabContent(idx); //открыть новый искомый
                }
            });
        }
    });


    //функция устан таймер
    //определтя разницу во времени, дедлайн
    //вычислить время
    //найти разницу
    //обновление таймера

    const deadline = '2020-12-31';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - new Date(),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`; //добавляется 0 если число однозначное
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector), //вводится при вызове функции
            days = timer.querySelector('#days'), // # for searching айди
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock(); //для того, чтобы часы обновлялись сразу после обновления странцы без перескока

        function updateClock() {
            const t = getTimeRemaining(endtime); //обьект со всеми временами 
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            stopClock();

            function stopClock() {
                if (t.total <= 0) { //если сегодняшняя дата больше дедлайна
                    clearInterval(timeInterval); //интервал очищается дедлайн не считается
                }
            }
        }
    }
    setClock('.timer', deadline);

    //modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    modalTrigger.forEach(el => {
        el.addEventListener('click', modalOpen);
    });

    function modalOpen() {
        modal.classList.add('show');
        modal.classList.remove('hide');

        //modal.classList.toggle('show'); //если нет добавляем

        //modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; //экран за модальным окном не прокручивается
        clearInterval(modalTimerId); //после модала он не открывается еще раз
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');

        //modal.classList.toggle('show'); //если есть убираем

        //modal.style.display = 'none';
        document.body.style.overflow = ''; //вернуть прокрутку при закрытии модальног окна
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            //при клике на подложку или на крестик закрывается
            closeModal();
        }
    });

    document.addEventListener('keydown', (ev) => { //при нажатии на клавиатуру
        if (ev.code === 'Escape' && modal.style.display == 'block') {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(modalOpen, 50000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight == document.documentElement.scrollHeight) {
            modalOpen();
            removeEventListener('scroll', showModalByScroll); //после открытия один раз это событие удалыетс
        }
    }
    //window.pageYOffset сколько пролистал 
    //document.documentElement.clientHeight видимая часть для клиента

    window.addEventListener('scroll', showModalByScroll);

    class FoodCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAN();
        }
        changeToUAN() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
            this.parent.append(element);
        }
    }

    new FoodCard(
        'img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей.  Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
    ).render();

    new FoodCard(
        'img/tabs/elite.jpg',
        'elite',
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        13,
        '.menu .container',
        'menu__item'
    ).render();

    new FoodCard(
        'img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        12,
        '.menu .container',
        'menu__item'
    ).render();

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с Вами свяжемся',
        fail: 'Что-то пошло не так.',
    };

    forms.forEach(el => {
        postData(el);
    });

    function postData(form) {
        form.addEventListener('submit', (ev) => {
            ev.preventDefault(); //без перезагрузки страницы

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto; 
            `; //по центру

            form.insertAdjacentElement('afterend', statusMessage); //вставка изображения под формой(после нее)

            const formData = new FormData(form); //собираем все данные из формы
            //если данные идут на сервер то в html inputa нужно всегда указывать name

            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });

            //request.send(formData); //без json
            //request.send(json);

            fetch('server.php', { //отправляем эти данные 
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset = UTF-8'
                    },
                    body: JSON.stringify(object)
                })
                .then(data => data.text())
                .then(data => {
                    console.log(data); //результат ответа из сервера
                    showThanksModal(message.success); //показать сообщение пользователю что все хорошо
                    statusMessage.remove();
                }).catch(() => { //в плохом случае
                    showThanksModal(message.fail); //показать сообщ что всё плохо
                }).finally(() => { // в любом случае
                    form.reset(); //сбрасывем форму
                });
        });
    }

    function showThanksModal(message) {
        const prevModal = document.querySelector('.modal__dialog');
        prevModal.classList.add('hide');
        modalOpen();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        modal.append(thanksModal);

        setTimeout(() => {
            thanksModal.remove(); //посл 4сек удалется окно благодарн
            prevModal.classList.add('show'); //и возвращается норм модал
            prevModal.classList.remove('hide'); //на будушее если его снова откроют
            closeModal(); //и закрывается модалка вообще
        }, 40000);
    }
    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
    
});