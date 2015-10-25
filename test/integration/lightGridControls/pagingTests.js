/* global beforeEach, describe, it, expect, inject, module */

describe("Paging", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var dataProvider;
	var grid;
	var pager;

	var gridMarkup =
		"<table lg-grid model='dataProvider.getGridModel()'>" +
		"<tr lg-row><td>{{row.data.value}}</td></tr>" +
		"</table>";

	var pagerMarkup = "<lg-pager provider='dataProvider'></lg-pager>";

	var pagerWithSettingsMarkup = "<lg-pager provider='dataProvider' page-size-options='2,5,8'></lg-pager>";

	beforeEach(function () {
		module("lightGridControls");
		module("lightGridDataProviders");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_, _lgLocalDataProviderFactory_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		$rootScope.model = [];

		for (var i = 0; i < 42; ++i) {
			$rootScope.model.push({ value: "Value " + i });
		}

		dataProvider = _lgLocalDataProviderFactory_.create($rootScope.model);
		$rootScope.dataProvider = dataProvider;
	}));

	beforeEach(function () {
		grid = $compile(gridMarkup)($rootScope);
		pager = $compile(pagerMarkup)($rootScope);

		$rootScope.$digest();
	});

	describe("when lg-pager settings are not specified", function () {
		it("should initially have the default (10) page size value", function () {
			expect(grid.find("tr").length).toEqual(10);
		});

		it("should start from the beginning of the data set", function () {
			expect(grid.find("tr:first td").text()).toBe("Value 0");
		});
	});

	describe("when lg-pager settings are specified", function () {
		beforeEach(function () {
			pager = $compile(pagerWithSettingsMarkup)($rootScope);
			$rootScope.$digest();
		});

		it("should initially have the first specified page size value", function () {
			expect(grid.find("tr").length).toEqual(2);
		});

		it("should start from the beginning of the data set", function () {
			expect(grid.find("tr:first td").text()).toBe("Value 0");
		});
	});

	describe("interaction tests", function () {
		describe("when on the first page", function () {
			describe("and the 'previous' button is clicked", function () {
				it("should show the same page", function () {
					pager.find(".previous").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(10);
					expect(grid.find("tr:first td").text()).toBe("Value 0");
				});
			});
		});

		describe("when on the last page", function () {
			describe("and the 'next' button is clicked", function () {
				it("should show the same page", function () {
					$rootScope.dataProvider.limitTo(10, 40);
					$rootScope.$digest();

					pager.find(".next").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(2);
					expect(grid.find("tr:first td").text()).toBe("Value 40");
				});
			});
		});

		describe("when on middle page", function () {
			beforeEach(function() {
				$rootScope.dataProvider.limitTo(10, 20);
				$rootScope.$digest();
			});

			describe("and the 'next' button is clicked", function () {
				it("should show the next page of results", function () {
					pager.find(".next").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(10);
					expect(grid.find("tr:first td").text()).toBe("Value 30");
				});
			});

			describe("and the 'last' button is clicked", function () {
				it("should show the last page of results", function () {
					pager.find(".last").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(2);
					expect(grid.find("tr:first td").text()).toBe("Value 40");
				});
			});

			describe("and the 'previous' button is clicked", function () {
				it("should show the previous page of results", function () {
					pager.find(".previous").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(10);
					expect(grid.find("tr:first td").text()).toBe("Value 10");
				});
			});

			describe("and the 'first' button is clicked", function () {
				it("should show the first page of results", function () {
					pager.find(".first").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(10);
					expect(grid.find("tr:first td").text()).toBe("Value 0");
				});
			});
		});
	});

	// TODO: Test changing the page size
});