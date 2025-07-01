    const stu_items = document.getElementById('student_items');
    const items = document.getElementById('test_items');
    const showMoreBtn = document.getElementById('showMoreBtn');
    const testItems = admin.test.slice().reverse();
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

                    const filtered = testItems.filter(test => test.random.includes(code));
                    if (filtered.length === 0) {
                        items.innerHTML = `<tr><td colspan="6" class="text-center text-danger">No quiz found for code "${code}"</td></tr>`;
                    showMoreBtn.classList.add("d-none");
                                    } else {
                        renderFilteredTests(filtered);
                    showMoreBtn.classList.add("d-none"); // Hide show more
                    }
    });


    function renderTests(count) {
        document.querySelector(".quiz_overview").style.display = "block";
        document.querySelector(".quiz_depth").style.display = "none";
        document.querySelector(".question_paper").style.display = 'none'
        document.querySelector(".answer_sheet").style.display = "none";
            items.innerHTML = ``;
            for (let i = 0; i < Math.min(count, testItems.length); i++) {
                                const test = testItems[i];

                    const row = document.createElement("tr");
                    row.className = "align-middle";
                    row.style.cursor = "pointer";
                    row.id = `row_${i}`;
                    row.setAttribute("data-quiz-code", test.random);

                    row.addEventListener("click", function () {
                        quiz_details(test);
                                            //const quizCode = row.getAttribute("data-quiz-code");
                                            //window.location.href = `/admin/create_quiz/submission_page/${quizCode}`;
                                        });

                    const sub_item_1 = document.createElement("th");
                    sub_item_1.scope = "row";
                    sub_item_1.textContent = test.quiz_name;
                    sub_item_1.style.textTransform = "capitalize";

                    const sub_item_2 = document.createElement("td");
                    sub_item_2.textContent = test.random;
                    sub_item_2.className = "text-dark";

                    const date = new Date(test.date);
                    const formatted = date.toLocaleString('en-GB', options);
                    const sub_item_3 = document.createElement('td');
                    sub_item_3.textContent = formatted;
                    sub_item_3.className = "text-dark";

                    const sub_item_4 = document.createElement('td');
                    sub_item_4.textContent = test.form.length;
                    sub_item_4.className = "text-success fw-medium";

                    const sub_item_5 = document.createElement('td');
                    sub_item_5.textContent = test.students_attended.length;
                    sub_item_5.className = "text-info fw-medium";

                    const sub_item_6 = document.createElement('td');
                    const hours = Math.floor(test.time / 60);
                    const minutes = test.time % 60;
                    sub_item_6.textContent = minutes == 0 ? "No Time" :
                                            (hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ` : '') +
                    (`${minutes} min`);
                    sub_item_6.className = "text-danger fw-medium";

                    row.append(sub_item_1, sub_item_2, sub_item_3, sub_item_4, sub_item_5, sub_item_6);
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

        items.innerHTML = ``;
        document.querySelector(".quiz_overview").style.display = "block";
        document.querySelector(".quiz_depth").style.display = "none";
        document.querySelector(".question_paper").style.display = 'none'
        document.querySelector(".answer_sheet").style.display = "none";

        filteredTests.forEach((test, i) => {
                        const row = document.createElement("tr");
                        row.className = "align-middle";
                        row.style.cursor = "pointer";
                        row.setAttribute("data-quiz-code", test.random);
                                            row.addEventListener("click", () => {
                                            quiz_details(test);
                        });

                        const sub_item_1 = document.createElement("th");
                        sub_item_1.scope = "row";
                        sub_item_1.textContent = test.quiz_name;
                        sub_item_1.style.textTransform = "capitalize";

                        const sub_item_2 = document.createElement("td");
                        sub_item_2.textContent = test.random;
                        sub_item_2.className = "text-dark";

                        const date = new Date(test.date);
                        const formatted = date.toLocaleString('en-GB', options);
                        const sub_item_3 = document.createElement("td");
                        sub_item_3.textContent = formatted;
                        sub_item_3.className = "text-dark";

                        const sub_item_4 = document.createElement("td");
                        sub_item_4.textContent = test.form.length;
                        sub_item_4.className = "text-success fw-medium";

                        const sub_item_5 = document.createElement("td");
                        sub_item_5.textContent = test.students_attended.length;
                        sub_item_5.className = "text-info fw-medium";

                        const sub_item_6 = document.createElement("td");
                        const hours = Math.floor(test.time / 60);
                        const minutes = test.time % 60;
                        sub_item_6.textContent =
                                                (hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ` : '') + `${minutes} min`;
                        sub_item_6.className = "text-danger fw-medium";

                        row.append(sub_item_1, sub_item_2, sub_item_3, sub_item_4, sub_item_5, sub_item_6);
                        items.appendChild(row);
            });
    }

    function quiz_details(admin_test) {
        //  Fix: use string "none"
        document.querySelector(".quiz_depth").style.display = "block"
        document.querySelector(".quiz_overview").style.display = "none";
        document.querySelector(".question_paper").style.display = 'none'
        document.querySelector(".answer_sheet").style.display = "none";

            //  Display basic details
            document.querySelector('.quiz_name').textContent = admin_test.quiz_name.toUpperCase();
            document.querySelector('.test_date').textContent = new Date(admin_test.date).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
                                });

            //  Display admin name and email — assumes `admin` is globally accessible
            document.querySelector('.admin_name').textContent = admin.firstname + " " + admin.lastname;
            document.querySelector('.admin_email').textContent = admin.emailId;

            const time_hrs = Math.floor(admin_test.time/ 60);
            const time_min = admin_test.time % 60;
                                const text_time =(time_hrs > 0 ? `${time_hrs} hr${time_hrs > 1 ? 's' : ''} ` : '') +(`${time_min} min`);
            //  Test code & time
            document.querySelector('.test_code').textContent = admin_test.random;
            document.querySelector('.test_time').textContent = `${text_time}`;
            document.querySelector('.test_into').addEventListener("click", function () {
                ques_paper(admin_test);
            });

            //  Form count (number of questions)
            document.querySelector('.ttl_ques').textContent = admin_test.form.length;

            //  Students attended
            document.querySelector('.ttl_stud').textContent = admin_test.students_attended.length;

            //  Total marks from form
            let totalMarks = 0;
            for (const form of admin_test.form) {
                totalMarks += form.marks || 0; // default to 0 if undefined
                                }
            document.querySelector('.ttl_marks').textContent = totalMarks;


            //  Average marks from students_attended
            let totalMarks_stu = 0;
            for (const student of admin_test.students_attended) {
                totalMarks_stu += student.marks || 0;
                                }
            const totalStudents = admin_test.students_attended.length;
            const averageMarks = totalStudents > 0 ? Math.floor(totalMarks_stu / totalStudents) : 0;
            document.querySelector('.avg_marks').textContent = averageMarks;
                student_attended(admin_test)
            }

            document.querySelector(".back_but").addEventListener("click", () => {
                renderTests(visibleCount);
            });

    function student_attended(admin_test) {
        stu_items.innerHTML = ``;
        const students=admin_test.students_attended;
        // Sort in descending order based on marks
        students.sort((a, b) => (b.marks || 0) - (a.marks || 0));

        for (let i = 0; i < students.length; i++) {
            const student = students[i];

            const row = document.createElement("tr");
            row.className = "align-middle";
            row.style.cursor = "pointer";
            row.id = `row_stu_${i}`;

            const sub_item_1 = document.createElement("th");
            sub_item_1.scope = "row";
            sub_item_1.textContent = i + 1;

            const sub_item_2 = document.createElement("td");
            sub_item_2.textContent = student.student_ref.username;
            sub_item_2.className = "text-dark";

            const sub_item_3 = document.createElement('td');
            sub_item_3.textContent = student.student_ref.firstname + " " + student.student_ref.lastname;
            sub_item_3.style.textTransform= "capitalize";
            sub_item_3.className = "text-dark";

            const sub_item_4 = document.createElement('td');
            sub_item_4.textContent = student.student_ref.emailId;
            sub_item_4.className = "text-success fw-medium";

            const sub_item_5 = document.createElement('td');
            sub_item_5.textContent = student.marks;
            sub_item_5.className = "text-info fw-medium";

            const sub_item_6 = document.createElement('td');
            sub_item_6.innerHTML = `<span class="test_into"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-right"
                viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                <path fill-rule="evenodd"
                    d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />                                        </svg></span>`
            sub_item_6.className = "text-danger fw-medium";
            sub_item_6.addEventListener("click", function () {
                answer_sheet(admin_test, student.username, student.answer_ref);
            });

            row.append(sub_item_1, sub_item_2, sub_item_3, sub_item_4, sub_item_5, sub_item_6);
            stu_items.appendChild(row);
        }

    }
    
    document.getElementById("download").addEventListener("click", downloadDivPDF);


    function downloadDivPDF() {
        const element = document.querySelector(".quiz_depth");
        const opt = {
            margin: [4, 10, 4, 10], // top, left, bottom, right (in mm)
            filename: 'quiz_details.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                scrollY: 0,  // Ensure it starts from top
                windowHeight: element.scrollHeight  // Ensure full height is considered
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: { mode: ['css', 'legacy'] } // Allow automatic page breaks
        };

        html2pdf().set(opt).from(element).save();
    
    }

