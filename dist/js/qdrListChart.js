/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/
'use strict';
/* global angular */

/**
 * @module QDR
 */

var QDR = (function(QDR) {

  QDR.module.controller('QDR.ListChartController', function ($scope, $uibModalInstance, $uibModal, $location, QDRService, QDRChartService, chart, nodeName) {

    $scope.chart = chart;
    $scope.dialogSvgChart = null;
    let updateTimer = null;
    $scope.svgDivId = 'dialogChart';    // the div id for the svg chart

    $scope.showChartsPage = function () {
      cleanup();
      $uibModalInstance.close(true);
      $location.path(QDR.pluginRoot + '/charts');
    };

    $scope.addHChart = function () {
      QDRChartService.addHDash($scope.chart);
      cleanup();
      $uibModalInstance.close(true);
    };

    $scope.addToDashboardLink = function () {
      let href = '#/' + QDR.pluginName + '/charts';
      let size = angular.toJson({
        size_x: 2,
        size_y: 2
      });

      let params = angular.toJson({chid: $scope.chart.id()});
      let title = 'Dispatch - ' + nodeName;
      return '/hawtio/#/dashboard/add?tab=dashboard' +
        '&href=' + encodeURIComponent(href) +
        '&routeParams=' + encodeURIComponent(params) +
        '&title=' + encodeURIComponent(title) +
        '&size=' + encodeURIComponent(size);
    };


    $scope.addChartsPage = function () {
      QDRChartService.addDashboard($scope.chart);
    };

    $scope.delChartsPage = function () {
      QDRChartService.delDashboard($scope.chart);
    };

    $scope.isOnChartsPage = function () {
      return $scope.chart.dashboard;
    };

    var showChart = function () {
      // we need a width and height before generating the chart
      let div = angular.element('#pfDialogChart');
      if (!div.width()) {
        setTimeout(showChart, 100);
        return;
      }
      $scope.pfDialogSvgChart = new QDRChartService.pfAreaChart($scope.chart, 'pfDialogChart');
      updateDialogChart();
    };
    showChart();

    var updateDialogChart = function () {
      if ($scope.pfDialogSvgChart) {
        $scope.pfDialogSvgChart.tick();
      }
      if (updateTimer)
        clearTimeout(updateTimer);
      updateTimer = setTimeout(updateDialogChart, 1000);
    };

    var cleanup = function () {
      if (updateTimer) {
        clearTimeout(updateTimer);
        updateTimer = null;
      }
      if (!$scope.chart.hdash && !$scope.chart.dashboard)
        QDRChartService.unRegisterChart($scope.chart);     // remove the chart

    };
    $scope.ok = function () {
      cleanup();
      $uibModalInstance.close(true);
    };

    $scope.editChart = function () {
      doDialog('tmplChartConfig.html', chart);
    };

    function doDialog(template, chart) {

      $uibModal.open({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: QDR.templatePath + template,
        controller: 'QDR.ChartDialogController',
        resolve: {
          chart: function() {
            return chart;
          },
          updateTick: function () {
            return function () {};
          },
          dashboard: function () {
            return $scope;
          },
          adding: function () {
            return true;
          }
        }
      }).result.then(function() {
        $scope.ok();
      });
    }

  });

  return QDR;

} (QDR || {}));
