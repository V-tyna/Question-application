 export class Question {
    static create(question) {
        return fetch('https://podcast-authorization-default-rtdb.europe-west1.firebasedatabase.app/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
                .then(response => {
                question.id = response.name;
                return question;
            })
            .then(Question.clearListOfQuestions)
            .then(Question.renderListOfQuestions)
    }

    static renderListOfQuestions() {

        return fetch('https://podcast-authorization-default-rtdb.europe-west1.firebasedatabase.app/questions.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then( (data) => {
                // console.log(data)
                let listElem = document.getElementById('list');
                for (let key in data) {
                    // console.log(`${key}: ${data[key].text}`);

                    listElem.innerHTML += ` <div class="mui--text-black-54">
                     ${new Date(data[key].date).toLocaleDateString()}
                     ${new Date(data[key].date).toLocaleTimeString()}
                 </div>
                 <div>${data[key].text}</div>
                 <br>
                 `
                }
            })
    }

    static clearListOfQuestions() {
        let listElem = document.getElementById('list');
        listElem.innerHTML = '';
    }


     static fetch(token) {
        if(!token) {
            return Promise.resolve('<p class="error"> You haven\'t token</p>')
        }
        return fetch(`https://podcast-authorization-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {
                if(response && response.error) {
                    return `<p class="error">${response.error}</p>`
                }

                return  response ? Object.keys(response).map(key => ({
                   ...response[key],
                   id: key
                })) : []
            })
     }

     static listToHTML(questions) {
        return questions.length
            ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
            : '<p>No questions yet...</p>'
    }
 }



