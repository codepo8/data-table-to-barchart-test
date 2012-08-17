(function(){
if (document.location.href.indexOf('nojs') !== -1) {
	return;
}
// DOM parts
var table = document.querySelector('#datatable'),
		graphs = document.querySelector('#graphs'),
		weights = table.querySelectorAll('#datatable thead th'),
		rows = table.querySelectorAll('tbody tr');
// collections 
var cells = null, bars = null, fields = null;
// caches
var oldbutton = null, osname = '', i = 0, out = 0;
// Brent Spiner
var dataset = {};
// max amount for bars and scale for data display
var all = +table.getAttribute('data-max') || 590, scale = 1;

// type of chart 
var type = 'barcharts';

// let the browser decide what works 
if (document.location.href.indexOf('checksupport') !== -1) {
	if (document.createElement('meter').max !== undefined) {
		type = 'meter';
	} else {
		if (document.createElement('progress').max !== undefined) {
			type = 'progress';
		} else {
			type = 'barchars';
		}
	}
}

var markup = {
	'barcharts': '<li><span class="os">{os}</span> '+
							 '<div class="progress"><span></span></div>'+
							 ' <span class="value">0</span></li>',
	'meter': 		 '<li><span class="os">{os}</span> '+
				 	     '<meter min="0" max="' + all + '" value="30"></meter>'+
					     ' <span class="value">0</span></li>',
	'progress':  '<li><span class="os">{os}</span> '+
							 '<progress min="0" max="' + all + '" value="30"></progress>'+
							 ' <span class="value">0</span></li>'			
};

// turn the data table into a massive data hash 
i = rows.length;
while (i--) {
	cells = rows[i].querySelectorAll('td');
	osname = rows[i].querySelector('th')
	j = cells.length;
	dataset[osname.innerHTML] = {};
	while (j--) {
		dataset[osname.innerHTML][weights[j+1].innerHTML] = +cells[j].innerHTML;
	}
}

// create the navigation from the table headers
out = '<nav><ul>';
for (i = 1; i < weights.length; i++) {
	out += '<li><button>' + weights[i].innerHTML + '</button></li>';
}
out += '</ul></nav>';
graphs.innerHTML += out;

// create the barcharts 
out = '<ul class="resultbars">';
for (i in dataset) {
	out += markup[type].replace('{os}',i);
}
out += '</ul></nav>';
graphs.innerHTML += out;

// cache the output elements 
if (type === 'barcharts') { bars = '.resultbars .progress span'; }
if (type === 'meter')     { bars = '.resultbars meter'; }
if (type === 'progress')  { bars = '.resultbars progress'; }
bars = document.querySelectorAll(bars);
fields = document.querySelectorAll('.resultbars .value');

// getting the scale factor for the bars (not needed for meter/progress)
if (type === 'barcharts') {
	scale = all / document.querySelector('.progress').offsetWidth;
}

// One event delegation to rule them all
document.querySelector('#graphs nav').addEventListener('click', function(ev) {
	if (ev.target.tagName === 'BUTTON') {
		if (oldbutton) {
			oldbutton.className = '';
		}
		ev.target.className = 'current';
		oldbutton = ev.target;
		var elm = ev.target.innerHTML;
		out = 0;		
		for(i in dataset) {
			fields[out].innerHTML = dataset[i][elm];
			if (type === 'barcharts') {
				bars[out].style.width = dataset[i][elm]/scale + 'px';
			}
			if (type === 'meter' || type === 'progress') {
				bars[out].value  = dataset[i][elm];
			}
			out++;
		}
	}
}, false);
// start the show
document.querySelector('#graphs button').click();
})();
