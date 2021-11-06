var ex=[], ind;

var data;
var config;

// Building Decision Tree
var decisionTree;

// Building Random Forest
var numberOfTrees = 3;
var randomForest;

// Testing Decision Tree and Random Forest
var comic;

var decisionTreePrediction;
var randomForestPrediction;

function roughScale(x, base) {
  const parsed = parseInt(x, base);
  if (isNaN(parsed)) { return x }
  return parsed;
}

function createvaluetab(){ 
		var table = document.getElementById('tabvalue');
		const iind = document.getElementById('cols').value;

		if (table.rows.length == 0) {

			row = table.insertRow(0);

		}
		else {

			row = table.rows[0];

		}

		const iind1 = table.rows[0].cells.length;

		if (iind1 <= iind) {

			for (i = 1; i <= iind - iind1; i++) {
		
				var col = row.insertCell(0);
				col.style.width='100px';
				col.style.height='20px';
				col.contentEditable = "true";
			
			}

			if (iind1 > 0) {

				for (j = 0; j < iind1; j++) {

					row.cells[j].innerHTML = row.cells[j + (iind - iind1)].innerHTML;

				}
				for (j = iind1; j < iind; j++)
				row.cells[j].innerHTML = '';
			
			}

		}
		else {

			for (j = 1; j <= (iind1 - iind); j++){

				row.deleteCell(-1);

			}

		}

		
		// document.getElementById('0').disabled=true;
}

function createvaluetab1(){

		var table1 = document.getElementById('tabvalue1');
		table = document.getElementById('tabvalue');
		iind = document.getElementById('cols').value;
		jind = document.getElementById('rows').value;

		const jind1 = table1.rows.length; 
		var iind1 = '';
		if (jind1 > 0) {

			iind1 = table1.rows[0].cells.length;

		}

		for (j=0;j<=jind;j++) {
			
			row=table1.insertRow(0);
			
			for (i=1;i<=iind;i++) {
		
				var col = row.insertCell(0);
				col.style.width='100px';
				col.style.height='20px';
				col.contentEditable = "true";
		
			}	
		
		}
		
		for (i=0;i<iind;i++) {
		
			table1.rows[0].cells[i].innerHTML=table.rows[0].cells[i].innerHTML;
		
		}

		if (table1.rows.length > jind && jind1 != 0) {


			for (i = 1; i <= Math.min(jind + 1, jind1) - 1; i++) {

				for (j = 0; j < Math.min(iind, iind1); j++) {
					
					table1.rows[i].cells[j].innerHTML = table1.rows[1 + i + parseInt(jind)].cells[j].innerHTML;

				}

			}

			for (i = 1; i <= jind1; i++) {

				table1.deleteRow(-1);

			}

		}
	
}

function createvaluetab2(){
	
		table2=document.getElementById('tabvalue2');
		table=document.getElementById('tabvalue');
		iind=document.getElementById('cols').value;
		jind=document.getElementById('rows').value;
		catAttr=document.getElementById('catAttr').value;
		kind=0;
		
		while(table2.rows.length > 0) {
			
			table2.deleteRow(-1);

		}

		for (j=0;j<2;j++) {
			
			row=table2.insertRow(0);
			
			for (i=1;i<iind;i++) {
		
				col = row.insertCell(0);
				col.style.width='100px';
				col.style.height='20px';
				col.contentEditable = "true";
		
			}	
		
		}
		
		for (i=0;i<iind;i++) {
		
			if (table.rows[0].cells[i].textContent != catAttr) {
			
				table2.rows[0].cells[kind].textContent=table.rows[0].cells[i].textContent;
				kind++;
			
			}
		
		}
}

