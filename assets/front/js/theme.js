////////////////////////////////////////////////////////////////
///////////// INITIATE ON WINDOW-LOAD FUNCTIONS ////////////////
////////////////////////////////////////////////////////////////
if (window.attachEvent) {
	window.attachEvent('onload', onload_functions);
} else if (window.addEventListener) {
	window.addEventListener('load', onload_functions, false);
} else {
	document.addEventListener('load', onload_functions, false);
}

function onload_functions() {

	/// IF NOT MOBILE DEVIDE
	if (jQuery(window).width() >= 500) {

	};

	animate_meter();
	add_more_skills();

}


///////////////////////////////////////////////////////////////
////////// INITIATE ON DOCUMENT-READY FUNCTIONS ///////////////
///////////////////////////////////////////////////////////////
$(document).ready(function () {
	//console.log('Theme.js');
	/// IF NOT MOBILE DEVIDE
	if (jQuery(window).width() >= 800) {

		/// THROTTLE EVENT FOR DROPING THE HEADER ON SCROLL
		// var throttled = _.throttle(drop_header, 50);
		// jQuery(window).scroll(throttled);

	};

	utils_nav();
	activate_tabs();
	//init_tooltip();
	init_overlay();
	UI_cosmetics();
	// datepicker_ini();
	calc_end_date_weekly_instalments();
	calc_end_date_on_project_completion();

	//doMath();
});



//////////////////////////////////////////////////////
///////////////// ALL FUNCTIONS //////////////////////
//////////////////////////////////////////////////////








// TOOLTIP FUNCTIONALITY
function utils_nav() {
	jQuery("body").on('click', '.btn-account', function () {
		jQuery('.utils_menu').toggleClass('active');
		jQuery(this).toggleClass('active');
	});

}

function UI_cosmetics() {
	//jQuery('select').select2();

	jQuery('body').on('click', '.skills label', function () {
		jQuery(this).toggleClass('checked');
		jQuery('input:checked').parent('label').addClass('checked');
	});



}


function add_more_skills() {


	//INITIAL PRINCIPLE
	var $selectprinciple = jQuery('.principles').attr('id');
	jQuery('#' + $selectprinciple).change(function () {
		jQuery(this).parent().find('.skills').hide();
		jQuery(this).parent().find('#' + $(this).val()).show();
		jQuery('.addmore').removeClass('disabled');
		var $selectedoption = $(this).val();
		console.log($selectedoption);
	});
	//jQuery('#' + $selectprinciple).select2();

	var rowNum = 0;

	$("body").on("click", ".addmore", function () {

		if (jQuery(this).hasClass('disabled')) {

		} else {

			rowNum++;
			// Clone the form
			var $principlegroup = $(this).parents().prev('.principles_group');

			// Set IDs and clear new form
			var nextHtml = $principlegroup.clone();
			nextHtml.attr('id', 'principles_group' + rowNum);
			nextHtml.find('.principles').attr('id', 'principles' + rowNum);
			nextHtml.find('.principles').siblings().attr('id', 'skills_wrap' + rowNum);
			nextHtml.find('input:checkbox').removeAttr('checked').end;
			nextHtml.find('label').removeClass('checked');
			nextHtml.find('.skills').hide();


			// ELIMINATE PREVIOUS SELECTION OPTION FROM CLONE - NOT WORKING!!!!!!!!!!!!!!!!!

			var $selectedoption = jQuery(this).parent().prev('#' + $previd).find('select').find('option.selected').val();
			console.log($selectedoption);
			nextHtml.find('option[value="' + $selectedoption + '"]').remove();


			// Disable previous select
			var $previd = $(this).parents().prev('.principles_group').attr('id');
			console.log($previd);
			jQuery(this).parent().prev('#' + $previd).find('select').attr('disabled', 'disabled');


			// Remove clone - not working at the moment
			var hasRmBtn = $('.rmbtn', nextHtml).length > 0;
			if (!hasRmBtn) {
				var rm = "<button type='button' class='rmbtn'>Remove</button>"
				$('.addmore_wrap', nextHtml).append(rm);
			}
			$principlegroup.after(nextHtml);


			// This makes sure the select onchange affects the cloned selects and not the original
			var $selectprinciple = nextHtml.find('.principles').attr('id');

			jQuery('#' + $selectprinciple).change(function () {
				jQuery(this).parent().find('.skills').hide();
				jQuery(this).parent().find('#' + $(this).val()).show();

			});

		}

	});

	// $("body").on("click", ".rmbtn", function() {
	//     $(this).parents('.principles_group').remove();
	// });

}




