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
			SPACE	: 32,
			ENTER	: 13,
			UP		: 38,
			DOWN	: 40,
			ESCAPE	: 27
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
								'<li ng-repeat="$option in filteredOptions track by $index" ng-class="{ active: selected == $option }" ng-click="selectOption($option)">' +
									'{{$option}}' +
								'</li>' +
								'<li class="disabled text-center" ng-if="!options.length"><i class="fa fa-warning"></i> Nothing to select</li>' +
								'<li class="disabled text-center" ng-if="options.length && !filteredOptions.length"><i class="fa fa-warning"></i> No results found for "{{$search}}"</li>' +
							'</ul>' +
						'</div>' +
						'<input type="hidden" ng-model="selected" ng-required="required()">',
			link : function(scope, element, attr) {
				scope.$search = "";

				if (!scope.selected && scope.options.length) {
					scope.selected = scope.options[0];
				}

				scope.toggle = function() {
					element.toggleClass('open');
					if (element.hasClass('open')) {
						scope.open();
					} else {
						scope.close();
					}
				};

				scope.open = function() {
					scope.$search = "";
					element.addClass('open');
					element.find('input.form-control').focus();
				};

				scope.close = function(doFocus) {
					element.removeClass('open');
					if (doFocus !== false) {
						element.find('button.form-control').focus();
					}
					scope.$search = "";
				};

				scope.selectOption = function(option) {
					scope.selected = option;
				};

				element.find('button.form-control').keydown(function(e) {
					e.preventDefault();
					switch (e.which) {
						case KEY.SPACE:
						case KEY.ENTER:
						case KEY.UP:
						case KEY.DOWN:
							scope.open();
							break;
						case KEY.ESCAPE:
							scope.close();
							break;
					}
					scope.$apply();
				});
				
				element.find('input.form-control').keydown(function(e) {
					switch (e.which) {
						case KEY.ENTER:
						case KEY.ESCAPE:
							e.preventDefault();
							scope.close();
							break;
						case KEY.UP:
							if (scope.filteredOptions.length) {
								var index = scope.filteredOptions.indexOf(scope.selected);
								var prevIndex = scope.filteredOptions.length - 1;
								if (index > 0) {
									prevIndex = index - 1;
								}
								scope.selected = scope.filteredOptions[prevIndex];
							}
							break;
						case KEY.DOWN:
							if (scope.filteredOptions.length) {
								var currentIndex = scope.filteredOptions.indexOf(scope.selected);
								var nextIndex = 0;
								if (currentIndex < scope.filteredOptions.length - 1) {
									nextIndex = currentIndex + 1;
								}
								scope.selected = scope.filteredOptions[nextIndex];
							}
							break;
					}
					scope.$apply();
				});

				angular.element(window).click(function(e) {
					if (!element.has(e.target).length && !element.is(event.target)) {
						scope.close(false);
					}
				});

				scope.$watch('$search', function(search, old) {
					if (typeof search != "undefined") {
						scope.filteredOptions = $filter('filter')(scope.options, search);
						if (scope.filteredOptions.length && scope.filteredOptions.indexOf(scope.selected) == -1) {
							scope.selected = scope.filteredOptions[0];
						}
					}
				});
			}
		};
	}]);

})();
