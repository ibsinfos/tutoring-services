<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');
/*
  | -------------------------------------------------------------------------
  | URI ROUTING
  | -------------------------------------------------------------------------
  | This file lets you re-map URI requests to specific controller functions.
  |
  | Typically there is a one-to-one relationship between a URL string
  | and its corresponding controller class/method. The segments in a
  | URL normally follow this pattern:
  |
  |	example.com/class/method/id/
  |
  | In some instances, however, you may want to remap this relationship
  | so that a different class/function is called than the one
  | corresponding to the URL.
  |
  | Please see the user guide for complete details:
  |
  |	http://codeigniter.com/user_guide/general/routing.html
  |
  | -------------------------------------------------------------------------
  | RESERVED ROUTES
  | -------------------------------------------------------------------------
  |
  | There area two reserved routes:
  |
  |	$route['default_controller'] = 'welcome';
  |
  | This route indicates which controller class should be loaded if the
  | URI contains no data. In the above example, the "welcome" class
  | would be loaded.
  |
  |	$route['404_override'] = 'errors/page_missing';
  |
  | This route will tell the Router what URI segments to use if those provided
  | in the URL cannot be matched to a valid route.
  |
 */

$route['default_controller'] = "auth";

$route['/'] = "auth/index";

$route["login"] = "auth/login";

/* Category Routes */
$route["category-save"] = "category/save";
$route["get-parent-categories"] = "category/parentCategories";
$route["get-categories"] = "category/list";
$route["get-category-details/(:num)"] = "category/categoryInfo/$1";
$route["delete-category"] = "category/delete";
$route["change-category-status"] = "category/changeStatus";
$route["get-sub-categories"] = "category/subCategories";
$route["category-order-save"] = "category/updateCategoryOrder";
/* Skill Routes */
$route["subject-save"] = "subject/save";
$route["get-subjects"] = "subject/list";
$route["get-subject-details/(:num)"] = "subject/subjectInfo/$1";
$route["delete-subject"] = "subject/delete";
$route["change-subject-status"] = "subject/changeStatus";
/* Currency Routes */
$route["get-currencies"] = "currency/list";
$route["currency-update"] = "currency/changeCurrency";
/* Budget Routes */
$route["get-active-currency"] = "budget/activeCurrency";
$route["budget-save"] = "budget/save";
$route["get-budgets"] = "budget/list";
$route["get-budget-details/(:num)"] = "budget/budgetInfo/$1";
$route["delete-budget"] = "budget/delete";
$route["change-budget-status"] = "budget/changeStatus";
/* project routes */
$route["get-projects"] = "project/list";
$route["approve-project"] = "project/approve";
$route["get-project-info"] = "project/projectInfo";
$route["delete-project"] = "project/delete";
$route['get-project-report-abuse'] = 'project/projectReportAbuse';
/* Package Routes */
$route["get-key-tags"] = "package/keyTags";
$route["package-save"] = "package/save";
$route["get-packages"] = "package/list";
$route["get-package-details/(:num)"] = "package/packageInfo/$1";
$route["delete-package"] = "package/delete";
$route["change-package-status"] = "package/changeStatus";
/* Reasons Routes */
$route["reason-save"] = "reason/save";
$route["get-reasons"] = "reason/list";
$route["get-reason-details/(:num)"] = "reason/reasonInfo/$1";
$route["delete-reason"] = "reason/delete";
$route["change-reason-status"] = "reason/changeStatus";
/* End of file routes.php */
/* Location: ./application/config/routes.php */

$route['validate-user'] = "auth/checkToken";
$route['update-profile'] = "auth/updateProfile";
$route['change-password'] = "auth/changePassword";
$route['email-exists'] = "auth/checkEmailExists";
$route['freelancer-signup'] = "auth/freelancerSignUp";
$route['employer-signup'] = "auth/employerSignUp";
$route['forgot-password'] = "auth/forgotPassword";

/* Routes for Front End */
$route['front-get-categories'] = "category/frontGetCategories";
$route['front-get-skills'] = "skill/frontGetSkills";
$route["front-get-budget-range"] = "budget/budgetRange";
$route["front-get-urgency"] = "employer/urgency";
$route["front-project-save"] = "employer/createProject";
$route["front-get-projects"] = "employer/projectList";
$route["front-get-tasks"] = "employer/taskList";
$route["front-task-save"] = "employer/createTask";

$route['front-update-bank-details'] = "freelancer/updateBankDetails";
$route['front-get-bank-details'] = "freelancer/getBankDetails";
$route['front-update-user-details'] = "freelancer/updateUserDetails";

$route["front-task-delete"] = "employer/deleteTask";
$route["front-get-task"] = "employer/taskInfo";
$route['front-get-project-info'] = "project/projectInfo";

$route['front-update-user-photo'] = "freelancer/updateUserPhoto";
$route['front-get-user-skills'] = "auth/getUserSkills";
$route['front-search-skills'] = "skill/frontSearchSkills";
$route['front-search-categories'] = "category/frontSearchCategories";
$route['front-update-user-skills'] = "freelancer/updateUserSkills";
$route['front-get-percentage'] = "freelancer/defaultPercentage";
$route['front-search-projects'] = "freelancer/searchProjects";
$route['front-report-abuse'] = "freelancer/reportAbuse";
$route['front-get-all-reasons'] = "freelancer/getAllReasons";
$route['front-get-single-project'] = "freelancer/singleProject";
$route['front-bid-on-project'] = "freelancer/bidOnProject";
$route['front-employer-bidded-projects'] = "employer/biddedProjects";
$route['front-employer-hide-bid'] = "employer/hideThisProject";
$route['front-employer-decline-bid'] = "employer/declineProjectBid";
$route['front-employer-talk-to-bidder'] = "employer/talkToBidder";
$route['front-profile-freelancer'] = "freelancer/viewProfile";
$route['front-check-product-user-slugs'] = "employer/checkProjectAndUserSlug";
$route['front-payment-process'] = "employer/paymentProcess";
$route['front-payment-done'] = "employer/paymentDone";
$route['front-save-review-rating'] = "general/saveReviewRating";

$route['front-employer-file-complaint'] = "employer/addComplaints";


$route['front-get-review-ratings-list'] = "general/getReviewRatingsList";
$route['front-get-review-ratings'] = "general/getReviewRatingsInfo";

$route['get-overview'] = "general/getOverview";