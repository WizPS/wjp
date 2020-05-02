
function ldbs(iData) {
	$.post("../data/ldbs.aspx", { payload: JSON.stringify( iData) });
}

function setCookie(c_name, value, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
	var i, x, y, ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == c_name) {
			return unescape(y);
		}
	}
}

function setMenuActive(iApp) {
	var sel = $("[group='f1']", $("#ribbon_men"));
	$(sel).linkbutton('disable');  // disable all function-buttons when app is clicked 

	var app_data = $zBody.data("app")[iApp];
	if (app_data) {
		$.each(app_data, function (key, value) {
			$("#" + value).linkbutton('enable'); // re-enable all function-buttons when app is clicked 
		});
	}
}

function array_to_object(iArray, idField, idValue) {
	var ret = {};
	$.each(iArray, function () {
	});
}

function ok_button_click(url, payload, callback) {
	msgProg();
	var retjdata = {};
	$.post(url, payload , function (response) {
		if (response) {
			$response = JSON.parse(response);
			if ($response.result) {
				retjdata = $response.result[0];
				callback(retjdata);
				if (retjdata.sucess) msgOK('success', retjdata.message);
				else msgOK('fail', retjdata.message);
			} else { msgOK('fail', 'no result in response');}
		} else {
			msg('Error-msg', 'Missing return data');
		}
	}).fail(function () {
		alert("Run-time error");
	}).always(function () {
		msgProgClose(); 
	});

}

function x_ok_button_click(data, callback) {
	const xhr = new XMLHttpRequest();
	xhr.timeout = 2000;
	xhr.onreadystatechange = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				callback(null, xhr.response)
			} else {
				callback(xhr.status, null)
			}
		}
	}
	xhr.ontimeout = function () {
		// console.log('Timeout')
	}
	xhr.open('get', "../data/form_submit.aspx", true)
	xhr.send();
}

jQuery["postJSON"] = function (url, data, callback) {
	// shift arguments if data argument was omitted
	if (jQuery.isFunction(data)) {
		callback = data;
		data = undefined;
	}

	return jQuery.ajax({
		url: url,
		type: "POST",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(data),
		success: callback
	});
	/* And to use it
	 * $.postJSON('http://url', { data: 'goes', here: 'yey' }, function (data, status, xhr) { alert('Nailed it!') });
	 */
};
