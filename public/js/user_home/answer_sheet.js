function answer_sheet(test) {
    const test_answer = test.answer_ref;
    const message = test.test_ref;
    const message_length = message.form.length;

    function anspaper() {
        const div = document.createElement("div");
        div.style.padding = "1rem";
        div.style.display = "flex";
        div.style.flexDirection = "column";
        div.style.gap = "1.5rem";
        div.style.maxWidth = "90vw";
        div.style.margin = "0 auto";

        for (let i = 0; i < message_length; i++) {
            const divs = document.createElement("div");
            divs.style.margin = "0 0";
            divs.style.border = "2px dashed #00bcd4";
            divs.style.padding = "1rem";
            divs.style.borderRadius = "10px";
            divs.style.backgroundColor = "#f9f9f9";

            const heading = document.createElement("h4");
            heading.style.textTransform = "capitalize";
            heading.style.display = "flex";
            heading.style.justifyContent = "space-between";
            heading.style.fontFamily = "'Comic Sans MS', cursive";
            heading.style.fontSize = "1.1rem";
            heading.style.color = "#2c3e50";
            heading.innerHTML = `${i + 1}. ${message.form[i].text} <span style="margin-left:auto;color:#333;">Marks: ${test_answer.form[i].mark}/${message.form[i].marks}</span>`;
            divs.appendChild(heading);

            if (message.form[i].type == 3) {
                const span = document.createElement("span");
                span.innerHTML = "A. ";
                const ans = document.createElement("span");
                ans.style.textTransform = "capitalize";
                ans.style.textDecoration = "underline";

                if (test_answer.form[i].text_answer === message.form[i].text_answer) {
                    ans.style.color = "#068f06";
                    ans.textContent = message.form[i].text_answer;
                } else {
                    ans.style.color = "#b13008";
                    ans.textContent = test_answer.form[i].text_answer;

                    const correctAns = document.createElement("span");
                    correctAns.style.textDecoration = "underline";
                    correctAns.style.color = "#068f06";
                    correctAns.textContent = ` | ${message.form[i].text_answer}`;
                    ans.appendChild(correctAns);
                }
                span.appendChild(ans);
                divs.appendChild(span);

            } else if (message.form[i].type == 1 || message.form[i].type == 2) {
                const isMultiple = message.form[i].type == 2;
                for (let j = 0; j < 4; j++) {
                    const input = document.createElement("input");
                    input.type = isMultiple ? "checkbox" : "radio";
                    input.name = `option${i}`;
                    input.disabled = true;
                    input.style.marginRight = "0.5rem";
                    input.style.accentColor = "#ccc";
                    input.style.cursor = "not-allowed";

                    const label = document.createElement("label");
                    label.textContent = message.form[i].option1[j];
                    label.style.display = "block";
                    label.style.marginBottom = "0.4rem";

                    const correct = isMultiple
                        ? message.form[i].option1_answer_checkbox.includes(j + 1)
                        : message.form[i].correct_answer === j + 1;

                    const selected = isMultiple
                        ? test_answer.form[i].option1_answer_checkbox.includes(j + 1)
                        : test_answer.form[i].correct_answer === j + 1;

                    if (selected && correct) {
                        input.checked = true;
                        input.style.accentColor = "#198d06";
                        label.style.color = "#198d06";
                    } else if (selected && !correct) {
                        input.checked = true;
                        input.style.accentColor = "#c23c0b";
                        label.style.color = "#c23c0b";
                    } else if (!selected && correct) {
                        label.style.color = "#198d06";
                    }

                    divs.appendChild(input);
                    divs.appendChild(label);
                }
            }
            div.appendChild(divs);
        }

        const parentDiv = document.getElementById('parent');
        parentDiv.innerHTML = '';
        parentDiv.appendChild(div);
    }

    anspaper();
}
