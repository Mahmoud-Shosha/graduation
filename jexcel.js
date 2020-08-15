
let studentList = []
let studentListAfterFixed = []
let student;
let a;
let tr;
let f=0;
let m =0;
$(function () {

    $.getJSON("StudentClasses/elec1.json", function (data) {

        student = data;


    });




    $("#calc").click(function () {
        f++;
        if(f>1) studentList = [];
        a = $('.draggable').children();
        for (let i = 3; i < a.length; i++) {
            tr = a[i].querySelectorAll('[data-x]');

            let returnedStudents = fillStudent(tr, student);
           studentList.push(JSON.parse(JSON.stringify(returnedStudents)));
           



        }
    });

    $("#fixedPresentageBtn").click(function () {
        m++;
        if(m>1) studentListAfterFixed = [];
        let fixedPresentageValue = document.getElementById("fixedPresentagevalue").value;
        a = $('.draggable').children();

        
        for (let i = 3; i < a.length; i++) {
            tr = a[i].querySelectorAll('[data-x]')
            let returnedStudent2 = fillStudentFixedPresentage(tr, studentList[i - 3], fixedPresentageValue)
             
             studentListAfterFixed.push(JSON.parse(JSON.stringify(returnedStudent2)))//



        }
    });

    $("#mercyBtn").click(function () {
        let totalMercyPresentage = []
        totalMercyPresentage.push(document.getElementById("totalMercyPresentageForNew").value);
        totalMercyPresentage.push(document.getElementById("totalMercyPresentageForOld").value);
        totalMercyPresentage.push(document.getElementById("totalMercyPresentageForOut").value);
        totalMercyPresentage.push(document.getElementById("totalMercyPresentageForDis").value);

        let mercyPresentageForSubject = [];
        mercyPresentageForSubject.push(document.getElementById("mercyPresentageForSubjectForNew").value);
        mercyPresentageForSubject.push(document.getElementById("mercyPresentageForSubjectForOld").value);
        mercyPresentageForSubject.push(document.getElementById("mercyPresentageForSubjectForOut").value);
        mercyPresentageForSubject.push(document.getElementById("mercyPresentageForSubjectForDis").value);

        let periority1= document.getElementById("periority1").value;
        let periority2= document.getElementById("periority2").value;
        let periority3= document.getElementById("periority3").value;
        let periority = [periority1,periority2,periority3];
        let subjectsCanFail = document.getElementById("subjectsCanFail").value;
        let subjectsCanFailH = document.getElementById("subjectsCanFailH").value;
        let fixedPresentagevalueForTotal = document.getElementById("fixedPresentagevalueForTotal").value;

        a = $('.draggable').children();
        for (let i = 3; i < a.length; i++) {
            tr = a[i].querySelectorAll('[data-x]')
            applyMercy(tr, studentListAfterFixed[i - 3], totalMercyPresentage, mercyPresentageForSubject, periority, subjectsCanFail, subjectsCanFailH, fixedPresentagevalueForTotal);


        }
    });



}



);

