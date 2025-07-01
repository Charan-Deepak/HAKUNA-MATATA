
function ques_paper(admin_test) {
    document.querySelector(".question_paper").style.display = 'block'
    document.querySelector(".quiz_overview").style.display = "none";
    document.querySelector(".quiz_depth").style.display = "none";
    document.querySelector(".answer_sheet").style.display = "none";


    let message = admin_test;
    const quizName = admin_test.quiz_name;
    message_length = message.form.length

    // Convert the object to a string representation
    const code = JSON.stringify(message.random).replace(/"/g, '');
    document.getElementById('ques_parent').innerHTML=``;
    // Display the message wherever needed in your HTML
    document.getElementById('ques_quizcode').textContent = code;
    document.getElementById('ques_quiz_name').textContent = quizName;
    async function testpaper() {

        const div = document.createElement("div");//creating div
        div.id = "question";
        for (var i = 0; i < message_length; i++) {
            const divs = document.createElement("div");//creating div
            divs.id = "question${i+1}";

            if (message.form[i].type == 3) {
                divs.innerHTML = `
                                <div class="card border border-dark mb-3 text-bg-light mb-3" id="question${i + 1}"> 
                                <div class="card-body">
                                    <h5 class="card-title">${i + 1}. ${JSON.stringify(message.form[i].text).replace(/"/g, '')}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted text-end">Marks: ${JSON.stringify(message.form[i].marks).replace(/"/g, '')}</h6>
                                    <p class="card-text">${JSON.stringify(message.form[i].text_answer).replace(/"/g, '')}</p>
                                </div>
                                </div>
                            `} else if (message.form[i].type == 1) {
                divs.innerHTML = `
                                    <div class="card border border-dark mb-3 text-bg-light mb-3" id="question${i + 1}"> 
                                        <div class="card-body">
                                        <h5 class="card-title">${i + 1}. ${JSON.stringify(message.form[i].text).replace(/"/g, '')}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted text-end">Marks: ${JSON.stringify(message.form[i].marks).replace(/"/g, '')}</h6>
                                        <p class="card-text">
                                            <input type="radio" id="option1${i}" name="options${i}" value="1" ${message.form[i].correct_answer == 1 ? 'checked onclick="return false;"' : 'disabled'}>
                                            <label for="option1${i}"> ${JSON.stringify(message.form[i].option1[0]).replace(/"/g, '')}</label><br>

                                            <input type="radio" id="option2${i}" name="options${i}" value="2" ${message.form[i].correct_answer == 2 ? 'checked onclick="return false;"' : 'disabled'}>
                                            <label for="option2${i}"> ${JSON.stringify(message.form[i].option1[1]).replace(/"/g, '')}</label><br>

                                            <input type="radio" id="option3${i}" name="options${i}" value="3" ${message.form[i].correct_answer == 3 ? 'checked onclick="return false;"' : 'disabled'}>
                                            <label for="option3${i}"> ${JSON.stringify(message.form[i].option1[2]).replace(/"/g, '')}</label><br>

                                            <input type="radio" id="option4${i}" name="options${i}" value="4" ${message.form[i].correct_answer == 4 ? 'checked onclick="return false;"' : 'disabled'}>
                                            <label for="option4${i}"> ${JSON.stringify(message.form[i].option1[3]).replace(/"/g, '')}</label>
                                        </p>
                                        </div>
                                    </div>`
            } else if (message.form[i].type == 2) {
                divs.innerHTML = `
                                <div class="card border border-dark mb-3 text-bg-light mb-3" id="question${i + 1}"> 
                                    <div class="card-body">
                                    <h5 class="card-title">${i + 1}. ${JSON.stringify(message.form[i].text).replace(/"/g, '')}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted text-end">Marks: ${JSON.stringify(message.form[i].marks).replace(/"/g, '')}</h6>
                                    <p class="card-text">
                                        <input type="checkbox" id="option_checkbox1${i}" name="options_checkbox${i}" value="1" ${message.form[i].option1_answer_checkbox.includes(1) ? 'checked' : 'disabled'}>
                                        <label for="option_checkbox1${i}"> ${JSON.stringify(message.form[i].option1[0]).replace(/"/g, '')}</label><br>

                                        <input type="checkbox" id="option_checkbox2${i}" name="options_checkbox${i}" value="2" ${message.form[i].option1_answer_checkbox.includes(2) ? 'checked' : 'disabled'}>
                                        <label for="option_checkbox2${i}"> ${JSON.stringify(message.form[i].option1[1]).replace(/"/g, '')}</label><br>

                                        <input type="checkbox" id="option_checkbox3${i}" name="options_checkbox${i}" value="3" ${message.form[i].option1_answer_checkbox.includes(3) ? 'checked' : 'disabled'}>
                                        <label for="option_checkbox3${i}"> ${JSON.stringify(message.form[i].option1[2]).replace(/"/g, '')}</label><br>

                                        <input type="checkbox" id="option_checkbox4${i}" name="options_checkbox${i}" value="4" ${message.form[i].option1_answer_checkbox.includes(4) ? 'checked' : 'disabled'}>
                                        <label for="option_checkbox4${i}"> ${JSON.stringify(message.form[i].option1[3]).replace(/"/g, '')}</label>
                                    </p>
                                    </div>
                                </div>`
            }

            div.appendChild(divs);//adding the inside of div

        }
        // Find the parent div
        const parentDiv = document.getElementById('ques_parent');
        parentDiv.appendChild(div);

    }
    testpaper();

    function copyContent() {
        const text = document.getElementById("ques_quizcode").innerText;

        navigator.clipboard.writeText(text)
            .then(() => {
                // Show Bootstrap toast
                const toast = new bootstrap.Toast(document.getElementById('copyToast'));
                toast.show();
            })
            .catch(err => {
                alert("Failed to copy: " + err);
            });
    }
    document.querySelector(".back_but_test").addEventListener("click", () => {
        quiz_details(admin_test);
    });
}

