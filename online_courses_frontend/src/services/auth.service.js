import http from "../http-common";

function login(username, password) {
    var data = {
        username: username,
        password: password
    };
    console.log(data)
    return http
        .post("/auth/signin", data)
        .then(response => {
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data)); // записываем данные пользователя в локальное хранилище, которое хранится в браузере
        }
        return response.data;
    });
}

function logout() {
    localStorage.removeItem('user'); // при нажатии кнопки "Выйти" удаляем данные пользователя из локального хранилища
}
function register(username, password,name, role) {
    var data = {
        username: username,
        password: password,
        name: name,
        role: role
    };
    return http.post("/auth/signup", data);
}

const exportedObject = {
    login: login,
    logout: logout,
    register: register
};

export default exportedObject;
