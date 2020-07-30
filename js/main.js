
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

	export_excel (department_students, department_name) {
		let department_students_length = department_students.length;
		let excel_data = [];
		for (let i = 0; i < department_students_length; i++) {
			excel_data.push(Object.values(department_students[i]));
			for (let j = 0; j < department_students[i].length; j++) {
				console.log(department_students[i]["wishes"]);
			}
		}
		var myTestXML = new myExcelXML(JSON.stringify(excel_data), this.headers);
		myTestXML.downLoad(department_name);
		console.log(this.headers);
	}

	create_students_objects () {
		let rows_length = this.rows.length;
		let row = null;
		my_students = new Students()
		for (let i = 0; i < rows_length; i = i +1) {
			row = this.rows[i];
			let student_wishes = this.create_student_wishes(row);
			my_students.add_student(row["الكود"], row["الاسم"], student_wishes, row["حالة النجاح"], row["المجموع"]);
		}
		my_page.dispaly_departments_limits(this.headers.slice(3, Object.keys(row).length-2));
	}

	create_student_wishes (row) {
		let wishes = {};
		let row_length = Object.keys(row).length;
		for (let i = 3; i < row_length-1; i = i +1) {
			wishes[this.headers[i]] = row[this.headers[i]];
		}
		return wishes;
	}

	get_user_options (user_options_ids) {
		let user_options_ids_length = user_options_ids.length;
		let user_options = [];
		for (let i = 0; i < user_options_ids_length; i = i +1) {
			user_options.push({});
			user_options[i]["department"] = user_options_ids[i]['limited'].replace("_limited", "");
			user_options[i]["limited"] = document.getElementById(user_options_ids[i]['limited']).checked;
			user_options[i]["unlimited"] = document.getElementById(user_options_ids[i]['unlimited']).checked
			user_options[i]["value"] = document.getElementById(user_options_ids[i]['value']).value;
			user_options[i]["population"] = 0;
		}
		return user_options;
	}

	validate_user_options (user_options) {
		let user_options_length = user_options.length;
		for (let i = 0; i < user_options_length; i = i +1) {
			if (user_options[i]["limited"] && !user_options[i]["value"]) {
				document.getElementById("error_modal").click();
				return false;
			}
		}
		return true;
	}

	increase_population (user_options, department) {
		user_options[user_options.indexOf(department)]["population"] += 1;
	}

	distribute (user_options_ids) {
		let user_options = this.get_user_options(user_options_ids);
		let my_students_length  = my_students.length();
		let user_options_length  = user_options.length;
		if (! this.validate_user_options(user_options)) return false;
		my_students.sort_students();

		for (let i = 0; i < my_students_length; i = i +1) {
			let student = my_students.get_student(i);
			for (let j = 1; j <= user_options_length; j = j +1) {
				let department = user_options.find(function (element) {return element.department == student.get_student_wish(j);})
				if (department["unlimited"]) {
					student["department"] = department["department"];
					this.increase_population(user_options, department);
					break;
				}
				if (department["limited"]) {
					if (department["population"] >= Number(department["value"])) {
						continue;
					} else {
						student["department"] = department["department"];
						this.increase_population(user_options, department);
						break;
					}
				}
			}
		}

		my_page.dispaly_tables(user_options);
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
		this.department = null;
	}

	get_student_wish (i) {
		let wishes_keys = Object.keys(this.wishes)
		let wishes_length = wishes_keys.length;
		for (let j = 0; j < wishes_length; j = j +1) {
			if (this.wishes[wishes_keys[j]] == i) return  wishes_keys[j];
		}
	}

}

class Students {

	constructor ()
	{
		this.students_list = [];
		this.header = [];
		this.departments = [];
	}

	add_student (id, name, wish_list, status, marks) {
		this.students_list.push(new Student(id, name, wish_list, status, marks));
	}

	sort_students () {
		let success_students = this.students_list.filter(student => student.status == "ناجح");
		let failure_students = this.students_list.filter(student => student.status != "ناجح");
		success_students.sort(function(a, b){return b['marks'] - a['marks']});
		failure_students.sort(function(a, b){return b['marks'] - a['marks']});
		this.students_list = success_students.concat(failure_students);
	}

	get_student (i) {
		return this.students_list[i];
	}

	length () {
		return this.students_list.length;
	}
}

