/*
	analyze_data
	@desc Analyze the symptoms and classify them based on official guidelines.
	https://portalarquivos.saude.gov.br/images/pdf/2020/April/18/Diretrizes-Covid19.pdf
*/
function analyze_data(symptoms, birthdate) {
	var SG_result = is_SG(symptoms, birthdate);
	var SRAG_result = is_SRAG(SG_result, symptoms, birthdate);

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
function is_SG(symptoms, birthdate) {
	var age = calculate_age(birthdate);
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
function is_SRAG(SG_result, symptoms, birthdate) {
	var age = calculate_age(birthdate);
	if(SG_result) {
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
	calculate_age
	@desc Calculate the age based on specific date (i.e., birthdate).
*/
function calculate_age(birthdate) {
	// DD/MM/YYYY
	var birthdate_info = birthdate.split('/');
	var year = parseInt(birthdate_info[2]);
	var month = parseInt(birthdate_info[1]);
	var day = parseInt(birthdate_info[0]);

	// Current date
	var now_date = new Date;
    var now_year = now_date.getFullYear();
    var now_month = now_date.getMonth() + 1;
    var now_day = now_date.getDate();

    // Calculate the user age
    var result = now_year - year;
	if (now_month < month || (now_month == month && now_day < day))
		result--;

	return result < 0 ? 0 : result;
}