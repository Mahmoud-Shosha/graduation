let subject_template = `<div class="input-data">
                            <label for="subName">اسم المقرر</label>
                            <input type="text" id="subName">
                            </div>
                            <div class="input-data">
                            <label for="total">الدرجه الكلية للمقرر</label>
                            <input type="number" id="total">
                            </div>
                            <div class="input-data">
                            <label for="classDegrees">درجات اعمال الفصل</label>
                            <input type="number" id="classDegrees">
                            </div>
                            <div class="input-data">
                            <label for="final">درجه الامتحان التحريرى</label>
                            <input type="number" id="final">
                            </div>
                            <div class="input-data">
                            <label for="practical">درجه الامتحان العملى</label>
                            <input type="number" id="practical">
                            </div>
                            <div class="input-data">
                            <label for="type">نوع المقرر</label>
                            <select name="type" id="type">
                            <option value="cont">تخصص</option>
                            <option value="final">غير تخصص</option>
                            <option value="final">انسانية</option>
                            </select>
                            </div>
                            <div class="input-data">
                            <label for="status">حاله المقرر</label>
                            <select name="status" id="status">
                            <option value="cont">مقرر منتهي</option>
                            <option value="final">مقرر متصل</option>
                            <option value="final">مقرر تخلف</option>
                            </select>
                        </div>
                        <hr style="width:100%;text-align:left;margin-left:0; margin-bottom: 6vh;">
                        `


document.getElementById("subjects_count").addEventListener("input", function (event){
    let subjects_count = document.getElementById("subjects_count").value;
    let subjects_list = "";

    for (let i = 0; i < subjects_count; i++)
    {
        subjects_list += subject_template;
    }
    
    document.getElementById("subjects_list").innerHTML = "";
    document.getElementById("subjects_list").insertAdjacentHTML("beforeend", subjects_list);
})