function fillStudent(tr, student) {
    let q = [];
    let wExam = []
    let i = 0;
    let studentTotalMarks = 0;

    student.id = tr[i].textContent;
    student.code = tr[++i].textContent;
    student.name = tr[++i].textContent;
    student.status = tr[++i].textContent;
    student.subjects.forEach(function (subject) {

        if ((subject.term == 1 && !subject.havePracticalExam) || (subject.term == 2 && !subject.havePracticalExam && !subject.isContinued)) {
            //4
            let isRasibLiha = false;
            subject.studentTermActivity = tr[++i].textContent;
            subject.studentWrittenExam = tr[++i].textContent;

            subject.studentMark = Number(subject.studentTermActivity) + Number(subject.studentWrittenExam);

            (subject.writtenExam * 0.3 <= subject.studentWrittenExam) ? tr[++i].textContent = subject.studentMark : (tr[++i].textContent = "رل", isRasibLiha = true); //,subject.studentMark="رل"
            (isRasibLiha) ? (subject.studentGrade = "رل", tr[++i].textContent = "رل") : (subject.studentGrade = calcGrade(subject.fullMark, subject.studentMark), tr[++i].textContent = subject.studentGrade)
            if (subject.isContinued && subject.term == 1) {
                q.push(subject.studentMark); wExam.push(subject.studentWrittenExam)
            };

            if (student.status != "مستجد" && !subject.isContinued && subject.studentGrade != "رل") {
                let j = i;
                if (subject.studentGrade != "ض" && subject.studentMark > subject.fullMark * 0.65 - 1) {
                    tr[j].textContent = "ل";
                    tr[--j].textContent = (subject.fullMark * 0.65 - 1);
                    subject.studentMark = (subject.fullMark * 0.65 - 1);
                }

            }

            if (!subject.isContinued && !isRasibLiha) studentTotalMarks = studentTotalMarks + subject.studentMark;
        }


        else if ((subject.term == 1 && subject.havePracticalExam)
            || (subject.term == 2 && subject.havePracticalExam && !subject.isContinued)) {
            //5
            let isRasibLiha = false;
            subject.studentTermActivity = tr[++i].textContent;
            subject.studentPracticalExam = tr[++i].textContent;
            subject.studentWrittenExam = tr[++i].textContent;
            subject.studentMark = Number(subject.studentTermActivity) + Number(subject.studentWrittenExam) + Number(subject.studentPracticalExam);
            (subject.writtenExam * 0.3 <= subject.studentWrittenExam) ? tr[++i].textContent = subject.studentMark : (tr[++i].textContent = "رل", isRasibLiha = true);//,subject.studentMark="رل"
            (isRasibLiha) ? (subject.studentGrade = "رل", tr[++i].textContent = "رل") : (subject.studentGrade = calcGrade(subject.fullMark, subject.studentMark), tr[++i].textContent = subject.studentGrade)
            if (subject.isContinued && subject.term == 1) {
                q.push(subject.studentMark); wExam.push(subject.studentWrittenExam)
            };


            if (student.status != "مستجد" && !subject.isContinued && subject.studentGrade != "رل") {
                let j = i;
                if (subject.studentGrade != "ض" && subject.studentMark > subject.fullMark * 0.65 - 1) {

                    tr[j].textContent = "ل";
                    tr[--j].textContent = (subject.fullMark * 0.65 - 1);
                    subject.studentMark = (subject.fullMark * 0.65 - 1);
                }

            }

            if (!subject.isContinued && !isRasibLiha) studentTotalMarks = studentTotalMarks + subject.studentMark;
        }




        else if (subject.term == 2 && !subject.havePracticalExam && subject.isContinued) {
            //6
            let isRasibLiha = false;
            subject.studentTermActivity = tr[++i].textContent;
            subject.studentWrittenExam = tr[++i].textContent;


            subject.studentMark = Number(subject.studentTermActivity) + Number(subject.studentWrittenExam);
            (subject.writtenExam * 0.3 <= subject.studentWrittenExam) ? tr[++i].textContent = subject.studentMark : (tr[++i].textContent = "رل", isRasibLiha = true);//,subject.studentMark="رل"
            (isRasibLiha) ? (subject.studentGrade = "رل", tr[++i].textContent = "رل") : (subject.studentGrade = calcGrade(subject.fullMark, subject.studentMark), tr[++i].textContent = subject.studentGrade)
            //////////

            if (Number(subject.studentWrittenExam) + Number(wExam.shift()) < 0.3 * 2 * subject.writtenExam) {
                subject.student2termsMark = "رل";
                tr[++i].textContent = "رل";

            }
            else {
                subject.student2termsMark = Number(subject.studentMark) + Number(q.shift());
                tr[++i].textContent = subject.student2termsMark;
            }



            if (subject.student2termsMark == "رل") {
                subject.studentTotalGrade = "رل";
                tr[++i].textContent = subject.studentTotalGrade;
            }
            else {
                subject.studentTotalGrade = calcGrade(subject.totalFullMark, subject.student2termsMark);
                tr[++i].textContent = subject.studentTotalGrade;
            }


            if (student.status != "مستجد" && subject.studentTotalGrade != "رل") {
                let j = i;
                /////subject.studentGrade
                if (subject.studentTotalGrade != "ض" && subject.student2termsMark > subject.totalFullMark * 0.65 - 1) {

                    tr[j].textContent = "ل";
                    tr[--j].textContent = (subject.totalFullMark * 0.65 - 1);
                    subject.student2termsMark = (subject.totalFullMark * 0.65 - 1);
                }

            }
            if (!isRasibLiha) studentTotalMarks = studentTotalMarks + subject.student2termsMark;
        }



        else if (subject.term == 2 && subject.havePracticalExam && subject.isContinued) {
            //7
            //////////////////
            let isRasibLiha = false;
            subject.studentTermActivity = tr[++i].textContent;
            subject.studentPracticalExam = tr[++i].textContent;


            subject.studentWrittenExam = tr[++i].textContent;
            subject.studentMark = Number(subject.studentTermActivity) + Number(subject.studentWrittenExam) + Number(subject.studentPracticalExam);
            ////////////////////////////////////////////////
            (subject.writtenExam * 0.3 <= subject.studentWrittenExam) ? tr[++i].textContent = subject.studentMark : (tr[++i].textContent = "رل", isRasibLiha = true);//,subject.studentMark="رل"
            (isRasibLiha) ? (subject.studentGrade = "رل", tr[++i].textContent = "رل") : (subject.studentGrade = calcGrade(subject.fullMark, subject.studentMark), tr[++i].textContent = subject.studentGrade)

            if (Number(subject.studentWrittenExam) + Number(wExam.shift()) < 0.3 * 2 * subject.writtenExam) {
                subject.student2termsMark = "رل";
                tr[++i].textContent = "رل";

            }
            else {
                subject.student2termsMark = Number(subject.studentMark) + Number(q.shift());
                tr[++i].textContent = subject.student2termsMark;
            }



            if (subject.student2termsMark == "رل") {
                subject.studentTotalGrade = "رل";
                tr[++i].textContent = subject.studentTotalGrade;
            }
            else {
                subject.studentTotalGrade = calcGrade(subject.totalFullMark, subject.student2termsMark);
                tr[++i].textContent = subject.studentTotalGrade;
            }


            if (student.status != "مستجد" && subject.studentTotalGrade != "رل") {
                let j = i;
                if (subject.studentTotalGrade != "ض" && subject.student2termsMark > subject.totalFullMark * 0.65 - 1) {

                    tr[j].textContent = "ل";
                    tr[--j].textContent = (subject.totalFullMark * 0.65 - 1);
                    subject.student2termsMark = (subject.totalFullMark * 0.65 - 1);
                }

            }
            if (!isRasibLiha) studentTotalMarks = studentTotalMarks + subject.student2termsMark;

        }

        else if (subject.isFromPastYear) {
            // 9/////// elle3b men awel hena

            if (tr[++i].textContent == "") {
                // i = i + 8;
                subject.name = tr[i].textContent;
                subject.termActivity = tr[++i].textContent;
                subject.practicalExam = tr[++i].textContent;
                subject.writtenExam = tr[++i].textContent;
                subject.fullMark = Number(subject.termActivity) + Number(subject.practicalExam) + Number(subject.writtenExam);
                subject.studentTermActivity = tr[++i].textContent;
                subject.studentPracticalExam = tr[++i].textContent;
                subject.studentWrittenExam = tr[++i].textContent;
                subject.studentMark = tr[++i].textContent;
                subject.studentGrade = tr[++i].textContent;

            }
            else {
                let isRasibLiha;
                subject.name = tr[i].textContent;
                subject.termActivity = tr[++i].textContent;
                subject.practicalExam = tr[++i].textContent;
                subject.writtenExam = tr[++i].textContent;
                subject.fullMark = Number(subject.termActivity) + Number(subject.practicalExam) + Number(subject.writtenExam);
                subject.studentTermActivity = tr[++i].textContent;
                subject.studentPracticalExam = tr[++i].textContent;
                subject.studentWrittenExam = tr[++i].textContent;
                subject.studentMark = Number(subject.studentTermActivity) + Number(subject.studentPracticalExam) + Number(subject.studentWrittenExam);
                subject.studentGrade = calcGrade(subject.fullMark, subject.studentMark);
                //calc the marks


                if (subject.writtenExam * 0.3 > subject.studentWrittenExam) {
                    tr[++i].textContent = "رل";
                    tr[++i].textContent = "رل";
                    subject.studentMark = "رل";
                    subject.studentGrade = "رل";
                }
                else if ((subject.writtenExam * 0.3 <= subject.studentWrittenExam) && (subject.studentMark > subject.fullMark * 0.65 - 1)) {
                    tr[++i].textContent = subject.fullMark * 0.65 - 1;
                    subject.studentMark = subject.fullMark * 0.65 - 1;
                    tr[++i].textContent = "ل";
                    subject.studentGrade = "ل";
                }

                else if ((subject.writtenExam * 0.3 <= subject.studentWrittenExam) && (subject.studentMark < subject.fullMark * 0.5)) {
                    tr[++i].textContent = subject.studentMark;
                    tr[++i].textContent = "ض";
                    subject.studentGrade = "ض";
                }
                else {
                    tr[++i].textContent = subject.studentMark;
                    tr[++i].textContent = "ل";
                }

            }



        }
        else {
            console.log(subject.name + "4")

            console.log("undefiend situation")
        }


    })

    tr[++i].textContent = studentTotalMarks;
    student.totalMarks = studentTotalMarks;
    student.totalGrade = calcGrade(student.totalYearMarks, studentTotalMarks)
    tr[++i].textContent = student.totalGrade;

    return student;
}


