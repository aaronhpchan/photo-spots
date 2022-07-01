/* Client-side form validations */
const form = document.querySelector('.form');
const inputs = document.querySelectorAll('.input');
const defaultStarInput = document.querySelector('input[name="comment[rating]"]');
const starErrorMsg = document.querySelector('.star-error');

if (form) {
    form.onsubmit = event => {
        inputs.forEach(input => {           
            const errorMsg = input.parentElement.lastElementChild;
            
            if(input.value === '') {
                event.preventDefault();
                errorMsg.classList.remove('hidden');
                input.classList.add('ring-1');
            } else {
                errorMsg.classList.add('hidden');
                input.classList.remove('ring-1');
            }
        })

        if(defaultStarInput.checked) {
            event.preventDefault();
            starErrorMsg.classList.remove('hidden');
        } else {
            starErrorMsg.classList.add('hidden');
        }
    }
}

/* Handle closing alert messages */
const alertMsg = document.querySelector('.alert');
const closeAlert = document.querySelector('.close-alert');

closeAlert && (closeAlert.onclick = () => { alertMsg.style.display = 'none' });



