/*!
 * dl-select
 * https://github.com/doozielabs/dl-select
 *
 * Copyright 2018 Doozie Labs
 * Released under the GPL v3.0 license
 */
(function() {

	if (typeof angular == "undefined" || !angular) { return; }

	var module = angular.module('dl-select', []);

	module.directive('dlSelect', ['$filter', function($filter) {
		var KEY = {
			TAB		: 9,
			ENTER	: 13,
			ESCAPE	: 27,
			SPACE	: 32,
			UP		: 38,
			DOWN	: 40
		};

		return {
			restrict : 'E',
			scope : {
				selected	: '=ngModel',
				options		: '=',
				config		: "=",
				disabled	: '&ngDisabled',
				required	: '&ngRequired'
			},
			template :	'<button class="form-control" ng-click="toggle()"><span>{{selected}}</span> <i class="fa fa-fw fa-caret-down pull-right"></i></button>' +
						'<div class="dl-select-dropdown-container">' +
							'<div class="dl-select-search-container">' +
								'<input class="form-control" type="text" ng-model="$search">' +
							'</div>'+
							'<ul class="dl-select-dropdown">' +
								'<li ng-repeat="$option in filteredOptions track by $index" ng-class="{ active: selected == $option }" ng-click="selectOption($option)" ng-bind-html="$option|dlHighlightSearch:$search">' +
									'{{$option|dlHighlightSearch:$search}}' +
								'</li>' +
								'<li class="disabled text-center" ng-if="!options.length"><i class="fa fa-warning"></i> Nothing to select</li>' +
								'<li class="disabled text-center" ng-if="options.length && !filteredOptions.length"><i class="fa fa-warning"></i> No results found for "{{$search}}"</li>' +
							'</ul>' +
						'</div>' +
						'<input type="hidden" ng-model="selected" ng-required="required()">',
			controller : ['$scope', '$element', function($scope, $element) {
				$scope.$search = "";

				// Toggle selectbox dropdown
				$scope.toggle = function() {
					$element.toggleClass('open');
					if ($element.hasClass('open')) {
						$scope.open();
					} else {
						$scope.close();
					}
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

				// Open selecbox dropdown
				$scope.selectOption = function(option) {
					$scope.selected = option;
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
								var index = $scope.filteredOptions.indexOf($scope.selected);
								var prevIndex = $scope.filteredOptions.length - 1;
								if (index > 0) {
									prevIndex = index - 1;
								}
								$scope.selected = $scope.filteredOptions[prevIndex];
							}
							break;
						case KEY.DOWN:
							if ($scope.filteredOptions.length) {
								var currentIndex = $scope.filteredOptions.indexOf($scope.selected);
								var nextIndex = 0;
								if (currentIndex < $scope.filteredOptions.length - 1) {
									nextIndex = currentIndex + 1;
								}
								$scope.selected = $scope.filteredOptions[nextIndex];
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
					if (typeof search != "undefined") {
						$scope.filteredOptions = $filter('filter')($scope.options, search);
						if ($scope.filteredOptions.length && $scope.filteredOptions.indexOf($scope.selected) == -1) {
							$scope.selected = $scope.filteredOptions[0];
						}
					}
				});

				// If no option is selected, select 1st option from given list
				if (!$scope.selected && $scope.options && $scope.options.length) {
					$scope.selectOption($scope.options[0]);
				}
			}]
		};
	}]);

	module.filter('dlHighlightSearch', ['$sce', function ($sce) {
		return function (text, search) {
			if (!search) {
				return $sce.trustAsHtml(text);
			}
			return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<b><u>$&</u></b>'));
		};
	}]);

})();
