window.onload = function () {
    console.log('Страница загружена');


    let inputFullName = document.getElementById('input-full-name');
    inputFullName.onkeydown = (e) => {

        let number = parseInt(e.key);
        if (isNaN(number)) {
            return true;
        } else {
            e.preventDefault();
        }
        alert('Нельзя вводить цифры');
    }

    let inputUserName = document.getElementById('user-name');
    inputUserName.onkeydown = (e) => {
        if (e.key !== '.' && e.key !== ',') {
            return true;
        } else {
            e.preventDefault();
        }
        alert('Нельзя вводить точку или запятую')
    }

    let inputClicked = document.getElementById('agreement');
    inputClicked.addEventListener('click', function (e) {
        if (inputClicked.checked) {
            console.log('согласен')
        } else {
            console.log('не согласен')
        }
    })


    const form = document.getElementsByTagName('form')[0];
    const signUpInputs = document.querySelectorAll('input');
    const formFieldErrors = document.querySelectorAll('.form_input-error');
    const popup = document.getElementById('modalPopup');


    // Регулярные выражения
    const inputValidation = {
        fullName: {
            regExp: /^[а-яa-z\s]*$/i,
            errorText: 'Full Name должно содержать только буквы и пробелы'
        },
        yourUsername: {
            regExp: /^[а-я\w-]*$/i,
            errorText: ' Your username должно содержать только буквы и цифры'
        },
        email: {
            regExp: /^[^@\s]+@[^@\s]+\.[^@\s]+$/i,
            errorText: ' E-mail должен содержать @ и любые символы'
        },
        password: {
            regExp: /(?=.*[A-Z])(?=.*\d)(?=.*[-\(\)\.,:;\?!\*\+%<>@\[\]{}\/\\_\{\}\$#])/,
            errorText: ' Password  должен содержать не менее 8 символов , ' +
                'включая хотя бы одну заглавную букву и специальный знак',
            miniLength: 8
        },
        repeatPassword: {
            errorText: 'Пароли не совпадают'
        }
    }

    let hasError;
    let localStorageClients = localStorage.getItem('clients');

// ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ

    //  делает подчеркивание зеленым при правильном вводе
    // и красным при неправильном
    function handleInputChange(event){
        const input = event.target;
        input.value !== '' ?
            input.style.borderBottomColor = 'greenyellow' :
            input.style.borderBottomColor = '';
    }
    const formInputs = document.querySelectorAll('form input');
    formInputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
    })

    // обрабатываем отправку форму
    form.onsubmit = function (e) {
        e.preventDefault();
        removeFormFieldErrors();
        hasError = false;
        let password = '';

        signUpInputs.forEach((item) => {

            if (isEmptyInputValue(item)) {
                return;
            }
            switch (item.previousSibling.nodeValue.trim()) {
                case 'Full Name':
                    isInvalidInputValue(item, inputValidation.fullName.regExp, inputValidation.fullName.errorText);
                    break;
                case 'Your username' :
                    isInvalidInputValue(item, inputValidation.yourUsername.regExp, inputValidation.yourUsername.errorText);
                    break;
                case 'E-mail' :
                    isInvalidInputValue(item, inputValidation.email.regExp, inputValidation.email.errorText);
                    break;
                case 'Password' :
                    isInvalidInputValue(item, inputValidation.password.regExp, inputValidation.password.errorText);
                    isPasswordLengthInvalid(item, inputValidation.password.minLength, inputValidation.password.errorText);
                    password = item.value;
                    break;
                case 'Repeat Password' :
                    arePasswordsDifferent(password, item, inputValidation.repeatPassword.errorText);
                    break;

                default:
                    isUserAgreed(item);
            }
        });


        if (!hasError) {
            popup.style.display = 'block';
            // openModal();
            let newClient = {
                fullName: signUpInputs[0].value,
                userName: signUpInputs[1].value,
                email: signUpInputs[2].value,
                password: signUpInputs[3].value,
            }

            let clients = [];
            //let localStorageClients = localStorage.getItem('clients');

            if (localStorageClients) {
                clients = JSON.parse(localStorageClients);

            }

            clients.push(newClient);
            localStorage.setItem('clients', JSON.stringify(clients));
            form.reset();
               // сбросить зеленое подчеркивание
            formInputs.forEach(input => {
                //очищаем зеленый цвет
                input.style.borderBottomColor = '';
            })
        }
    }

    // Очистка ошибок при валидации формы
    function removeFormFieldErrors() {
        formFieldErrors.forEach((elem) => {
            elem.style.display = 'none';
            //elem.previousElementSibling.style.borderBottomColor = '#c6c6c4';

        });
    }

    // проверка на существование значений в текстовом поле

    function isEmptyInputValue(input) {
        if (!input.value) {
            input.parentElement.nextElementSibling.innerText = 'Заполните поле  ' + input.previousSibling.data.trim();
            input.parentElement.nextElementSibling.style.display = 'block';
            hasError = true;
            return true;
        }
    }

    // Проверка значений полей на соответствие регулярным выражениям
    function isInvalidInputValue(input, inputRegExp, errorText) {
        if (!input.value.match(inputRegExp)) {
            input.parentElement.nextElementSibling.innerText = errorText;
            input.parentElement.nextElementSibling.style.display = 'block';
            hasError = true;
        }
    }

    // Пароль доолжен содержать не менее 8 символов

    function isPasswordLengthInvalid(passwordInput, minPasswordLength, errorText) {
        if (passwordInput.value.length < minPasswordLength) {
            passwordInput.parentElement.nextElementSibling.innerText = errorText;
            passwordInput.parentElement.nextElementSibling.style.display = 'block';
            hasError = true;
        }
    }

    // Проверка на совпадение паролей из двух текстовых полей

    function arePasswordsDifferent(PasswordInputValue, repeatPasswordInput, errorText) {
        if (repeatPasswordInput.value !== PasswordInputValue) {
            repeatPasswordInput.parentElement.nextElementSibling.innerText = errorText;
            repeatPasswordInput.parentElement.nextElementSibling.style.display = 'block';
            hasError = true;
        }
    }

    // Проверка выбран ли чекбокс

    function isUserAgreed(checkbox) {
        if (!checkbox.checked) {
            checkbox.parentElement.nextElementSibling.style.display = 'block';
            hasError = true;
        }

    }

    const title = document.getElementById('heading');
    const button = document.getElementById('submit');
    const link = document.getElementById('already');
    const ok = document.getElementById('ok');
    const text = document.getElementById('tryHomeWork')
    const name = document.getElementById('field-user-name')
    const password = document.getElementById('password')
    const mistakeUserName = document.getElementById('mistake1')
    const mistakePassword = document.getElementById('mistake2')


    // функция для появления модального окна
    function openModal() {
        popup.style.display = 'block';
        form.reset();
    }

    // функция для закрытия модального окна с последующим открытием формы для логина и пароля
    function closeModal() {
        popup.style.display = 'none';
        // открытие формы с логином и паролем
        openLogin();
    }

    // закрытие модального окна по клику на кнопку
    ok.addEventListener('click', closeModal);


    // функция для формы с логином и паролем, проверки данных и перехода на новую страницу
    function openLogin() {
        // ошибки в основной форме не переходят в форму регистрации
        removeFormFieldErrors()
        // изменение текста заголовка
        title.innerText = 'Log in to the system';

        //removeFormFieldErrors();
        //hasError = false;

        // условия для конкретных полей input
        for (let input of signUpInputs) {


            if (
                input.previousSibling.nodeValue.trim() === 'Your username' ||
                input.previousSibling.nodeValue.trim() === 'Password'
            ) {
                continue;
            }
            // удалить текст ошибок
            input.parentElement.remove();

        }
        //изменение текста в кнопке и строчки о регистрации
        button.innerText = 'Sign in';
        link.innerText = 'Registration'


        //  удаление ошибки после существующего поля userName
        function removeMistake() {
            signUpInputs.forEach((elem) => {
                mistakeUserName.style.display = 'none';
                //elem.previousElementSibling.style.borderBottomColor = '#c6c6c4';

            });
        }



        // проверка формы на заполнение
        form.onsubmit = (e => {
            e.preventDefault();
            removeFormFieldErrors();
            hasError = false;

            const signInInputs = document.getElementsByTagName('input');
            for (let element of signInInputs) {

                if (isEmptyInputValue(element)) {
                    element.parentElement.style.borderBottomColor = 'red';
                }
            }


            if (!hasError) {
                // let clients = localStorage.getItem('clients');
                // let userNameIndex = clients.indexOf(`"userName":"${signInInputs[0].value}"`)
                // проверить поле пароль

                let clients = [];

                if (localStorageClients) {
                    clients = JSON.parse(localStorageClients);

                }
                let user = clients.find(client =>
                    client.userName === signInInputs[0].value
                );
                if (user) {
                   signInInputs[0].parentElement.style.borderBottomColor = '#c6c6c4';
                    let client = JSON.parse(JSON.stringify(user));
                    if (client.password === signInInputs[1].value) {
                        signInInputs[1].parentElement.style.borderBottomColor = '#c6c6c4';


                        // переход в аккаунт при совпадении имени и пароля
                        title.innerText = 'Welcome , ' +  client.fullName
                        title.style.width = '400px'
                        button.innerText = 'Exit'
                        link.style.display = 'none'
                        text.style.display = 'none'
                        name.style.display = 'none'
                        password.style.display = 'none'
                        mistakeUserName.style.display = 'none'
                        mistakePassword.style.display = 'none'
                        e.preventDefault()
                        button.onclick = (e) => {
                            window.location.reload()
                        }
                    } else {
                        signInInputs[0].parentElement.style.borderBottomColor = 'red';
                        //вывод ошибки password
                        // функция на  252 строке
                        removeMistake();
                        mistakePassword.style.display = 'block'
                       // alert('Неверный пароль')
                    }
                } else {
                    // вывод ошибки username
                    mistakeUserName.style.display = 'block'
                }
            }
        }
        );

        link.onclick = () => {
            window.location.reload()
        }
        form.reset();
    }
    link.addEventListener('click', openLogin);
}

