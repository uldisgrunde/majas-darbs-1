//head of document
function head(title,page) {
    document.write(`<div class="wrap">
						<div class="header">
							<img src="/static/img/logo.png">
							<h2>Datortehnikas uzskaites sistēma</h2>
							<hr>
				</div>
				<div class="content">`);
    if (title != "") {
        document.write(`<a href="${page}">
							<img class="back_btn" src="/static/img/back.png">
							Atpakaļ
						</a>
						<h2 id="h2b">${title}</h2>`);
    }
}

function foot() {
    document.write(`<div class="footer">
						<hr>
						(c) 2020 Sia "Kafijas automāts"
					</div>
				</div><!--beidzas wrap-->`);
}

function rad(obj,simb) {
	//slepj /rada blokus
	if (obj.value == "+") {
		document.getElementById(simb + obj.id).style.display = "block";
		obj.value = "-";
	} else {
		document.getElementById(simb + obj.id).style.display = "none";
		obj.value = "+";
	}
}

function meklet(lauks,myId) {
  //meklesana tabula  
	var input, filter, table, tr, td, i, txtValue;
	input = document.getElementById(myId);  
	filter = input.value.toUpperCase();
	console.log(filter);
	table = document.getElementById("myTable");
	tr = table.getElementsByTagName("tr");
	for (i = 0; i < tr.length; i++) {
	  td = tr[i].getElementsByTagName("td")[lauks]; // noradam pec kura lauka mekleet
	  if (td) {
		txtValue = td.textContent || td.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		  tr[i].style.display = "";
		} else {
		  tr[i].style.display = "none";
		}
	  }       
	}
}

function findGetParameter(parameterName) { 
	//nolasa GET parametrus
    let items = location.search.substr(1).split("&");
	let result ="";
    for (let i = 0; i<items.length; i++){
        let tmp = items[i].split("=");
        if (tmp[0] === parameterName){
			//result = decodeURIComponent(tmp[1]);
			result = tmp[1];
		}
    }
    return result;
} 

async function getList(jsonFile, objectId, selectItem){
	//parada datus tabula saraksta 
	let dati = await fetch(`https://armandspucs.github.io/majas-darbs-1/data/${jsonFile}.json`);
	let json = await dati.json();
	dati = json.dati;
	let rindas = "";
	for (let i in dati) {
		rindas += `<option value="${dati[i].name}" ${(dati[i].name==selectItem?" Selected":"")}>${dati[i].name}</option>\n`;
	}
	document.getElementById(objectId).innerHTML+= rindas;
}

async function getData(jsonFile,objectId,list,next){ 
	//parada datus tabula faila 
	let dati = await fetch(`https://armandspucs.github.io/majas-darbs-1/data/${jsonFile}.json`);
	let json = await dati.json();
	dati = json.dati;
	let rindas = "";
	for (i = 0; i < dati.length; i++){
		rindas += "<tr>";
		for (j = 0; j < list.length; j++){
			rindas += `<td>${dati[i][list[j]]}</td>`;
		 }
		rindas += "</tr>";
	}
	document.getElementById(objectId).innerHTML=rindas;
	eval(next);
}

function statuss(tableID){
	//statusa pielioksana tabula
	let table=document.getElementById(tableID);
	for (i = 0; i < table.rows.length;i++){
		switch(table.rows[i].cells[table.rows[i].cells.length-1].innerHTML){
			case "Izpildīts":
				table.rows[i].cells[table.rows[i].cells.length-1].innerHTML=table.rows[i].cells[table.rows[i].cells.length-1].innerHTML+`<br><input type="button" value="Atkārtoti pieteikt" onclick="">`;
			break
			default:
				let txt=table.rows[i].cells[table.rows[i].cells.length-1].innerHTML;
				table.rows[i].cells[table.rows[i].cells.length-1].innerHTML=`<select id="l${i}"></select>`;
				getList("status", `l${i}`, txt);
		}
	}
}

