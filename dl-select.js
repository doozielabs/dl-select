/*!
 * dl-select v1.0.2
 * https://github.com/doozielabs/dl-select
 *
 * Copyright 2018 Doozie Labs
 * Released under the GPL v3.0 license
 */
(function() {

	if (typeof angular == "undefined" || !angular) { return; }

	var module = angular.module('dl-select', []);

	module.directive('dlSelect', ['$filter', '$compile', '$sce', function($filter, $compile, $sce) {
		var KEY = {
			TAB		: 9,
			ENTER	: 13,
			ESCAPE	: 27,
			SPACE	: 32,
			UP		: 38,
			DOWN	: 40
		};

		var configDefaults = {
			templateUrl	: null,
			searchKeys	: null
		};

		return {
			restrict : 'E',
			scope : {
				$selected	: '=ngModel',
				options		: '=',
				config		: "=?",
				disabled	: '&ngDisabled',
				required	: '&ngRequired'
			},
			transclude : true,
			template :	'<button class="form-control" ng-click="toggle()" ng-disabled="disabled()"><span ng-transclude>{{$selected}}</span> <i class="fa fa-fw fa-caret-down pull-right"></i></button>' +
						'<div class="dl-select-dropdown-container">' +
							'<div class="dl-select-search-container">' +
								'<input class="form-control" type="text" ng-model="$search">' +
							'</div>'+
							'<ul class="dl-select-dropdown">' +
								'<li ng-if="!config.templateUrl" ng-repeat="$option in filteredOptions track by $index" ng-class="{ active: isSelected($option) }" ng-click="selectOption($option)" ng-bind-html="$option|dlHighlightSearch:$search"></li>' +
								'<li ng-if="config.templateUrl" ng-repeat="$option in filteredOptions track by $index" ng-class="{ active: isSelected($option) }" ng-click="selectOption($option)"><div ng-include="config.templateUrl"></div></li>' +
								'<li class="disabled text-center" ng-if="!options.length"><i class="fa fa-warning"></i> Nothing to select</li>' +
								'<li class="disabled text-center" ng-if="options.length && !filteredOptions.length"><i class="fa fa-warning"></i> No results found for "{{$search}}"</li>' +
							'</ul>' +
						'</div>' +
						'<input type="hidden" ng-model="$selected" ng-required="required()">',
			controller : ['$scope', '$element', '$transclude', function($scope, $element, $transclude) {
				$scope.$search	= "";
				$scope.config	= angular.merge(configDefaults, $scope.config);
				// Toggle selectbox dropdown
				$scope.toggle = function() {
					$element.toggleClass('open');
					$element.hasClass('open') ? $scope.open() : $scope.close();
				};

				// Open selecbox dropdown
				$scope.open = function() {
					$element.addClass('open');
					$element.find('input.form-control').focus();
				};

				// Close selecbox dropdown
				$scope.close = function(doFocus) {
					$element.removeClass('open');
					if (doFocus !== false) {
						$element.find('button.form-control').focus();
					}
					$scope.$search = "";
				};

				$scope.isSelected = function(option) {
					return _.isMatch($scope.$selected, option);
				};

				// Open selecbox dropdown
				$scope.selectOption = function(option) {
					$scope.$selected = option;
				};

				$scope.filter = function(search) {
					if (typeof search != "undefined" && $scope.options.length) {
						var criteria = search;
						if ($scope.config.searchKeys && $scope.config.searchKeys.length && _.every($scope.options, _.isObject)) {
							$scope.filteredOptions = _.uniq(_.flatten(_.map($scope.config.searchKeys, function(key) {
								var criteria = {};
								criteria[key] = search;
								return $filter('filter')($scope.options, criteria);
							})));
						} else {
							$scope.filteredOptions = $filter('filter')($scope.options, search);
						}
						if ($scope.filteredOptions.length && _.findIndex($scope.filteredOptions, $scope.$selected) == -1) {
							$scope.selectOption($scope.filteredOptions[0]);
						}
					}
				};

				$element.find('button.form-control').keydown(function(e) {
					switch (e.which) {
						case KEY.ESCAPE:
							$scope.close();
							e.preventDefault();
							break;
						case KEY.TAB:
							$scope.close(false);
							break;
						case KEY.SPACE:
						case KEY.ENTER:
						case KEY.UP:
						case KEY.DOWN:
							e.preventDefault();
						default:
							$scope.open();
							break;
					}
					$scope.$apply();
				});
				
				$element.find('input.form-control').keydown(function(e) {
					switch (e.which) {
						case KEY.ENTER:
						case KEY.ESCAPE:
							e.preventDefault();
							$scope.close();
							break;
						case KEY.UP:
							if ($scope.filteredOptions.length) {
								var index = _.findIndex($scope.filteredOptions, $scope.$selected);
								var prevIndex = $scope.filteredOptions.length - 1;
								if (index > 0) {
									prevIndex = index - 1;
								}
								$scope.selectOption($scope.filteredOptions[prevIndex]);
							}
							break;
						case KEY.DOWN:
							if ($scope.filteredOptions.length) {
								var currentIndex = _.findIndex($scope.filteredOptions, $scope.$selected);
								var nextIndex = 0;
								if (currentIndex < $scope.filteredOptions.length - 1) {
									nextIndex = currentIndex + 1;
								}
								$scope.selectOption($scope.filteredOptions[nextIndex]);
							}
							break;
						case KEY.TAB:
							$scope.close(false);
							break;
					}
					$scope.$apply();
				});

				// Close selecbox dropdown when clicked outside of element
				angular.element(window).click(function(e) {
					if (!$element.has(e.target).length && !$element.is(event.target)) {
						$scope.close(false);
					}
				});

				// Select first item from filtered list in case selected option is not available in filtered list
				$scope.$watch('$search', function(search, old) {
					$scope.filter(search);
				});

				// Support dynamic options loading (via API or delayed functions)
				$scope.$watch('options', function(newOptions) {
					// If no option is selected, select 1st option from given list
					if (!$scope.$selected && $scope.options && $scope.options.length) {
						$scope.selectOption($scope.options[0]);
					}

					$scope.filter($scope.$search);
				}, true);
			}]
		};
	}]);

	module.filter('dlHighlightSearch', ['$sce', function ($sce) {
		return function (text, search) {
			if (!text) { text = ""; }
			if (!search) {return $sce.trustAsHtml(text); }
			return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<b><u>$&</u></b>'));
		};
	}]);

})();
