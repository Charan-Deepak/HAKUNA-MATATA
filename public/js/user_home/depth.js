function depth(test) {
    //  Fix: use string "none"
    document.querySelector(".depth").style.display = "block"
    document.querySelector(".user_overview").style.display = "none";
    document.querySelector(".question_paper").style.display = 'none';


    //  Display basic details
    document.querySelector('.quiz_name').textContent = test.test_ref.quiz_name.toUpperCase();
    document.querySelector('.test_date').textContent = new Date(test.end_date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    //  Display admin name and email — assumes `admin` is globally accessible
    document.querySelector('.admin_name').textContent = user.firstname + " " + user.lastname;
    document.querySelector('.admin_email').textContent = user.emailId;

    const time_hrs = Math.floor(test.test_ref.time / 60);
    const time_min = test.test_ref.time % 60;
    const text_time = (time_hrs > 0 ? `${time_hrs} hr${time_hrs > 1 ? 's' : ''} ` : '') + (`${time_min} min`);
    //  Test code & time
    document.querySelector('.test_code').textContent = test.quiz_code;
    document.querySelector('.test_time').textContent = `${text_time}`;
    document.querySelector('.test_into').addEventListener("click", function () {
        ques_paper(test);
    });

    //  Form count (number of questions)
    document.querySelector('.ttl_ques').textContent = test.test_ref.form.length;

    function getStudentRank(test, username) {
        if (!test?.test_ref?.students_attended) return -1;

        const students = test.test_ref.students_attended;

        // Sort descending by marks
        const sorted = [...students].sort((a, b) => b.marks - a.marks);

        // Find index (rank is index + 1)
        const rank = sorted.findIndex(student => student.username === username);

        return rank === -1 ? -1 : rank + 1;
    }
    const rank = getStudentRank(test, user.username)
    //  Students attended
    document.querySelector('.rnk').textContent = rank;

    document.querySelector('.ttl_marks').textContent = test.answer_ref.totalmarks;

    document.querySelector('.marks').textContent = test.answer_ref.totalmarksget;
    student_attended(rank, test.answer_ref.totalmarksget)

    document.querySelector(".back_but").addEventListener("click", () => {
        depth_overview();
    });

    function student_attended(rank, marks) {
        const stu_items = document.getElementById("student_items");
        stu_items.innerHTML = ``;

        const row = document.createElement("tr");
        row.className = "align-middle";
        row.style.cursor = "pointer";
        row.id = `row_stu_`;

        const sub_item_1 = document.createElement("th");
        sub_item_1.scope = "row";
        sub_item_1.textContent = rank;

        const sub_item_2 = document.createElement("td");
        sub_item_2.textContent = user.username;
        sub_item_2.className = "text-dark";

        const sub_item_3 = document.createElement('td');
        sub_item_3.textContent = user.firstname + " " + user.lastname;
        sub_item_3.style.textTransform = "capitalize";
        sub_item_3.className = "text-dark";

        const sub_item_4 = document.createElement('td');
        sub_item_4.textContent = marks;
        sub_item_4.className = "text-success fw-medium";

        row.append(sub_item_1, sub_item_2, sub_item_3, sub_item_4);
        stu_items.appendChild(row);

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
    answer_sheet(test);
}    