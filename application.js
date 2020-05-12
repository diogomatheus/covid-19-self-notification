// jQuery Validate
var validator = null;
$(document).ready(function() {
	config_form();
});

/*
	config_form
	@desc Config form formatter and validation.
*/
function config_form() {
	// Birthdate formatter
	var birthdate_formatter = new Cleave('#data_nascimento_input', {
	    date: true,
	    delimiter: '/',
	    datePattern: ['d', 'm', 'Y']
	});

	// Form validation configuration
	config_form_validation();
}

/*
	config_form_validation
	@desc Config form validation with jQuery validate.
*/
function config_form_validation() {
	$.validator.setDefaults({ ignore: [] });
	validator = $('#covid-19-form').validate({
		rules: {
			'nome': {
				'required': true,
				'maxlength': 100
			},
			'data_nascimento': 'required',
			'sintomas[]': 'required'
		},
		messages: {
			'nome': {
				'required': 'Identificação: Por favor, informe seu nome.',
				'maxlength': 'Identificação: Seu nome deve conter no máximo 100 caracteres.'
			},
			'data_nascimento': 'Identificação: Por favor, informe sua data de nascimento.',
			'sintomas[]': 'Dados clínicos: Por favor, informe os sintomas apresentados.'
		},
		errorContainer: $('#error-container'),
		errorLabelContainer: $('ul', $('#error-container')),
		wrapper: 'li',
		errorClass: 'invalid',
		validClass: 'valid',
		focusInvalid: false,
		highlight: function(element, errorClass, validClass) {
			if (element.tagName == 'INPUT' && $(element).attr('type') == 'checkbox')
				$('span[for="' + element.name + '"]').removeClass(validClass).addClass(errorClass);

			$(element).removeClass(validClass).addClass(errorClass);
		},
		unhighlight: function(element, errorClass, validClass) {
			if (element.tagName == 'INPUT' && $(element).attr('type') == 'checkbox')
				$('span[for="' + element.name + '"]').removeClass(errorClass).addClass(validClass);

			$(element).removeClass(errorClass).addClass(validClass);
		},
		invalidHandler: function(form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) $('html, body').animate({ scrollTop: 0 }, 'fast');
        },
        submitHandler: function(form) {
        	display_result();
        }
	});
	
	// Form reset configuration
	$('#covid-19-form-reset').on('click', function(e) {
		$('input').prop('value', '');
		$('input[type="checkbox"]:checked').prop('checked', false);
		if(typeof validator !== 'undefined' && validator !== null)
			validator.resetForm();
	});
}

/*
	display_result
	@desc Display the analysis result.
*/
function display_result() {
	var icon_label = null, title_color = null, message = null;
	switch(analyze_data()) {
		case 'SG':
			icon_label = 'warning';
			title_color = 'orange';
			message = 'Com base nos dados fornecidos, existe uma suspeita de COVID-19 (coronavírus) relacionada com os sintomas de Síndorme Gripal (SG). Considere realizar uma consulta no hospital mais próximo, principalmente, em caso de evolução dos sintomas.';
			break;
		case 'SRAG':
			icon_label = 'warning';
			title_color = 'orange';
			message = 'Com base nos dados fornecidos, existe uma suspeita de COVID-19 (coronavírus) relacionada com os sintomas de Síndrome Respiratória Aguda Grave (SRAG). Por favor, dirija-se ao hospital mais próximo.';
			break;
		default:
			icon_label = 'check';
			title_color = 'green';
			message = 'Com base nos dados fornecidos, não há suspeita de de COVID-19 (coronavírus). Continue seguindo as instruções do ministério da saúde.';
			break;
	}
	
	var username = $('#nome_input').val();
	var icon_element = $('<i class="material-icons medium"></i>').text(icon_label);
	var title_element = $('<h5 class="valign-wrapper"></h5>')
	title_element.css('color', title_color);
	title_element.append(icon_element)
				 .append(' Olá ' + username);

    var message_element = $('<p></p>').text(message);
    var back_element = $('<p class="center"><a href="index.html">Voltar ao formulário</a></p>');

    var content = $('<div class="card-panel z-depth-3"></div>');
    content.append(title_element)
    	   .append(message_element)
    	   .append(back_element);

	$('#main-content').html('<br />').append(content);
	$('html, body').animate({ scrollTop: 0 }, 'fast');
}

