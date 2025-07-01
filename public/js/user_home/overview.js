function overview() {

    document.querySelector(".question_paper").style.display = 'none';
    document.querySelector(".user_overview").style.display = 'block';


    const items = document.getElementById('test_items');
    const showMoreBtn = document.getElementById('showMoreBtn');
    const testItems = user.test_answer.slice().reverse();
    let visibleCount = 10;

    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,     // for AM/PM format
        timeZone: 'Asia/Kolkata' // IST (you can remove this if you want local time)
    };

    // Filter tests by quiz code when search is clicked
    document.getElementById("searchBtn").addEventListener("click", () => {
        const code = document.getElementById("quizCodeInput").value.trim();
        if (!code) {
            renderTests(visibleCount); // If empty, show default list
            return;
        }

        const filtered = testItems.filter(test => test.quiz_code.includes(code));
        if (filtered.length === 0) {
            items.innerHTML = `<tr><td colspan="6" class="text-center text-danger">No quiz found for code "${code}"</td></tr>`;
            showMoreBtn.classList.add("d-none");
        } else {
            renderFilteredTests(filtered);
            showMoreBtn.classList.add("d-none"); // Hide show more
        }
    });


    function renderTests(count) {
        items.innerHTML = ``;

        for (let i = 0; i < Math.min(count, testItems.length); i++) {
            const test = testItems[i];

            const row = document.createElement("tr");
            row.className = "align-middle";
            row.style.cursor = "pointer";
            row.id = `row_${i}`;
            row.setAttribute("data-quiz-code", test.quiz_code);
            row.addEventListener("click", () => {
                ques_paper(test.test_ref);
            })


            const sub_item_1 = document.createElement("th");
            sub_item_1.scope = "row";
            sub_item_1.textContent = test.test_ref.quiz_name;
            sub_item_1.style.textTransform = "capitalize";

            const sub_item_2 = document.createElement("td");
            sub_item_2.textContent = test.quiz_code;
            sub_item_2.className = "text-dark";

            const date = new Date(test.end_date);
            const formatted = date.toLocaleString('en-GB', options);
            const sub_item_3 = document.createElement('td');
            sub_item_3.textContent = formatted;
            sub_item_3.className = "text-dark";

            const sub_item_4 = document.createElement('td');
            sub_item_4.textContent = test.test_ref.form.length;
            sub_item_4.className = "text-success fw-medium";

            const sub_item_5 = document.createElement('td');
            sub_item_5.textContent = test.answer_ref.totalmarks;
            sub_item_5.className = "text-info fw-medium";

            const sub_item_6 = document.createElement('td');
            sub_item_6.textContent = test.answer_ref.totalmarksget;
            sub_item_6.className = "text-danger fw-medium";

            const sub_item_7 = document.createElement('td');
            const hours = Math.floor(test.test_ref.time / 60);
            const minutes = test.test_ref.time % 60;
            sub_item_7.textContent = minutes == 0 ? "No Time" :
                (hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ` : '') +
                (`${minutes} min`);
            sub_item_7.className = "text-warning fw-medium";

            row.append(sub_item_1, sub_item_2, sub_item_3, sub_item_4, sub_item_5, sub_item_6, sub_item_7);
            items.appendChild(row);
        }

        if (testItems.length > visibleCount) {
            showMoreBtn.classList.remove("d-none");
        } else {
            showMoreBtn.classList.add("d-none");
        }
    }
    renderTests(visibleCount);

    showMoreBtn.addEventListener("click", () => {
        visibleCount += 10;
        renderTests(visibleCount);
    });


    // Render filtered test list
    function renderFilteredTests(filteredTests) {
        items.innerHTML = "";
        filteredTests.forEach((test, i) => {

            const row = document.createElement("tr");
            row.className = "align-middle";
            row.style.cursor = "pointer";
            row.id = `row_${i}`;
            row.setAttribute("data-quiz-code", test.quiz_code);
            row.addEventListener("click", () => {
                ques_paper(test.test_ref);
            })


            const sub_item_1 = document.createElement("th");
            sub_item_1.scope = "row";
            sub_item_1.textContent = test.test_ref.quiz_name;
            sub_item_1.style.textTransform = "capitalize";

            const sub_item_2 = document.createElement("td");
            sub_item_2.textContent = test.quiz_code;
            sub_item_2.className = "text-dark";

            const date = new Date(test.end_date);
            const formatted = date.toLocaleString('en-GB', options);
            const sub_item_3 = document.createElement('td');
            sub_item_3.textContent = formatted;
            sub_item_3.className = "text-dark";

            const sub_item_4 = document.createElement('td');
            sub_item_4.textContent = test.test_ref.form.length;
            sub_item_4.className = "text-success fw-medium";

            const sub_item_5 = document.createElement('td');
            sub_item_5.textContent = test.answer_ref.totalmarks;
            sub_item_5.className = "text-info fw-medium";

            const sub_item_6 = document.createElement('td');
            sub_item_6.textContent = test.answer_ref.totalmarksget;
            sub_item_6.className = "text-danger fw-medium";

            const sub_item_7 = document.createElement('td');
            const hours = Math.floor(test.test_ref.time / 60);
            const minutes = test.test_ref.time % 60;
            sub_item_7.textContent = minutes == 0 ? "No Time" :
                (hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ` : '') +
                (`${minutes} min`);
            sub_item_7.className = "text-warning fw-medium";

            row.append(sub_item_1, sub_item_2, sub_item_3, sub_item_4, sub_item_5, sub_item_6, sub_item_7);
            items.appendChild(row);
        });
    }
}

overview();