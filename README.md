# dl-select
**Filterable/Searchable select box for AngularJS and Bootstrap**

## 1. Key Features
* Allows searching for available options
* Supports array of strings to be used as option list
* Supports array of objects to be used as option list
* Supports getting String result from object type options
* Supports loading options dynamically (via API or delayed functions)
* Supports custom templating for options
* Supports custom templating for selected area
* Easy to use

## 2. How to Install?
Run `npm install dl-select` on terminal/cmd or download from [Guthub repository](https://github.com/doozielabs/dl-select). And then include it in your `HTML`.
dl-select depends on AngularJS 1.6.x, Bootstrap 4, lodash. So, make sure to include them before dl-select

```HTML
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<link rel="stylesheet" href="node_modules/dl-select/dl-select.css"></script>

<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.7/angular.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.5/lodash.min.js"></script>
<script src="node_modules/dl-select/dl-select.js"></script>
```
## 3. How to Use?

### 3.1. Using Array of Strings as Options
**HTML**
```HTML
<dl-select ng-model="designation" options="designations"></dl-select>
```

**JS**
```JS
var module = angular.module("testModule", [ "dl-select" ]);

module.controller("testController", function($scope) {
	$scope.designation = "";
	$scope.designations = [
		"Chairman",
		"Managing Director",
		"Chief Executive Officer",
		"Chief Technology Officer",
		"Human Resource Manager",
		"Admin Officer",
		"Software Engineer",
		"Graphics Designer",
		"Accountant"
	];
});
```

**Preview**

![dl-select Preview](http://ohbhens.com/_/hosted_content/dl-select/preview-1.gif "dl-select preview")

### 3.2. Using Array of Objects as Options
**HTML**
```HTML
<dl-select ng-model="designation" options="designations" config="config">
	<span class="badge badge-primary">{{designation.abbr}}</span> 
	{{designation.name}}
</dl-select>
<script id="templates/dl-select/designation-picker-option.html" type="text/ng-template">
	<span class="badge badge-pill badge-light" style="width: 40px;" ng-bind-html="$option.abbreviation|dlHighlightSearch:$search"></span> 
	<span ng-bind-html="$option.name|dlHighlightSearch:$search"></span>
</script>
```

**JS**
```JS
var module = angular.module("testModule", [ "dl-select" ]);

module.controller("testController", function($scope) {
	$scope.designation = "";
	$scope.designations = [
		{ id: "1", abbr: "CHM", name: "Chairman" },
		{ id: "2", abbr: "MD", name: "Managing Director" },
		{ id: "3", abbr: "CEO", name: "Chief Executive Officer" },
		{ id: "4", abbr: "CTO", name: "Chief Technology Officer" },
		{ id: "5", abbr: "HRM", name: "Human Resource Manager" },
		{ id: "6", abbr: "AO", name: "Admin Officer" },
		{ id: "7", abbr: "SE", name: "Software Engineer" },
		{ id: "8", abbr: "GD", name: "Graphics Designer" },
		{ id: "9", abbr: "ATT", name: "Accountant" }
	];
	$scope.config = {
		templateUrl	: 'templates/dl-select/designation-picker-option.html',
		searchKeys	: ['name', 'abbr']
	};
});
```

**Preview**

![dl-select Preview](http://ohbhens.com/_/hosted_content/dl-select/preview-2.gif "dl-select preview")

### 3.3. Loading Options from API Call
**HTML**
```HTML
<dl-select ng-model="designation" options="designations" config="config">
	<span class="badge badge-primary">{{designation.abbr}}</span> 
	{{designation.name}}
</dl-select>
<script id="templates/dl-select/designation-picker-option.html" type="text/ng-template">
	<span class="badge badge-pill badge-light" style="width: 40px;" ng-bind-html="$option.abbreviation|dlHighlightSearch:$search"></span> 
	<span ng-bind-html="$option.name|dlHighlightSearch:$search"></span>
</script>
```

**JS**
```JS
var module = angular.module("testModule", [ "dl-select" ]);

module.factory('API', function($resource) {
	return {
		designations : $resource('https://api.test.com/designations/:id', { id : '@id' }),
	};
});

module.controller("testController", function($scope, API) {
	$scope.designation = "";
	$scope.designations = [];

	API.designations.query(function success(designations) {
		$scope.designations = designations;
		// Let's assume that the designations returned from API are as follows
		/*
		[
			{ id: "1", abbr: "CHM", name: "Chairman" },
			{ id: "2", abbr: "MD", name: "Managing Director" },
			{ id: "3", abbr: "CEO", name: "Chief Executive Officer" },
			{ id: "4", abbr: "CTO", name: "Chief Technology Officer" },
			{ id: "5", abbr: "HRM", name: "Human Resource Manager" },
			{ id: "6", abbr: "AO", name: "Admin Officer" },
			{ id: "7", abbr: "SE", name: "Software Engineer" },
			{ id: "8", abbr: "GD", name: "Graphics Designer" },
			{ id: "9", abbr: "ATT", name: "Accountant" }
		]
		*/

	}, function() error {
		// Handle error case here
	});

	$scope.config = {
		templateUrl	: 'templates/dl-select/designation-picker-option.html',
		searchKeys	: ['name', 'abbr']
	};
});
```

**Preview**

![dl-select Preview](http://ohbhens.com/_/hosted_content/dl-select/preview-3.gif "dl-select preview")

### 3.4. Select String from Object type Options
**HTML**
```HTML
<dl-select ng-model="designation" options="designations" config="config"></dl-select>
```

**JS**
```JS
var module = angular.module("testModule", [ "dl-select" ]);

module.controller("testController", function($scope) {
	$scope.designation = "";
	$scope.designations = [
		{ id: "1", abbr: "CHM", name: "Chairman" },
		{ id: "2", abbr: "MD", name: "Managing Director" },
		{ id: "3", abbr: "CEO", name: "Chief Executive Officer" },
		{ id: "4", abbr: "CTO", name: "Chief Technology Officer" },
		{ id: "5", abbr: "HRM", name: "Human Resource Manager" },
		{ id: "6", abbr: "AO", name: "Admin Officer" },
		{ id: "7", abbr: "SE", name: "Software Engineer" },
		{ id: "8", abbr: "GD", name: "Graphics Designer" },
		{ id: "9", abbr: "ATT", name: "Accountant" }
	];
	$scope.config = {
		searchKeys	: ['name', 'abbr'],
		selectKey	: 'name'
	};
});
```

**Preview**

![dl-select Preview](http://ohbhens.com/_/hosted_content/dl-select/preview-1.gif "dl-select preview")

## 4. dl-select Cheatsheet
```HTML
<dl-select ng-model="selected" options="optionList" config="displayConfig" ng-required="true" ng-disabled="false">{{selected}}</dl-select>
```

### 4.1. Attributes
| Attribute     | Accepted Value       | Description                                                               |
| ------------- | -------------------- | ------------------------------------------------------------------------- |
| `ng-model`    | Scope Variable       | Variable in which selected value will be asigned                          |
| `options`     | Array of options     | Array containing options, could be either `string` array or `object` array|
| `config`      | configuration object | See chart for configurations below                                        |
| `ng-required` | `boolean`            | Useful for form validation                                                |
| `ng-disabled` | `boolean`            | Useful for disabling user input                                           |

### 4.2. Configuration Object
| Key                 | Accepted Value | Default Value                | Description                                                                                                                                     |
| ------------------- | -------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `templateUrl`       | `string`       | `null`                       | URL to the template you want to use for displaying options in dl-select                                                                         |
| `searchKeys`        | `[string]`     | `null`                       | Applicable only in case of object options, use if you want to search in specific keys of your object                                            |
| `selectKey`         | `string`       | `null`                       | Applicable only in case of object options, use if you want to select string value from object options                                           |
| `dropdownIconClass` | `string`       | `fa fa-fw fa-caret-down`     | Valid css class string to be applied on dropdown arrow icon                                                                                     |
| `searchIconClass`   | `string`       | `fa fa-fw fa-search`         | Valid css class string to be applied on search icon in search box                                                                               |
| `loaderClass`       | `string`       | `fa fa-fw fa-circle-o-notch` | Valid css class string to be applied on loader icon. Loader is displayed when options list is empty. Useful in case of loading options from API |