// TAB FUNCTIONALITY
function activate_tabs() {
	jQuery("body").on('click', ".tab_activator", function () {

		if (jQuery(this).hasClass('active')) {
			jQuery(this).removeClass('active');
			jQuery(this).parent().removeClass('active');
		} else {
			jQuery(this).addClass('active');
			jQuery(this).parent().addClass('active');
		}
		jQuery(this).next('.tab_content').slideToggle();

		jQuery(this).parent().siblings().children().removeClass('active');
		jQuery(this).parent().siblings().removeClass('active');
		jQuery(this).parent().siblings().children().next().slideUp();
		return false;

	});

	jQuery("body").on("click", ".content_text .btn-more", function () {
		jQuery(this).next(".more_info").slideToggle("fast");
	});

	// CLOSE ALL TABS AFTER PAGE HAS LOADED - WE BEGIN WITH ALL TABS OPEN FOR SEO PURPOSES
	// jQuery('.tabspanel .tab_item .tab_content').slideToggle();

}



// TAB FUNCTIONALITY
function animate_meter() {
	jQuery(".meter").addClass('meterfull');
}

// TOOLTIP FUNCTIONALITY
function init_tooltip() {
	$('[data-toggle="tooltip"]').tooltip();
}


function init_overlay() {
	// SHOW EDIT PROFILE POPUP
	jQuery("body").on("click", ".edit_profile", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_edit_profile').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});

	// SHOW EDIT TASKS POPUP
	jQuery("body").on("click", ".edit_tasks", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_add_remove_tasks').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});

	// TALK TO FREELANCER POPUP
	jQuery("body").on("click", ".btn_talk_to_freelancer", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_talk_to_prolancer').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});

	// HIRE FREELANCER POPUP
	jQuery("body").on("click", ".btn_hire_freelancer", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_hire_freelancer').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});

	// VIEW FREELANCER RATING POPUP
	jQuery("body").on("click", ".btn_view_freelancer_reviews", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_view_freelancer_reviews').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});

	// ADD FREELANCER REVIEW POPUP
	jQuery("body").on("click", ".btn_add_freelancer_review", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_add_freelancer_review').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});

	// ADD FREELANCER REVIEW POPUP
	jQuery("body").on("body", ".btn_add_employer_review", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_add_employer_review').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});



	// STAGE PAYMENT POPUP
	jQuery("body").on("click", ".btn_stage_payment", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_stage_payment').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});

	// DECLINE POPUP
	jQuery("body").on("click", ".btn_decline_freelancer", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_decline_freelancer').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});

	// EDIT BANK DETAILS POPUP
	jQuery("body").on("click", ".edit_bankdetails", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_bank_details').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});

	// DISPUTE POPUP
	jQuery("body").on("click", ".btn_file_complaint", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_file_complaint').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});

	// ADD WORKLOG ENTRY POPUP
	jQuery("body").on("click", ".btn_add_worklog_entry", function () {
		jQuery('.master_wrap').addClass('blur-in');
		jQuery('#popup_add_worklog_entry').fadeIn(300);
		jQuery('body').addClass('noscroll');
		return false;
	});





	// jQuery(document).on('mouseup', function (e) {
	//     var container = jQuery(".overlay");

	// 	if(!jQuery(e.target).hasClass('.active_frame') || !jQuery(e.target).parents('.active_frame').length > 0 ) 
	//     {
	//         jQuery('.overlay').css({'display':'none'})
	//         jQuery('.master_wrap').removeClass('blur-in');
	//         jQuery('body').removeClass('noscroll');
	//     }
	// });

	// CLOSE OVERLAY
	// jQuery("body").on("click", ".overlay .close_black", function () {
	// 	jQuery('.overlay').fadeOut(300);
	// 	jQuery('.master_wrap').removeClass('blur-in');
	// 	jQuery('body').removeClass('noscroll');
	// });
}







//////////////////////////////////////////////////////
////////////////// CALCULATORS ///////////////////////
//////////////////////////////////////////////////////



// PROJECT COST CALCULATOR - PAYMENT METHOD: WEEKLY INSTALMENTS
function doMath_weekly_instalments() {

	var hourly_rate = parseFloat(document.getElementById('hourly_rate').value);
	var total_project_hours = parseFloat(document.getElementById('total_project_hours').value);
	var max_hours_per_week = parseFloat(document.getElementById('max_hours_per_week').value);

	// UNROUNDED
	// var total_project_weeks = total_project_hours / max_hours_per_week ;
	// var total_project_days = total_project_weeks * 7 ;
	//  var project_cost_total = hourly_rate * total_project_hours;
	//  var project_cost_weekly = project_cost_total / total_project_weeks;

	// ROUNDED to 2 decimal
	var total_project_weeks = ((total_project_hours / max_hours_per_week).toFixed(2));
	var total_project_days = ((total_project_weeks * 7).toFixed(2));
	var project_cost_total = ((hourly_rate * total_project_hours).toFixed(2));
	// var project_cost_weekly = ((project_cost_total / total_project_weeks).toFixed(2));

	// CALCULATE TOTAL WEEKS AS INTEGER
	var total_project_weeks_as_integer = Math.ceil(total_project_weeks);

	// CALCULATE WEEKLY INSTALMENT VALUE
	var project_cost_weekly = ((project_cost_total / total_project_weeks_as_integer).toFixed(2));


	// OUTPUT    
	jQuery('#project_cost_total').html(project_cost_total);
	jQuery('#project_cost_weekly').html(project_cost_weekly);
	jQuery('#total_project_weeks').html(total_project_weeks);
	jQuery('#total_project_weeks_as_integer').html(total_project_weeks_as_integer);
	jQuery('#total_project_days').html(total_project_days);

	var content = jQuery('.weekly_instalments_calc');
	var week_count = total_project_weeks_as_integer;
	content.empty();
	var i2 = 1
	for (var i = 0; i < week_count; i++) {
		content.append("<p>Week " + i2 + ": <strong>$" + project_cost_weekly + "</strong></p>");
		i2++;
	}

}


// PROJECT COST CALCULATOR - PAYMENT METHOD: ON PROJECT COMPLETION
function doMath_on_project_completion() {

	var agreed_project_cost = parseFloat(document.getElementById('agreed_project_cost').value);
	var total_project_hours = parseFloat(document.getElementById('total_project_hours').value);
	var max_hours_per_week = parseFloat(document.getElementById('max_hours_per_week').value);

	// ROUNDED to 2 decimal
	var total_project_weeks = ((total_project_hours / max_hours_per_week).toFixed(2));
	var total_project_days = ((total_project_weeks * 7).toFixed(2));
	// var project_cost_total = ((hourly_rate * total_project_hours).toFixed(2));

	// CALCULATE TOTAL WEEKS AS INTEGER
	var total_project_weeks_as_integer = Math.ceil(total_project_weeks);


	// OUTPUT    
	jQuery('#project_cost_total').html(agreed_project_cost);
	jQuery('#total_project_weeks').html(total_project_weeks);
	jQuery('#total_project_weeks_as_integer').html(total_project_weeks_as_integer);
	jQuery('#total_project_days').html(total_project_days);


}



// PROJECT COST CALCULATOR - PAYMENT METHOD: WEEKLY INSTALMENTS
function calc_end_date_weekly_instalments() {

	jQuery('#project_cost_calculator #start_date').datepicker({
		minDate: 0,
		// dateFormat: "dd/mm/yy",
		dateFormat: "DD, d M, yy",

		onSelect: function (selected) {
			// recalculate weeks and hours
			var total_project_hours2 = parseFloat(document.getElementById('total_project_hours').value);
			var max_hours_per_week2 = parseFloat(document.getElementById('max_hours_per_week').value);
			var total_project_weeks2 = total_project_hours2 / max_hours_per_week2;
			var total_number_of_days2 = total_project_weeks2 * 7;

			$("#end_date").datepicker("option", "minDate", selected); //  mindate on the End datepicker cannot be less than start date already selected.
			var date = $(this).datepicker('getDate');
			var tempStartDate = new Date(date);
			var default_end = new Date(tempStartDate.getFullYear(), tempStartDate.getMonth(), tempStartDate.getDate() + (total_number_of_days2)); //this parses date to overcome new year date weirdness
			$('#end_date').datepicker('setDate', default_end); // Set as default                           
		}
	});

	jQuery('#project_cost_calculator #end_date').datepicker({
		minDate: 0,
		dateFormat: "DD, d M, yy",

		onSelect: function (selected) {
			$("#start_date").datepicker("option", "maxDate", selected); //  maxdate on the Start datepicker cannot be more than end date selected.

		}
	});
}


// PROJECT COST CALCULATOR - PAYMENT METHOD: WEEKLY INSTALMENTS
function calc_end_date_on_project_completion() {

	jQuery('#project_cost_calculator #start_date').datepicker({
		minDate: 0,
		// dateFormat: "dd/mm/yy",
		dateFormat: "DD, d M, yy",

		onSelect: function (selected) {
			// recalculate weeks and hours
			var total_project_hours2 = parseFloat(document.getElementById('total_project_hours').value);
			var max_hours_per_week2 = parseFloat(document.getElementById('max_hours_per_week').value);
			var total_project_weeks2 = total_project_hours2 / max_hours_per_week2;
			var total_number_of_days2 = total_project_weeks2 * 7;

			$("#end_date").datepicker("option", "minDate", selected); //  mindate on the End datepicker cannot be less than start date already selected.
			var date = $(this).datepicker('getDate');
			var tempStartDate = new Date(date);
			var default_end = new Date(tempStartDate.getFullYear(), tempStartDate.getMonth(), tempStartDate.getDate() + (total_number_of_days2)); //this parses date to overcome new year date weirdness
			$('#end_date').datepicker('setDate', default_end); // Set as default                           
		}
	});

	jQuery('#project_cost_calculator #end_date').datepicker({
		minDate: 0,
		dateFormat: "DD, d M, yy",

		onSelect: function (selected) {
			$("#start_date").datepicker("option", "maxDate", selected); //  maxdate on the Start datepicker cannot be more than end date selected.

		}
	});
}