class Page {
	constructor () {
		this.main_page = `<div class="row margin-top-15">
							<div class="col-1"></div>
							<div class="col-4">
								<button id="start_page" type="button" style="border-radius: 30px;background-color: #636EC2; border-color: #636EC2; font-size: 3rem; width: inherit; min-height: 18vh;" class="btn btn-primary">DEPARTMENT</button>
							</div>
							<div class="col-2"></div>
							<div class="col-4">
								<button type="button" style="border-radius: 30px; background-color: #636EC2; border-color: #636EC2; font-size: 3rem; width: inherit; min-height: 18vh;" class="btn btn-primary">RESULTS</button>
							</div>
							<div class="col-1"></div>
						</div>`;
		this.start_page =  `<div class="row" style="margin-top: 5vh;">
								<div class="col-3">
									<div class="container">
									<div class="row">
										<div class="col-12">
											<label id="distribute" class="distribute" style="border-radius: 0px 15px 15px 0px; margin-top: 18vh; font-size: 2.5rem;">Distribute</label>
										</div>
									</div>
									<div class="row" style="margin-top: 5vh;">
										<div class="col-12">
											<label class="help" style="border-radius: 0px 15px 15px 0px; font-size: 2.5rem;">Help</label>
										</div>
									</div>
									</div>
								</div>
								<div class="col-9">
									<div class="conatiner" style="margin-right:1vw;>
									<div class="row">
										<div class="col-12">
											<input class="inputfile" type="file" name="file" id="file">
											<label class="inputlabel center" style="border-radius:25px; font-size: 3rem;" for="file"><img src='images/add.png' style='height: 45px;' />&nbsp;&nbsp;Upload excel file</label>
											<div id="departments_list" style="border-radius:25px; min-height:40vh; background-color: #F1F2FA; margin-top: 2vh; color: #747EC8; font-size: 3.5rem; padding: 20px;"><div style="margin:auto; width: fit-content; padding-top: 10vh;">Empty</div></div>
										</div>
									</div>
									</div>
								</div>
							</div>`;
		this.departments_limits = ` <div class="row" style="font-size: 1.2rem;" style="margin-right: -17px;">
										<div class="col-12">
											__DEPARTMENTS__
										</div>
									</div>`
		this.table = `  <table class="table table-dark table-hover" style="margin-left: 15px; margin-botttom: 15vh;">
							<thead>
								<tr>
									__HEADERS__
								</tr>
							</thead>
							<tbody>
								__ROWS__
							</tbody>
						</table>`
	}

	dispaly_main_page () {
		document.getElementById("header_image").innerHTML = "<img src='images/main_header.png' style='width: 100vw;' />";
		document.getElementsByClassName("conatiner")[0].innerHTML = this.main_page;
	}

	dispaly_start_page () {
		document.getElementById("header_image").innerHTML = "<img src='images/start_header.png' style='width: 100vw;' />";
		document.getElementsByClassName("conatiner")[0].innerHTML = this.start_page;
		document.getElementById('file').addEventListener("change", (event) => {
			my_file.handle_file(event.target.files[0]);
		});
	}

	dispaly_departments_limits (departments) {
		let departments_length = departments.length;
		let html_flavors_list = ["primary", "success", "danger", "warning", "info"];
		let html_department = `  <div style="margin: 10px; border: 2px solid #636EC2; border-radius: 10px; padding: 7px; background-color: white; color: #1B5872; text-align: right;" class="row">
									<input type="number"  id="__DEPARTMENT___limited_value" class="col-3" name="__DEPARTMENT___limit_value" style="border-width: 0px; background-color: #F1F2FA;" disabled>
									<label for="__DEPARTMENT___limited"  class="col-2">
										Limited 
										<input type="radio"  class="department_limited" id="__DEPARTMENT___limited" name="__DEPARTMENT___limitation" value="__DEPARTMENT___limited">
									</label>
									<label for="__DEPARTMENT___unlimited"  class="col-2">
										Unlimited
										<input type="radio" class="department_unlimited" name="__DEPARTMENT___limitation"  id="__DEPARTMENT___unlimited" value="__DEPARTMENT___unlimited" checked>
									</label>
									<p class="col-5">
										__DEPARTMENT__
									</p>
								</div>`;
		let html_departments = "";
		let user_options_ids = [];
		for (let i = 0; i < departments_length; i = i +1) {
			user_options_ids.push({
									"value": departments[i] + "_limited_value", 
									"limited": departments[i] + "_limited",
									"unlimited": departments[i] + "_unlimited"
								});
			html_departments += html_department.replace(/__DEPARTMENT__/g, departments[i]);
			html_departments = html_departments.replace("__FLAVOR__", html_flavors_list[i%5]);
		}
		let departments_limits = this.departments_limits.replace("__DEPARTMENTS__", html_departments);
	
		document.getElementById("departments_list").innerHTML = departments_limits;


		for (let i = 0; i < departments_length; i = i +1) {
			document.getElementsByClassName('department_limited')[i].addEventListener("change", (event) => {
				document.getElementById(event.target.id.replace("_limited", "") + "_limited_value").disabled = false;
			});
			document.getElementsByClassName('department_unlimited')[i].addEventListener("change", (event) => {
				document.getElementById(event.target.id.replace("_unlimited", "") + "_limited_value").disabled = true;
				document.getElementById(event.target.id.replace("_unlimited", "") + "_limited_value").value = null;
			});
		}

		document.getElementById('distribute').addEventListener("click", (event) => {
			my_file.distribute(user_options_ids);
		});
	}

