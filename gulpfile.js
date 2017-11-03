var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

gulp.task('admin_vendor_css', function(){
	var admin_css_files = [
			'../vendor/angular-loading-bar/build/loading-bar.min.css',
			'../vendor/angular-toastr/dist/angular-toastr.css',
			'../vendor/angucomplete-alt/angucomplete-alt.css',
			'../vendor/angularjs-datetime-picker/angularjs-datetime-picker.css',
			'../vendor/sweetalert/src/sweetalert.css',
			'../vendor/angular-material/angular-material.css',
			'../vendor/oi.select/dist/select.min.css'
		]

    return gulp.src(admin_css_files)
        .pipe(gp_concat('admin_vendor.css'))
        .pipe(gulp.dest('admin/dist'));
});

gulp.task('admin_vendor_js', function(){
	var admin_js_files = [
			'../vendor/jquery/dist/jquery.min.js',
			'../vendor/AdminLTE/bootstrap/js/bootstrap.min.js',
			'../vendor/angular/angular.min.js',
			'../vendor/angular-ui-router/release/angular-ui-router.min.js',
			'../vendor/moment/min/moment-with-locales.js',
			'../vendor/lodash/lodash.js',
			'../vendor/angular-toastr/dist/angular-toastr.tpls.js',
			'../vendor/angular-loading-bar/build/loading-bar.min.js',
			'../vendor/tg-angular-validator/dist/angular-validator.min.js',
			'../vendor/angucomplete-alt/dist/angucomplete-alt.min.js',
			'../vendor/angular-aria/angular-aria.js',
			'../vendor/angular-animate/angular-animate.min.js',
			'../vendor/angularUtils-pagination/dirPagination.js',
			'../vendor/angularjs-datetime-picker/angularjs-datetime-picker.js',
			'../vendor/ngSweetAlert/SweetAlert.min.js',
			'../vendor/sweetalert/src/sweetalert.min.js',
			'../vendor/angular-material/angular-material.js',
			'../vendor/oi.select/dist/select-tpls.min.js'
		]

    return gulp.src(admin_js_files)
        .pipe(gp_concat('admin_vendor.js'))
        .pipe(gulp.dest('admin/dist'));
});

gulp.task('admin_app_js', function(){
	var admin_app_files = [
			'/admin/app/components/auth/auth.module.js',
		    '/admin/app/components/auth/auth.service.js',
		    '/admin/app/components/auth/auth.controller.js',
		   	'/admin/app/components/dashboard/dashboard.controller.js',
		    '/admin/app/components/dashboard/dashboard.service.js',
		    '/admin/app/components/categories/category.module.js',
		    '/admin/app/components/categories/category.service.js',
			'/admin/app/components/categories/category.controller.js',
			'/admin/app/components/subjects/subject.module.js',
		    '/admin/app/components/subjects/subject.service.js',
		    '/admin/app/components/subjects/subject.controller.js',
			'/admin/app/components/skills/skill.module.js',
		    '/admin/app/components/skills/skill.service.js',
		    '/admin/app/components/skills/skill.controller.js',
		    '/admin/app/components/currency/currency.module.js',
		    '/admin/app/components/currency/currency.service.js',
		    '/admin/app/components/currency/currency.controller.js',
			'/admin/app/components/budgets/budget.module.js',
		    '/admin/app/components/budgets/budget.service.js',
		    '/admin/app/components/budgets/budget.controller.js',
			'/admin/app/components/packages/package.module.js',
		    '/admin/app/components/packages/package.service.js',
		    '/admin/app/components/packages/package.controller.js',
		    '/admin/app/components/administrator.module.js',
		    '/admin/app/components/administrator.controller.js',
		    '/admin/app/components/shared/no_result_found.component.js',
		    '/admin/app/components/projects/project.module.js',
		    '/admin/app/components/projects/project.service.js',
			'/admin/app/components/projects/project.controller.js',
			'/admin/app/components/reasons/reason.module.js',
		    '/admin/app/components/reasons/reason.service.js',
		    '/admin/app/components/reasons/reason.controller.js',
		   	'/admin/app.js'
		]

    return gulp.src(admin_app_files)
        .pipe(gp_concat('admin_app.js'))
        .pipe(gulp.dest('admin/dist'));
});

gulp.task('default', ['admin_vendor_css','admin_vendor_js', 'admin_app_js'], function(){
	gulp.watch('admin/**/*.*', function() {
    	gulp.run('admin_app_js');
   	});
});
