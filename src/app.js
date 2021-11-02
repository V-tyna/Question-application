import {Question} from './question.js';
import {isValid, createModal} from './utils.js';
import {getAuthForm, authWithEmailAndPassword} from './auth'
import "./styles.css";

const form = document.getElementById('form');
const modalBtn= document.getElementById('modal-Btn');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submitBtn');

window.addEventListener('load', Question.renderListOfQuestions);
form.addEventListener('submit', submitFormHandler);
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value);
})

function submitFormHandler(event) {
   event.preventDefault();

   if(isValid(input.value)) {
      const  question = {
          text: input.value.trim(),
          date: new Date().toJSON()
      }

      submitBtn.disabled = true;
      //Async request to server to save question
       Question.create(question).then(() => {
           input.value = '';
           input.className = '';
           submitBtn.disabled = false;
       })
       // console.log('Question: ', question);
   }
}

function openModal() {
    createModal('Autorization', getAuthForm());
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler,{once:true})

}

function authFormHandler(event) {
    event.preventDefault();

    const btn = event.target.querySelector('button');
   const email = event.target.querySelector('#email').value;
   const password = event.target.querySelector('#password').value;

   btn.disabled = true;
    authWithEmailAndPassword(email, password)
        // .then( token => {
        //     return Question.fetch(token)
        // }) or ---->
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .then(() =>btn.disabled = false)
}


function renderModalAfterAuth(content) {
   if(typeof  content ==='string') {
       createModal('Error!', content)
   } else {
       createModal('Questions list: ', Question.listToHTML(content))
   }
}