/*
	analyze_data
	@desc Analyze data and classify based on official guidelines.
	https://portalarquivos.saude.gov.br/images/pdf/2020/April/18/Diretrizes-Covid19.pdf
*/
function analyze_data() {
	var symptoms = [];
	$.each($('input[name="sintomas[]"]:checked'), function() { symptoms.push($(this).val()); });

	var SG_result = is_SG(symptoms);
	var SRAG_result = is_SRAG(SG_result, symptoms);

	if (SRAG_result)
		return 'SRAG';
	else if (SG_result)
		return 'SG';
	else
		return 'Normal';
}

/*
	is_SG
	@desc Compare data with SG symptoms.
*/
function is_SG(symptoms) {
	var age = get_user_age();
	alert(age);
	if (
		(
			// DEFAULT
			(age > 12 && age < 60) && 
			symptoms.indexOf('Febre') !== -1 && 
			(
				symptoms.indexOf('Tosse') !== -1 || 
				symptoms.indexOf('Dor de garganta') !== -1 || 
				symptoms.indexOf('Nariz escorrendo') !== -1 || 
				symptoms.indexOf('Dificuldade de respirar') !== -1
			)
		) ||
		(
			// KIDS
			age <= 12 && 
			symptoms.indexOf('Febre') && 
			(
				symptoms.indexOf('Tosse') !== -1 || 
				symptoms.indexOf('Dor de garganta') !== -1 || 
				symptoms.indexOf('Nariz escorrendo') !== -1 || 
				symptoms.indexOf('Dificuldade de respirar') !== -1 ||
				symptoms.indexOf('Nariz entupido') !== -1
			)
		) ||
		(
			// SENIORS
			age >= 60 &&
			(
				symptoms.indexOf('Febre') !== -1 || 
				symptoms.indexOf('Tosse') !== -1 || 
				symptoms.indexOf('Dor de garganta') !== -1 || 
				symptoms.indexOf('Nariz escorrendo') !== -1 || 
				symptoms.indexOf('Dificuldade de respirar') !== -1 ||
				symptoms.indexOf('Desmaio ou perda temporária de consciência') !== -1 || 
				symptoms.indexOf('Irritabilidade/confusão mental') !== -1 || 
				symptoms.indexOf('Sonolência excessiva') !== -1 || 
				symptoms.indexOf('Falta de apetite') !== -1
			)
		)
	)
		return true;

	return false;
}

/*
	is_SRAG
	@desc Compare data with SRAG symptoms.
*/
function is_SRAG(SG_result, symptoms) {
	if(SG_result) {
		var age = get_user_age();
		alert(age);
		if (
			(
				// DEFAULT
				age > 12 && 
				(
					symptoms.indexOf('Cansaço respiratório') !== -1 || 
					symptoms.indexOf('Pressão persistente no tórax') !== -1 || 
					symptoms.indexOf('Saturação de O2 menor que 95% em ar ambiente') !== -1 || 
					symptoms.indexOf('Coloração azulada dos lábios ou rosto') !== -1
				)
			) ||
			(
				// KIDS
				age <= 12 && 
				(
					symptoms.indexOf('Cansaço respiratório') !== -1 || 
					symptoms.indexOf('Pressão persistente no tórax') !== -1 || 
					symptoms.indexOf('Saturação de O2 menor que 95% em ar ambiente') !== -1 || 
					symptoms.indexOf('Coloração azulada dos lábios ou rosto') !== -1 ||
					symptoms.indexOf('Dificuldade de respirar') !== -1 || 
					symptoms.indexOf('Coloração azulada/acinzentada da pele ou unhas') !== -1 || 
					symptoms.indexOf('Desidratação') !== -1 || 
					symptoms.indexOf('Falta de apetite') !== -1
				)
				
			)
		)
			return true;
	}

	return false;
}

/*
	get_user_age
	@desc Get user age based on his/her birthdate.
*/
function get_user_age() {
	// Birthdate
	var birthdate = $('#data_nascimento_input').val();
	var birthdate_info = birthdate.split('/');
	var year = parseInt(birthdate_info[2]);
	var month = parseInt(birthdate_info[1]);
	var day = parseInt(birthdate_info[0]);

	// Calculate the user age
	var result = calculate_age(year, month, day);
    return result < 0 ? 0 : result;
}

/*
	calculate_age
	@desc Calculate the age based on specific date.
*/
function calculate_age(year, month, day) {
	// Current date
	var now_date = new Date;
    var now_year = now_date.getFullYear();
    var now_month = now_date.getMonth() + 1;
    var now_day = now_date.getDate();

    // Calculate the user age
    var result = now_year - year;
	if (now_month < month || (now_month == month && now_day < day))
		result--;

	return result;
}