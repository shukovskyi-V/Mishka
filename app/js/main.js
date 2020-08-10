{
    let navMain = document.querySelector(".main-nav"),
        navToggle = document.querySelector(".main-nav__toggle");


    navToggle.addEventListener("click", function () {
        navMain.classList.contains("main-nav--closed") ? (navMain.classList.remove("main-nav--closed"),
            navMain.classList.add("main-nav--opened"), navToggle.classList.remove("main-nav__toggle--closed"),
            navToggle.classList.add("main-nav__toggle--opened")) : (navMain.classList.add("main-nav--closed"),
            navMain.classList.remove("main-nav--opened"), navToggle.classList.add("main-nav__toggle--closed"),
            navToggle.classList.remove("main-nav__toggle--opened"));
    });
}

{
    let popup = document.querySelector(".modal__order"),
        overlay = document.querySelector(".modal__overlay"),
        orderBtn = document.querySelector(".features__order-btn");

    function showPopup() {
        orderBtn.addEventListener("click", function (e) {
            e.preventDefault();
            popup.classList.add("modal__order--show");
            overlay.classList.add("modal__overlay--show");
            document.body.style.overflow = 'hidden';
        });

        overlay.addEventListener("click", function (e) {
            popup.classList.remove("modal__order--show");
            overlay.classList.remove("modal__overlay--show");
            document.body.style.overflow = '';
        });
        window.addEventListener("keydown", function (e) {
            if (e.keyCode === 27 && popup.classList.contains("modal__order--show")) {
                popup.classList.remove("modal__order--show");
                overlay.classList.remove("modal__overlay--show");
                document.body.style.overflow = '';
            }
        });

    }

    if (orderBtn) {
        showPopup();
    }
}
{
    let slideIndex = 1,
        slides = document.querySelectorAll('.comment__item'),
        arrowPrev = document.querySelector('.comment__slider-btn--prev'),
        arrowNext = document.querySelector('.comment__slider-btn--next');

    console.log(slides.length);

    function showSlides(n) {
        console.log('show slides work');
        if (n > slides.length) {
            slideIndex = 1;
        } else if (n < 1) {
            slideIndex = slides.length;
        }
        slides.forEach((item) => item.style.display = 'none');
        slides[slideIndex - 1].style.display = 'block';
    }

    if (slides.length >= 1) {
        showSlides(slideIndex);
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    if (arrowNext) {
        arrowNext.addEventListener('click', () => {
            plusSlides(1);
        });
    }
    if (arrowPrev) {
        arrowPrev.addEventListener('click', () => {
            plusSlides(-1);
        });
    }
}

{
    let basketValue = 0,
        basketCount = 0,
        cardOrderItem = document.querySelectorAll('.catalog-list__item'),
        basketElem = document.querySelector('.main-nav--basket');

    basketValue = JSON.parse(localStorage.getItem('localBasketValue'));
    basketCount = JSON.parse(localStorage.getItem('localBasketCount'));

    if (basketCount > 0 && basketValue > 0) {
        basketElem.textContent = `${basketValue} руб, ${basketCount} товаров`;
    }

    cardOrderItem.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            let thisItem = this.querySelector('.catalog-list__info-price');
            let price = thisItem.dataset.price;
            if (e.target === this.querySelector('.btn__order') || e.target === this.querySelector('.btn__order>svg')) {
                basketCount++;
                basketValue = basketValue + parseInt(price);
                localStorage.setItem('localBasketValue', basketValue);
                localStorage.setItem('localBasketCount', basketCount);
                basketValue = JSON.parse(localStorage.getItem('localBasketValue'));
                basketCount = JSON.parse(localStorage.getItem('localBasketCount'));
                basketElem.textContent = `${basketValue} руб, ${basketCount} товаров`;
            }
        })
    });
}

function requestForm(elem) {
    let formAnswer = document.querySelector('.order__required');

    elem.addEventListener('submit', (event) => {
        event.preventDefault();
        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        const formData = new FormData(elem);

        let jsonObject = {};

        for (const [key, value] of formData.entries()) {
            jsonObject[key] = value;
        }
        let json = JSON.stringify(jsonObject);
        request.send(json);
        request.addEventListener('readystatechange', function () {
            if(request.readyState < 4){
                console.log('readyState < 4');
                formAnswer.textContent = 'Отправка данних...';
            }else if (request.readyState === 4 && request.status === 200){
                console.log('readyState === 200');
                formAnswer.textContent = 'Ваша заявка отправлена, ожидайте ответ';
            }else {
                console.log('readyState is bug');
            }
        })
    });
}

if (document.querySelector('.order__form')) {
    requestForm(document.querySelector('.order__form'));
}
