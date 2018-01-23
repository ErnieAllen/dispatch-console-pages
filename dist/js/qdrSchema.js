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
/**
 * @module QDR
 */
var QDR = (function (QDR) {

  QDR.module.controller("QDR.SchemaController", ['$scope', '$location', '$timeout', 'QDRService', function($scope, $location, $timeout, QDRService) {
    if (!QDRService.management.connection.is_connected()) {
      QDR.redirectWhenConnected($location, "schema")
      return;
    }
    var onDisconnect = function () {
      $timeout( function () {QDR.redirectWhenConnected("schema")})
    }
    // we are currently connected. setup a handler to get notified if we are ever disconnected
    QDRService.management.connection.addDisconnectAction( onDisconnect )

    var keys2kids = function (tree, obj) {
      if (obj === Object(obj)) {
        tree.children = []
        var keys = Object.keys(obj).sort()
        for (var i=0; i<keys.length; ++i) {
          var key = keys[i];
          var kid = {title: key}
          if (obj[key] === Object(obj[key])) {
              kid.folder = true
              keys2kids(kid, obj[key])
          } else {
            kid.title += (': ' + JSON.stringify(obj[key],null,2))
          }
          tree.children.push(kid)
        }
      }
    }

    var tree = []
    for (var key in QDRService.management.schema()) {
      var kid = {title: key}
      kid.folder = true
      var val = QDRService.management.schema()[key]
      if (val === Object(val))
        keys2kids(kid, val)
      else
        kid.title += (': ' + JSON.stringify(val,null,2))

      tree.push(kid);
    }
    $('#schema').fancytree({
      minExpandLevel: 2,
      clickFolderMode: 3,
      classNames: {
        expander: 'fa-angle',
        connector: 'fancytree-no-connector'
      },
      source: tree
    })

      $scope.$on("$destroy", function(event) {
        QDRService.management.connection.delDisconnectAction( onDisconnect )
      });

  }]);

    return QDR;
}(QDR || {}));
