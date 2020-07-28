// Defining classes /////////////////////////////////////////////////////////////////////////////////////////////

class File {

	constructor  () {
		this.file = null;
		this.rows = null;
		this.headers = null;
	}

	handle_file (file) {
		this.file = file;
		this.convert_to_json();
	}

	convert_to_json () {
		let fileReader = new FileReader();
		fileReader.readAsBinaryString(this.file);
		fileReader.onload = (event)=>{
			let data = event.target.result;
			let workbook = XLSX.read(data,{type:"binary"});
			let first_sheet_name = workbook.SheetNames[0];
			this.rows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[first_sheet_name]);
			this.headers = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[first_sheet_name], {raw:true, header:1})[0];
			this.create_students_objects();
		};
	}

	create_students_objects () {
		let rows_length = this.rows.length;
		let row = null;
		for (let i = 0; i < rows_length; i = i +1) {
			row = this.rows[i];
			let student_wishes = this.create_student_wishes(row);
			my_students.add_student(row["الكود"], row["الاسم"], student_wishes, row["حالة النجاح"], row["المجموع"]);
		}
		my_page.dispaly_departments_limits(this.headers.slice(3, 7));
	}

	create_student_wishes (row) {
		let wishes = {};
		for (let i = 3; i < 7; i = i +1) {
			wishes[this.headers[i]] = row[this.headers[i]];
		}
		return wishes;
	}

}

class Student {

	constructor (id, name, wishes, status, marks)
	{
		this.id = id;
		this.name = name;
		this.wishes = wishes;
		this.status = status;
		this.marks = marks;
	}

}

class Students {

	constructor ()
	{
		this.students_list = [];
	}

	add_student (id, name, wish_list, status, marks) {
		this.students_list.push(new Student(id, name, wish_list, status, marks));
	}

}

class Page {
	constructor () {
		this.start_page =  `<div class="row margin-top-15">
								<div class="col-2"></div>
								<div class="col-8">
									<div class="jumbotron">
										<h1 class="center">Students Distribution</h1>      
										<p style="text-align: center">
											Upload the excel sheet containing the students, their marks and their wish list.
										</p>
										<input class="inputfile" type="file" name="file" id="file">
										<label class="inputlabel center" for="file">Choose an excel file</label>
									</div>
								</div>
								<div class="col-2"></div>
							</div>`;
		this.departments_limits = ` <div class="row margin-top-15">
										<div class="col-2"></div>
										<div class="col-8">
											<div class="jumbotron">
												<h1 class="center" style="margin-bottom: 2vh;">Students Distribution</h1>      
												<div class="list-group" style="text-align: right;">
													__DEPARTMENTS__
												</div>
												<label class="inputlabel center" for="file" style="margin-top: 3vh; font-size: 1.5rem;">Distribute</label>
											</div>
										</div>
										<div class="col-2"></div>
									</div>`
	}

	dispaly_start_page () {
		document.getElementsByClassName("conatiner")[0].innerHTML = this.start_page;
	}

	dispaly_departments_limits (departments) {
		let departments_length = departments.length;
		let html_flavors_list = ["primary", "success", "danger", "warning", "info"];
		let html_department = `  <div class="list-group-item list-group-item-action list-group-item-__FLAVOR__ disable-hover-pointer">
									<input type="number"  id="__DEPARTMENT___limited_value" name="__DEPARTMENT___limit_value" disabled>&nbsp;&nbsp;&nbsp;
									<label for="__DEPARTMENT___limited">Limited</label>&nbsp;&nbsp;
									<input type="radio"  class="department_limited" id="__DEPARTMENT___limited" name="__DEPARTMENT___limitation" value="__DEPARTMENT___limited">
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<label for="__DEPARTMENT___unlimited">Unlimited</label>&nbsp;&nbsp;
									<input type="radio" class="department_unlimited" name="__DEPARTMENT___limitation"  id="__DEPARTMENT___unlimited" value="__DEPARTMENT___unlimited" checked>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									__DEPARTMENT__
								</div>`;
		let html_departments = "";
		for (let i = 0; i < departments_length; i = i +1) {
			html_departments += html_department.replace(/__DEPARTMENT__/g, departments[i]);
			html_departments = html_departments.replace("__FLAVOR__", html_flavors_list[i%5]);
		}
		this.departments_limits = this.departments_limits.replace("__DEPARTMENTS__", html_departments);
	
		document.getElementsByClassName("conatiner")[0].innerHTML = this.departments_limits;

		for (let i = 0; i < departments_length; i = i +1) {
			document.getElementsByClassName('department_limited')[i].addEventListener("change", (event) => {
				document.getElementById(event.target.id.replace("_limited", "") + "_limited_value").disabled = false;
			});
			document.getElementsByClassName('department_unlimited')[i].addEventListener("change", (event) => {
				document.getElementById(event.target.id.replace("_unlimited", "") + "_limited_value").disabled = true;
				document.getElementById(event.target.id.replace("_unlimited", "") + "_limited_value").value = null;
			});
		}
		
	}

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// Initializing classes /////////////////////////////////////////////////////////////////////////////////////////////

let my_file = new File();
let my_students = new Students();
let my_page = new Page();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// Defining event listeners /////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {

	my_page.dispaly_start_page();

	document.getElementById('file').addEventListener("change", (event) => {
		my_file.handle_file(file = event.target.files[0]);
	});
	
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////