	dispaly_tables (user_options) {
		let student_keys = Object.keys(my_students.get_student(0));
		let html_table_header = "";
		let my_students_length = my_students.length();
		let html_table_rows = "";

		let table_header = [];
		let table_rows = [];

		document.getElementById("content_area").innerHTML = "";

		for (let i = 0; i < student_keys.length; i = i +1) {
			if (student_keys[i] == "wishes") {
				for (let k = 0; k < user_options.length; k = k +1) {
					table_header.push(user_options[k]["department"]);
					my_students.header.push(user_options[k]["department"]);
					my_students.departments.push(user_options[k]["department"]);
				}
				continue;
			}
			table_header.push("");
			my_students.header.push("");

		}
		let last_index  = student_keys.length + user_options.length-2
		table_header[0] = "الكود";
		my_students.header[0] = "الكود";
		table_header[1] = "الاسم";
		my_students.header[1] = "الاسم";
		table_header[last_index-2] = "حالة النجاح";
		my_students.header[last_index-2] = "حالة النجاح";
		table_header[last_index-1] = "المجموع";
		my_students.header[last_index-1] = "المجموع";
		table_header[last_index] = "القسم";
		my_students.header[last_index] = "القسم";

		for (let i = 0; i < my_students_length; i = i +1) {
			table_rows.push("<tr>");
			for (let j = 0; j < student_keys.length; j = j +1) {
				if (student_keys[j] == "wishes") {
					for (let k = 0; k < user_options.length; k = k +1) {
						table_rows.push(my_students.get_student(i)[student_keys[j]][user_options[k]["department"]]);
					}
					continue;
				}
				table_rows.push(my_students.get_student(i)[student_keys[j]]);
			}
			table_rows.push("</tr>");
		}

		for (let j = 0; j < user_options.length; j = j +1) {
			let row = null;
			html_table_header = "";
			html_table_rows = "";

			document.getElementById("content_area").insertAdjacentHTML("beforeend", "<label class='inputlabel center' style='border-radius:25px; font-size: 2rem; cursor: auto; margin: 0px 50px;'><img src='images/excel.png' style='height: 45px;  cursor: pointer;' title='export excel' class='department_image' id='" + user_options[j]["department"] + "' />&nbsp;&nbsp;" + user_options[j]["department"] + "</label>");

			for (let i = 0; i < table_rows.length; i = i + table_header.length+2) {
				row = table_rows.slice(i, i+table_header.length+2);
				if (row.find(element => element == user_options[j]["department"]) != undefined){
					for (let k = 0; k < row.length; k = k + 1) {
						if (row[k] == "<tr>" || row[k] == "</tr>") {
							html_table_rows += row[k];
							continue;
						}
						html_table_rows += "<td>" + row[k] + "</td>";	
					}
				}
			}
			let filled_html_table = this.table.replace("__ROWS__", html_table_rows);

			for (let i = 0; i < table_header.length; i = i +1) {
				html_table_header += "<th>" + table_header[i] + "</th>";
			}
			filled_html_table = filled_html_table.replace("__HEADERS__", html_table_header);


			document.getElementById("content_area").insertAdjacentHTML("beforeend", filled_html_table);
		}

		let department_images_length = document.getElementsByClassName('department_image').length;
		for (let i = 0; i < department_images_length; i++) {
			document.getElementsByClassName('department_image')[i].addEventListener("click", (event) => {
				let department_name = document.getElementsByClassName('department_image')[i].id;
				let department_students = [];
				for (let i = 0; i < my_students.length(); i++) {
					if (my_students.get_student(i).department == department_name) department_students.push(my_students.get_student(i));
				}
				my_file.export_excel(department_students, department_name);
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

	my_page.dispaly_main_page();
	// my_page.dispaly_start_page();

	document.getElementById('start_page').addEventListener("click", (event) => {
		my_page.dispaly_start_page();
	});
	
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////