export const hideAlert = () => {
    const alertEl = document.querySelector('.alert')
    if (alertEl) alertEl.parentElement.removeChild(alertEl)
}
export const displayAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class='alert alert--${type}'>${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML("afterbegin", markup)
    window.setTimeout(hideAlert, 2000)
}