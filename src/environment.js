$.extend(easyloader.modules, {
	panel: {
		js: 'jquery.panel.js',
		css: 'panel.css',
		dependencies: ['parser']
	},
	edatagrid: {
		js: '../../easyui_extentions/edatagrid/jquery.edatagrid.js',
		dependencies: ['datagrid']
	},
	datagridfilter: {
		js: '../../easyui_extentions/datagrid-filter/datagrid-filter.js'
		, dependencies: ['datagrid', 'treegrid', 'combogrid']
	},
	ribbon: {
		js: '../../easyui_extentions/ribbon/jquery.ribbon.js'
		, css: '../../../easyui_extentions/ribbon/ribbon.css'
		, dependencies: ['linkbutton', 'tabs', 'menubutton', 'splitbutton', 'panel', 'parser']
	},
	chartjs: {
		js: '../../chart_js/Chart.js-2.8.0/distr/Chart.min.js',
		//js: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.min.js',
		dependencies: []
	},
	gauge: {
		js: '../../gauge_js/gauge.min.js',
		dependencies: []
	},
	jexcel: {
		js: '../../jexcel/jexcel.js'
		, css: '../../../jexcel/jexcel.css'
		, dependencies: []
	},
	jsuites: {
		js: '../../jexcel/jsuites.js'
		, css: '../../../jexcel/jsuites.css'
		, dependencies: []
	}
});

$.extend(easyloader.locales, {
	'se_SW': 'easyui-lang-se_SW.js'
});
easyloader.locale = 'se_SW';
// easyloader.theme = 'material-teal';
easyloader.css = false;
/*
$.extend(easyloader.locales, {
	'se_SW': 'easyui-lang-se_SW.js'
});
easyloader.locale = 'se_SW';
easyloader.theme = 'material-teal';
easyloader.theme = 'black';
easyloader.css = false;
$('link:first').attr('href', 'easyui/themes/default/easyui.css');
*/
/*
 	$.extend(easyloader.modules, {
		panel: {
			js:'jquery.panel.js',
			css:'panel.css',
			dependencies:['parser']
		}
	});
 */
// 