// second iteration


function fillStudentFixedPresentage(tr, student, fixedPresentageValue) {
    let i = 4;
    let studentTotalMarks = 0;

    student.subjects.forEach(function (subject) {

        //term 1 and is contiued
        if (subject.isContinued && subject.term == 1 && !subject.havePracticalExam) i = i + 4;
        else if (subject.isContinued && subject.term == 1 && subject.havePracticalExam) i = i + 5;
        // not continued
        else if (!subject.isContinued && !subject.isFromPastYear) {
            (subject.havePracticalExam) ? i = i + 3 : i = i + 2;

            if (subject.studentMark == "رل") i = i + 2;
            else if (isNeedFixedPresentage(subject.fullMark, subject.studentMark, fixedPresentageValue)) {

                subject.studentMark = subject.fullMark * 0.5;
                subject.studentGrade = "ل";

                tr[i].textContent = subject.studentMark;
                tr[++i].textContent = subject.studentGrade;
                i++;
                studentTotalMarks = studentTotalMarks + subject.studentMark;
            }
            else {

                i = i + 2;
                studentTotalMarks = studentTotalMarks + subject.studentMark;
            };

        }

        // subject in term 2 and mekamela
        else if (subject.isContinued && subject.term == 2) {

            (subject.havePracticalExam) ? i = i + 5 : i = i + 4;
            if (subject.studentTotalGrade == "رل") i = i + 2;
            else if (isNeedFixedPresentage(subject.totalFullMark, subject.student2termsMark, fixedPresentageValue)) {
                //console.log(subject)
                subject.student2termsMark = subject.totalFullMark * 0.5;
                subject.studentTotalGrade = "ل";
                tr[i].textContent = subject.student2termsMark;   
                tr[++i].textContent = subject.studentTotalGrade;
                i++;
                studentTotalMarks = studentTotalMarks + subject.student2termsMark;
            }
            else {

                i = i + 2;
                studentTotalMarks = studentTotalMarks + subject.student2termsMark;
            };
        }

        // subjects form past year 
        else if (subject.isFromPastYear) {
            i = i + 7;
            if (subject.studentMark == "رل") i = i + 2;
            
            else if (isNeedFixedPresentage(subject.fullMark, subject.studentMark, fixedPresentageValue)) {
                subject.studentMark = subject.fullMark * 0.5;
                subject.studentGrade = "ل";
                tr[i].textContent = subject.studentMark;
                tr[++i].textContent = subject.studentGrade;

            }
            else i = i + 2;

        }

    });
    student.totalMarks = studentTotalMarks;
    student.totalGrade = calcGrade(student.totalYearMarks, studentTotalMarks)
    let width = tr.length;
    tr[width - 3].textContent = student.totalMarks;
    tr[width - 2].textContent = student.totalGrade;
    return student;
}