function state(tableID){
	//stavokla pieliksana tabula
	let table=document.getElementById(tableID);
	for (let i=0; i<table.rows.length;i++){
		if(table.rows[i].cells[0].innerHTML.trim().toUpperCase()!="DATORI"){
			table.rows[i].cells[1].innerHTML=(table.rows[i].cells[1].innerHTML=="0"?"&#8855":"&#x2713");
		}
	}
}


async function validateForm(form){
	//paroles parbaude
	let u = document.getElementById("user").value;
	let p = document.getElementById("password").value;
	let rez=false;
	let fails = await fetch(`https://armandspucs.github.io/majas-darbs-1/data/admin.json`);
	let json = await fails.json();
	dati = json.admin;
	for (let i in dati){
		if(dati[i].nik==u && dati[i].pwd==p){
			rez=true;
		}
	}
	if(rez){
		form.submit();
	}else{
		alert("Aizpildiet korekti laukus!");
	}
}

async function klasesTehnikaf() {
    let kabinetaNr;
    let datoruSkaits, projektoruSkaits, skanduSkaits; 
    let telpa, tips;
    let irProjektors, irSkandas,vajagSkandas, vajagDatoru,vajagProjektoru;
    //let datoruDB =fetch('https://armandspucs.github.io/majas-darbs-1/data/datoruDB.json')
    let roomDB = await fetch('https://armandspucs.github.io/majas-darbs-1/data/room.json')
    let roomJson = await roomDB.json();
    let datoruDB = await fetch('https://armandspucs.github.io/majas-darbs-1/data/visas_tehnikas_db.json')
    let pcJson = await datoruDB.json();
    let kabinetuSkaits=roomJson.dati.length;   
    let garums=pcJson.dati.length;
    vajagSkandas=document.getElementById("skandas").checked;
    vajagDatoru=document.getElementById("datori").checked;
    vajagProjektoru=document.getElementById("projektors").checked;
    //nodzēst tabulas rindas
    let tabRindas=document.getElementById('trindas');
    let rskaits = document.getElementById('trindas').rows.length;
    let tr = tabRindas.getElementsByTagName("tr");
    for (let r = 0; r < rskaits; r++) {
        tr[r].style.display = "none";
    }
    //aizpildīt tabulas rindas
    let atlasesNr=document.getElementById('mekletKlasi').value;
    //console.log(atlasesNr);
    for(let j=0;j<kabinetuSkaits;j++){
        irProjektors='-';
        irSkandas='-';
        kabinetaNr=roomJson.dati[j]['name'];
        datoruSkaits=0;
        projektoruSkaits=0;
        skanduSkaits=0;
        
    for(let i=0;i<garums;i++){
       telpa=pcJson.dati[i]['name'];
        tips=pcJson.dati[i]['tips'];
       if(telpa==kabinetaNr && tips=="dators ")
               {
            datoruSkaits++;
        }
        if(telpa==kabinetaNr && tips=="projektors ")
            {
            projektoruSkaits++;
        }
        if(telpa==kabinetaNr && tips=="skandas ")
            {
        skanduSkaits++;
        }  

    }
    if (projektoruSkaits>0)
        {
        irProjektors='&#x2713';
    }
    if (skanduSkaits>0)
        {
        irSkandas='&#x2713';
    }
    let rinda = document.getElementById('rinda');
    switch (true){
        case atlasesNr == kabinetaNr  :
            rinda.innerHTML += `
            <tr>
				<td>${kabinetaNr}</td>
				<td>${irProjektors}</td>
				<td>${datoruSkaits}</td>
				<td>${irSkandas}</td>
				<td><a href="/klase/${kabinetaNr}">Informācija</a> </td>
            </tr>`;
        break;
        case vajagSkandas && skanduSkaits>0  :
            rinda.innerHTML += `
            <tr>
				<td>${kabinetaNr}</td>
				<td>${irProjektors}</td>
				<td>${datoruSkaits}</td>
				<td>${irSkandas}</td>
				<td><a href="klase/k=${kabinetaNr}">Informācija</a></td>
            </tr>`;
        break;
    
        case vajagDatoru && datoruSkaits>0  :
           rinda.innerHTML += `
            <tr>
				<td>${kabinetaNr}</td>
				<td>${irProjektors}</td>
				<td>${datoruSkaits}</td>
				<td>${irSkandas}</td>
				<td><a href="klase/${kabinetaNr}">Informācija</a></td>
            </tr>`;
        break;
        case vajagProjektoru && projektoruSkaits>0  :
            rinda.innerHTML += `
            <tr>
				<td>${kabinetaNr}</td>
				<td>${irProjektors}</td>
				<td>${datoruSkaits}</td>
				<td>${irSkandas}</td>
            <td><a href="klase/${kabinetaNr}">Informācija</a></td>
            </tr>`;
        break;
        
		}
    }

}

