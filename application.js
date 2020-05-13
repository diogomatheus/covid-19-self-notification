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
	var birthdate = $('#data_nascimento_input').val();
	var symptoms = get_symptoms();
	switch(analyze_data(symptoms, birthdate)) {
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
	get_symptoms
	@desc Get the checked symptoms.
*/
function get_symptoms() {
	var symptoms = [];
	$.each($('input[name="sintomas[]"]:checked'), function() { symptoms.push($(this).val()); });
	return symptoms;
}