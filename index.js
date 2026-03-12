const add = document.querySelector('.add')
const clear = document.querySelector('.clear')

const storage = JSON.parse(localStorage.getItem('users')) || {}

/**
 * Функция добавления слушателей на кнопки удаления и изменения
 * в карточке пользователя
 * @param {HTMLDivElement} userCard - карточка пользователя
 */
function setListeners(userCard) {
    const deleteBtn = userCard.querySelector('.delete')
    const changeBtn = userCard.querySelector('.change')

    const userEmail = deleteBtn.dataset.deleteUserEmail

    deleteBtn.addEventListener('click', () => {
        console.log(
            `%c Удаление пользователя ${userEmail} `,
            'background: red; color: white',
        )
        // 1) Удалить из объекта storage
        // delete.localStorage.name (name = п.15)
        delete storage[userEmail]
        // 2) Обновить localStorage
        // берем опять же с addCard п.149
        localStorage.setItem('users', JSON.stringify(storage))
        // 3) Удалить из DOM дерева
        // п.9
        userCard.remove()
    })

    changeBtn.addEventListener('click', () => {
        console.log(
            `%c Изменение пользователя ${userEmail} `,
            'background: green; color: white',
        )

        // 1) через querySelector получаем доступы к инпутам
        const inputName = document.querySelector('#name')
        const inputSecondName = document.querySelector('#secondName')
        const inputEmail = document.querySelector('#email')
        const inputTelephone = document.querySelector('#telephone')
        // 2)получаем данные пользователя из объекта storage по email
        const data = storage[userEmail]
        // 3) в инпуты через input.value записываем данные из пункта 2
        inputName.value = data.name
        inputSecondName.value = data.secondName
        inputEmail.value = data.email
        inputTelephone.value = data.telephone
    })
}

/**
 * Функция создания карточки пользователя
 * @param {Object} data - объект с данными пользователя
 * @param {string} data.name - имя пользователя
 * @param {string} data.secondName - фамилия пользователя
 * @param {string} data.email - email пользователя
 * @returns {string} - возвращает строку с разметкой карточки пользователя
 */
function createCard({
    name,
    secondName,
    email,
    telephone,
}) {
    return `
        <div data-user=${email} class="user-outer">
            <div class="user-info">
                <p>${name}</p>
                <p>${secondName}</p>
                <p class="email">${email}</p>
                <p >${telephone}</p>
            </div>
            <div class="menu">
                <button data-delete-user-email=${email} class="delete">Удалить</button>
                <button data-change-user-email=${email} class="change">Изменить</button>
            </div>
        </div>
    `
}

/**
 * Функция перерисовки карточек пользователей при загрузке страницы
 * @param {Object} storage - объект с данными пользователей
 */
function rerenderCards(storage) {
    const users = document.querySelector('.users')

    if (!storage) {
        console.log('localStorage пустой')
        return
    }

    users.innerHTML = ''

    Object.keys(storage).forEach((email) => {
        const userData = storage[email]
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = email
        userCard.innerHTML = createCard(userData)
        users.append(userCard)
        setListeners(userCard)
    })
}

/**
 * Функция добавления карточки пользователя в список пользователей и в localStorage
 * @param {Event} e - событие клика по кнопке добавления
 */
function addCard(e) {
    e.preventDefault()
    const newName = document.querySelector('#name')
    const newSecondName = document.querySelector('#secondName')
    const newEmail = document.querySelector('#email')
    const newTelephone = document.querySelector('#telephone')

    const users = document.querySelector('.users')

    if (!newEmail.value
        || !newName.value
        || !newSecondName.value
        || !newTelephone.value
    ) {
        resetInputs(newName, newSecondName, newEmail, newTelephone)
        return
    }

    const data = {
        name: newName.value,
        secondName: newSecondName.value,
        email: newEmail.value,
        telephone: newTelephone.value,
    }

    storage[newEmail.value] = data

    const userCard = document.createElement('div')
    userCard.className = 'user'
    userCard.dataset.email = newEmail.value
    // добавлям анологичную строку, только берем data(так как это Деструктуризация объекта)
    userCard.innerHTML = createCard(data)
    users.append(userCard)
    setListeners(userCard)

    // Добавление данных в localStorage
    localStorage.setItem('users', JSON.stringify(storage))
    resetInputs(newName, newSecondName, newEmail, newTelephone)
    console.log(storage)
    window.location.reload()
}

/**
 * Функция очистки полей ввода
 * @param {HTMLInputElement} inputs
 */
function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = ''
    })
}

// Функция очистки localStorage
function clearLocalStorage() {
    localStorage.removeItem('users')
    window.location.reload()
}

const form = document.querySelector('form')
// console.log(form)
const newLabel = document.createElement('label')
newLabel.setAttribute('for', 'telephone')
newLabel.textContent = 'Telephone'

const newInput = document.createElement('input')
newInput.classList = 'telephone'
newInput.id = 'telephone'
newInput.type = 'tel'

form.insertBefore(newLabel, add)
form.insertBefore(newInput, add)

// шрифт весь
document.body.style.fontFamily = 'Arial, sans-serif'

// стиль инпута
document.querySelectorAll('input').forEach((el) => {
    el.style.borderRadius = '10px'
    el.style.backgroundColor = '#ADD8E6'
})

// кнопка отправить
add.style.backgroundColor = 'green'
add.style.color = 'white'
add.style.border = '2px solid black'
add.style.padding = '10px 20px'
add.style.cursor = 'pointer'

// кнопка отчистить
clear.style.backgroundColor = 'red'
clear.style.color = 'white'
clear.style.border = '2px solid black'
clear.style.padding = '10px 20px'
clear.style.cursor = 'pointer'

// Добавление слушателей на кнопки добавления и очистки
add.addEventListener('click', addCard)
clear.addEventListener('click', clearLocalStorage)

// При загрузке страницы перерисовываются карточки пользователей
window.addEventListener('load', () => {
    rerenderCards(JSON.parse(localStorage.getItem('users')))
})