function nomainiLaukus() {
    var x = document.getElementById("tehnika").value;  
    document.getElementById("datortehnika").innerHTML = x;
    switch  (x){
        case 'dators':
        document.getElementById("nos1").textContent = "Procesors";
        document.getElementById("nos2").textContent = "RAM";
        document.getElementById("nos3").textContent = "Cietais disks";
        document.getElementById("nos4").textContent = "OS";
        break;
        case 'monitors':
        document.getElementById("nos1").textContent = "Ražotājs";
        document.getElementById("nos2").textContent = "Izmērs";
        document.getElementById("nos3").textContent = "Video ieejas";
        document.getElementById("nos4").textContent = "Skaņa";
        break;
        case 'printeris':
        document.getElementById("nos1").textContent = "Ražotājs";
        document.getElementById("nos2").textContent = "tips";
        document.getElementById("nos3").textContent = "Papīra izmērs";
        document.getElementById("nos4").textContent = "toneris";
        break;
    }
  }


async function sikaakPeecNumura(a){
	  //parāda datus tabula failā fetch_test.html

    let datiNoServera = await fetch('https://armandspucs.github.io/majas-darbs-1/data/datoruDB.json');
    let datiJson = await datiNoServera.json();

    let ierakstu_skaits = datiJson.dati.length;
    //ievērojiet ka visa info ir apakšobjektā 'dati' (tāda struktūra no excel nāk)

    tabulasRindas = document.getElementById('rinda');
    for (i = 0; i < ierakstu_skaits; i++) {

       
		if (datiJson.dati[i]['inventaraNr']==a){
			
        tabulasRindas.innerHTML += `
		<br>
		<br> ` + datiJson.dati[i]['inventaraNr'] + ` 
		<br> ` + datiJson.dati[i]['iegadesGads'] + ` 
		<br> ` + datiJson.dati[i]['piegadatajs'] + ` 
		<br>`;
		}
    } //loop beigas

}

/*
"id": "2",
            "tips": "dators ",
            "inventaraNr": "1239-541 ",
            "iegadesGads": "2018",
            "piegadatajs": "Sia Dators",
            "razotajs" : "HP",
            "procesors": "i7 ",
            "ram": "8GB",
            "cietaisDisks": "ssd 250GB",
            "os": "win10"
*/

//---------------------------------------------------------------------
async function raditVisasTehnikasDB() //parāda datus tabula failā fetch_test.html
{
    let datiNoServera = await fetch('https://armandspucs.github.io/majas-darbs-1/data/visas_tehnikas_db.json');
    let datiJson = await datiNoServera.json();

    let ierakstu_skaits = datiJson.dati.length;
    //ievērojiet ka visa info ir apakšobjektā 'dati' (tāda struktūra no excel nāk)

    tabulasRindas = document.getElementById('tabulasRindas');

    for (i = 0; i < ierakstu_skaits; i++) {

        tabulasRindas.innerHTML += `
		<tr>
			<td> ` + datiJson.dati[i]['tips'] + ` </td>
			<td> ` + datiJson.dati[i]['inventaraNr'] + ` </td>
			<td> ` + datiJson.dati[i]['name'] + ` </td>
			<td> <a class="button" id="`+ datiJson.dati[i]['inventaraNr']+`" href="#">sīkāka informācija</a> </td>
		</tr>`;
    } //loop beigas
}