//Third iteration
function applyMercy(tr, student, totalMercyPresentageList, mercyPresentageForSubjectList, periority, subjectsCanFail, subjectsCanFailH, fixedPresentagevalueForTotal) {

    totalMercyPresentage = mercyType(student.status, totalMercyPresentageList);
    mercyPresentageForSubject = mercyType(student.status, mercyPresentageForSubjectList)
    let mercyMarks = student.totalYearMarks * totalMercyPresentage * 0.01;
    let i = 4;
    let basket = [];
    //console.log(student)
    // inputs are 2 8 humanity
    student.subjects.forEach(function (subject) {

        let canTakeMercy = (subject.studentGrade == "ض" || subject.studentGrade == "رل");
        let canTakeMercyforcont = (subject.studentTotalGrade == "ض" || subject.studentTotalGrade == "رل");
        if (subject.isContinued && subject.term == 1 && !subject.havePracticalExam) i = i + 4;
        else if (subject.isContinued && subject.term == 1 && subject.havePracticalExam) i = i + 5;
        else if (!subject.isContinued && !subject.isFromPastYear) {
            (subject.havePracticalExam) ? i = i + 3 : i = i + 2;
            if (canTakeMercy) {
                //console.log("yes can take 1 ")
                subject.cordinate = i;
                subject.neededMarks = subject.fullMark * 0.5 - subject.studentMark;
                subject.neededPresentage = (subject.neededMarks / subject.fullMark) * 100;
                basket.push(subject);
                i = i + 2;

            }
            else i = i + 2;

        }

        else if (subject.isContinued && subject.term == 2) {
            (subject.havePracticalExam) ? i = i + 5 : i = i + 4;
            if (canTakeMercyforcont) {
                //console.log("yes can take 2 ")
                subject.cordinate = i;
                subject.neededMarks = subject.totalFullMark * 0.5 - subject.student2termsMark;
                subject.neededPresentage = (subject.neededMarks / subject.totalFullMark) * 100;
                basket.push(subject);
                i = i + 2;
            }
            else i = i + 2

        }

        else if (subject.isFromPastYear) {
            i = i + 7;

            if (canTakeMercy) {
                //console.log("yes can take 3 ")
                subject.cordinate = i;
                subject.neededMarks = subject.fullMark * 0.5 - subject.studentMark;
                subject.neededPresentage = (subject.neededMarks / subject.fullMark) * 100;
                basket.push(subject);
                i = i + 2;

            }
            else i = i + 2;
        }
        else {
            console.log("undefined situation")
        }


    })


    for (let n = 0; n < basket.length; n++) {
        if (basket[n].studentGrade == "رل" || basket[n].studentTotalGrade == "رل" 
        ||((basket[n].studentMark / basket[n].fullMark) < ((50 - mercyPresentageForSubject) * 0.01))
        ||((basket[n].student2termsMark / basket[n].totalFullMark) < ((50 - mercyPresentageForSubject) * 0.01))) {
            basket[n].neededMarks = 9999;
        }
    }
    //////end filling the basket
    // periority sorting is not impemented 
    let sortedBasket = objSort(basket, ["isFromPastYear", true], "neededMarks", "neededPresentage", "type");

    // start mercy
    if (sortedBasket.length == 0) {
        // mercy for  el magmou3 elkoly
        let newTotalMercy = TakeMercyInTotal(student.totalYearMarks, student.totalMarks, fixedPresentagevalueForTotal, student.totalGrade)
        // return new total mercy and new total grade if not return the old
        student.totalMarks = newTotalMercy[0];
        student.totalGrade = newTotalMercy[1];
        let width = tr.length;

        tr[width - 3].textContent = student.totalMarks;
        tr[width - 2].textContent = student.totalGrade;
        tr[width - 1].textContent = "ناجح";



    }


    else if (sortedBasket.length > 0) {
        let isWillTakeMercy = mercyWillHelp(sortedBasket, mercyMarks, subjectsCanFail, subjectsCanFailH)
        // this array contain 1- is rafa help  2- number of subject that will take rafa
        //3- number of subjects that will not take rafa  4- student status nagi7 , nagi7 with subjects , rasib
        console.log(isWillTakeMercy);
        if (isWillTakeMercy[0] == false) {
            let width = tr.length;

            tr[width - 3].textContent = "-";
            tr[width - 2].textContent = "-";
            tr[width - 1].textContent = "راسب";


        }
        ///  will take mercy in all the subjects
        else if (isWillTakeMercy[0] == true && isWillTakeMercy[2] == 0) {
            let extraTotalMarks = 0;
            for (let i = 0; i < sortedBasket.length; i++) {
                if (sortedBasket[i].student2termsMark != null) {
                    extraTotalMarks = extraTotalMarks + sortedBasket[i].neededMarks;
                    sortedBasket[i].student2termsMark = sortedBasket[i].fullMark;
                    sortedBasket[i].studentTotalGrade = "ل";
                    let x = sortedBasket[i].cordinate
                    tr[x].textContent = sortedBasket[i].student2termsMark;
                    tr[x + 1].textContent = "ل";

                }

                else {
                    extraTotalMarks = extraTotalMarks + sortedBasket[i].neededMarks;
                    sortedBasket[i].studentMark = sortedBasket[i].fullMark * 0.5;
                    sortedBasket[i].studentGrade = "ل";
                    let x = sortedBasket[i].cordinate;
                    tr[x].textContent = sortedBasket[i].studentMark;
                    tr[x + 1].textContent = "ل";

                }


            }

            student.totalMarks = student.totalMarks + extraTotalMarks;
            let width = tr.length;

            tr[width - 3].textContent = student.totalMarks;
            tr[width - 2].textContent = calcGrade(student.totalYearMarks, student.totalMarks);
            tr[width - 1].textContent = "ناجح";

        }


        ///  nagi7 with subjects
        else if (isWillTakeMercy[0] == true && isWillTakeMercy[2] > 0) {
            let extraTotalMarks = 0;
            for (let i = 0; i < (isWillTakeMercy[1]); i++) {      // -1 غيرناها   // isWillTakeMery[i] - 1
                if (sortedBasket[i].student2termsMark != null) {
                    extraTotalMarks = extraTotalMarks + sortedBasket[i].neededMarks;
                    sortedBasket[i].student2termsMark = sortedBasket[i].fullMark;
                    sortedBasket[i].studentTotalGrade = "ل";
                    let x = sortedBasket[i].cordinate
                    tr[x].textContent = sortedBasket[i].student2termsMark;
                    tr[x + 1].textContent = "ل";

                }

                else {
                    extraTotalMarks = extraTotalMarks + sortedBasket[i].neededMarks;
                    sortedBasket[i].studentMark = sortedBasket[i].fullMark * 0.5;
                    sortedBasket[i].studentGrade = "ل";
                    let x = sortedBasket[i].cordinate;
                    tr[x].textContent = sortedBasket[i].studentMark;
                    tr[x + 1].textContent = "ل";

                }
            }
            student.totalMarks = student.totalMarks + extraTotalMarks;
            console.log(extraTotalMarks)
            let width = tr.length;

            //tr[width - 3].textContent = student.totalMarks;
            tr[width - 3].textContent = "-";
            
            //tr[width - 2].textContent = calcGrade(student.totalYearMarks, student.totalMarks);
            tr[width - 2].textContent = "-"
            tr[width - 1].textContent = " ناجح بمواد";


        }




    }



}