function createvar(){

var iind=document.getElementById('cols').value;
	jind=document.getElementById('rows').value;	
	table1=document.getElementById('tabvalue1');
	table=document.getElementById('tabvalue');
	table2=document.getElementById('tabvalue2');
	
	/*ВЫЗЫВАЕМ ПРОЦЕДУРЫ, КОТОРЫЕ ПАРСЯТ ТАБЛИЦЫ В СТРОКИ */
titlesinsting();
maintabinsting();
attrinsting();

for (jnd=1; jnd<=jind; jnd++){
	
	var myObj = new Object();
	
	for (ind=0; ind<iind; ind++){
		
		var myName = table.rows[0].cells[ind].innerHTML;
		
		myObj[myName] = roughScale(table1.rows[jnd].cells[ind].innerHTML, 10);
		
		//ex[ind][jnd-1]=table.rows[0].cells[ind].innerHTML + ": " + table1.rows[jnd].cells[ind].innerHTML;
	}
	ex[jnd - 1] = myObj; 
}
  
// Displaying predictions	
	// Training set
data = ex;
// Configuration
config = {
    trainingSet: data, 
    categoryAttr: document.getElementById('catAttr').value,
    ignoredAttributes: [document.getElementById('ignAttr').value]
};

decisionTree = new dt.DecisionTree(config);
randomForest = new dt.RandomForest(config, numberOfTrees);

var myObj1 = new Object();

for (ind=0; ind<iind - 1; ind++){
		
		var myName1 = table2.rows[0].cells[ind].innerHTML;
		
		myObj1[myName1] = roughScale(table2.rows[1].cells[ind].innerHTML,10);
		
		//ex[ind][jnd-1]=table.rows[0].cells[ind].innerHTML + ": " + table1.rows[jnd].cells[ind].innerHTML;
}

comic = myObj1;//{person: 'Comic guy', hairLength: 8, weight: 290, age: 38};

decisionTreePrediction = decisionTree.predict(comic);
randomForestPrediction = randomForest.predict(comic);


document.getElementById('testingItem').innerHTML = JSON.stringify(comic, null, 0);
document.getElementById('decisionTreePrediction').innerHTML = JSON.stringify(decisionTreePrediction, null, 0);
document.getElementById('randomForestPrediction').innerHTML = JSON.stringify(randomForestPrediction, null, 0);

// Displaying Decision Tree
document.getElementById('displayTree').innerHTML = treeToHtml(decisionTree.root);

}


// Recursive (DFS) function for displaying inner structure of decision tree
function treeToHtml(tree) {

	
    // only leafs containing category
    if (tree.category) {
        return  ['<ul>',
                    '<li>',
                        '<a href="#">',
                            '<b>', tree.category, '</b>',
                        '</a>',
                    '</li>',
                 '</ul>'].join('');
    }
    
    return  ['<ul>',
                '<li>',
                    '<a href="#">',
                        '<b>', tree.attribute, ' ', tree.predicateName, ' ', tree.pivot, ' ?</b>',
                    '</a>',
                    '<ul>',
                        '<li>',
                            '<a href="#">yes</a>',
                            treeToHtml(tree.match),
                        '</li>',
                        '<li>', 
                            '<a href="#">no</a>',
                            treeToHtml(tree.notMatch),
                        '</li>',
                    '</ul>',
                '</li>',
             '</ul>'].join('');
}

/*ПЕРЕДЕЛЫВАЕМ ТАБЛИЦЫ В СТРОКИ*/

function titlesinsting() {
	var table=document.getElementById('tabvalue');
		colc=document.getElementById('cols').value;
		ret = '';

    for (i=0;i<colc;i++) {

        ret=ret+table.rows[0].cells[i].textContent+';';

    }
	console.log(ret);
    document.getElementById('inputtabvalue').value = ret;
};

function maintabinsting() {
	var table=document.getElementById('tabvalue1');
		colc=document.getElementById('cols').value;
		rowc=document.getElementById('rows').value;
		ret = '';

    for (i=1;i<=rowc;i++) {

        for (j=0;j<colc;j++) {

            ret=ret+table.rows[i].cells[j].textContent+';';

        }

    }
	console.log(ret);
	document.getElementById('inputtabvalue1').value = ret;
};

function attrinsting() {
	var table=document.getElementById('tabvalue2');
		colc=document.getElementById('cols').value;
		ret = '';

    for (i=0;i<colc-1;i++) {

        ret=ret+table.rows[1].cells[i].textContent+';';

	}
	console.log(ret);

    document.getElementById('inputtabvalue2').value = ret;
};


function redactiryem (){
	titlesinsting();
	maintabinsting();
	attrinsting();
	console.log(document.getElementById('inputtabvalue1'))
	 document.getElementById('redactbtn').click();
}