function calcGrade(fullMark, studentMark) {

    if (studentMark > fullMark * 0.85) return "م"
    else if (studentMark >= fullMark * 0.75) return "جج"
    else if (studentMark >= fullMark * 0.65) return "ج"
    else if (studentMark >= fullMark * 0.50) return "ل"
    else if (!studentMark || studentMark == 0) return "error"
    else return "ض"

}

function isNeedFixedPresentage(fullMark, studentMark, fixedPresentage) {
    let fixed = 0.5 - fixedPresentage * 0.01;
    if (studentMark < fullMark * 0.5 && studentMark >= fullMark * fixed) return true;
    else return false;


}

function exportTableToCSV(filename) {
    let csv = [];
    let rows = document.querySelectorAll("table tr");

    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td, th");

        for (let j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

function downloadCSV(csv, filename) {
    let csvFile;
    let downloadLink;


    // CSV file
    csvFile = new Blob(["\ufeff", [csv]]);

    //csvFile = new Blob([csv], {type: "application/xlxs"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

function objSort() {
    var args = arguments,
        array = args[0],
        case_sensitive, keys_length, key, desc, a, b, i;

    if (typeof arguments[arguments.length - 1] === 'boolean') {
        case_sensitive = arguments[arguments.length - 1];
        keys_length = arguments.length - 1;
    } else {
        case_sensitive = false;
        keys_length = arguments.length;
    }

    return array.sort(function (obj1, obj2) {
        for (i = 1; i < keys_length; i++) {
            key = args[i];
            if (typeof key !== 'string') {
                desc = key[1];
                key = key[0];
                a = obj1[args[i][0]];
                b = obj2[args[i][0]];
            } else {
                desc = false;
                a = obj1[args[i]];
                b = obj2[args[i]];
            }

            if (case_sensitive === false && typeof a === 'string') {
                a = a.toLowerCase();
                b = b.toLowerCase();
            }

            if (!desc) {
                if (a < b) return -1;
                if (a > b) return 1;
            } else {
                if (a > b) return -1;
                if (a < b) return 1;
            }
        }
        return 0;
    });
} //end of objSort() function

//
function mercyType(status, mercyList) {
    if (status == "مستجد") return mercyList[0];
    else if (status == "باق") return mercyList[1];
    else if (status == "من الخارج 1") return mercyList[2];
    else if (status == "معرض للفصل") return mercyList[3];
    else return mercyList[0];


}


function mercyWillHelp(sortedBasket, totalMercyMarks, subjectsCanFail, subjectsCanFailH) {
    var mercyMarks = totalMercyMarks;
    let subjectsNotTakeMercy = 0;
    let subjectsNotTakeMercyStartAt;

    ///
    for (i = 0; sortedBasket.length > i; i++) {

        if (sortedBasket[i].neededMarks < mercyMarks) {
            // need to change elmo3adela 
            mercyMarks = mercyMarks - sortedBasket[i].neededMarks;

        }

        else {

            subjectsNotTakeMercy = sortedBasket.length - i;
            subjectsNotTakeMercyStartAt = i;
            break;

        }

    }

    //  here you know which subject will not take mercy
    if (subjectsNotTakeMercy == 0) {
        return [true, sortedBasket.length, 0, "ناجح"]

    }
    else {

        let humanSubjects = 0;
        let spSubjects = 0;
        for (let j = subjectsNotTakeMercyStartAt; sortedBasket.length > j; j++) {
            (sortedBasket[j].type == "humanity") ? humanSubjects++ : spSubjects++;

        }

        if ((spSubjects > subjectsCanFail) || (humanSubjects > subjectsCanFailH)) {
            return [false, 0, spSubjects + humanSubjects, "راسب"]
        }

        // معاه مادتين ومادتين بس هيعدي
        else {
            let subjectsThatWillTakeRafa = sortedBasket.length - (spSubjects + humanSubjects);
            return [true, subjectsThatWillTakeRafa, spSubjects + humanSubjects, "ناجح بمواد"]
        }
    }

}


function TakeMercyInTotal(totalYearMarks, totalMarks, fixedPresentagevalueForTotal, totalGrade) {
    let studentPresentage = totalMarks / totalYearMarks;
    let p = fixedPresentagevalueForTotal * 0.01;
    if ((p > (0.65 - studentPresentage)) && ((0.65 - studentPresentage) > 0)) {
        return [totalYearMarks * 0.65, "ج"]
    }
    else if ((p > (0.75 - studentPresentage)) && ((0.75 - studentPresentage) > 0)) {

        return [totalYearMarks * 0.75, "جج"]

    }

    else if ((p > (0.85 - studentPresentage)) && ((0.85 - studentPresentage) > 0)) {
        return [totalYearMarks * 0.85, "م"]
    }

    else return [totalMarks, totalGrade]

}



