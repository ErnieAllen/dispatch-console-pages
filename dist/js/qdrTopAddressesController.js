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
var QDR = (function(QDR) {

  QDR.module.controller('QDR.TopAddressesController', function ($scope, QDRService, $timeout) {

    var selectRow = function (gridApi) {
      if (!gridApi.selection)
        return
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
      })
    }
    $scope.addressesData = []
    $scope.topAddressesGrid = {
      data: 'addressesData',
      columnDefs: [
        {
          field: 'address',
          displayName: 'address'
        },
        {
          field: 'class',
          displayName: 'class'
        },
/*
        {
          field: 'phase',
          displayName: 'phase',
          cellClass: 'grid-align-value'
        },
        {
          field: 'inproc',
          displayName: 'in-proc'
        },
        {
          field: 'local',
          displayName: 'local',
          cellClass: 'grid-align-value'
        },
        {
          field: 'remote',
          displayName: 'remote',
          cellClass: 'grid-align-value'
        },
        */
        {
          field: 'in',
          displayName: 'in',
          cellClass: 'grid-align-value'
        },
        {
          field: 'out',
          displayName: 'out',
          cellClass: 'grid-align-value'
        }
      ],
      enableColumnResize: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      multiSelect: false,
      enableSelectAll: false,
      onRegisterApi: selectRow,
      enableSelectionBatchEvent: false,
      enableRowHeaderSelection: false,
      noUnselect: true
    };

    // get info for all addresses
    var allAddressInfo = function (address, callback) {
      var nodes = {}
      // gets called each node/entity response
      var gotNode = function (nodeName, entity, response) {
        if (!nodes[nodeName])
          nodes[nodeName] = {}
        nodes[nodeName][entity] = angular.copy(response);
      }
      var addr_class = function (addr) {
        if (!addr) return "-"
            if (addr[0] == 'M')  return "mobile"
            if (addr[0] == 'R')  return "router"
            if (addr[0] == 'A')  return "area"
            if (addr[0] == 'L')  return "local"
            if (addr[0] == 'C')  return "link-incoming"
            if (addr[0] == 'E')  return "link-incoming"
            if (addr[0] == 'D')  return "link-outgoing"
            if (addr[0] == 'F')  return "link-outgoing"
            if (addr[0] == 'T')  return "topo"
            return "unknown: " + addr[0]
      }
      var addr_phase = function (addr) {
        if (!addr)
          return "-"
        if (addr[0] == 'M')
          return addr[1]
        return ''
      }
      var prettyVal = function (val) {
        return QDRService.utilities.pretty(val || "-")
      }
      var addressFields = []
      var addressObjs = {}
      var addNull = function (oldVal, newVal) {
        if (oldVal != null && newVal != null)
          return oldVal + newVal
        if (oldVal != null)
          return oldVal
        return newVal
      }
      // send the requests for all connection and router info for all routers
      QDRService.management.topology.fetchAllEntities({entity: "router.address"}, function () {
        for (var node in nodes) {
          var response = nodes[node]["router.address"]
          response.results.forEach( function (result) {
            var address = QDRService.utilities.flatten(response.attributeNames, result)
            var uid = address.identity
            var identity = QDRService.utilities.identity_clean(uid)

            var objname = QDRService.utilities.addr_text(identity)+QDRService.utilities.addr_class(identity)
            if (!addressObjs[objname]) {
              addressObjs[objname] = {
                address: QDRService.utilities.addr_text(identity),
                'class': QDRService.utilities.addr_class(identity),
                phase:   addr_phase(identity),
                inproc:  address.inProcess,
                local:   address.subscriberCount,
                remote:  address.remoteCount,
                'in':    address.deliveriesIngress,
                out:     address.deliveriesEgress,
                thru:    address.deliveriesTransit,
                toproc:  address.deliveriesToContainer,
                fromproc:address.deliveriesFromContainer,
                uid:     uid
              }
            }
            else {
              var sumObj = addressObjs[objname]
              sumObj.inproc = addNull(sumObj.inproc, address.inProcess)
              sumObj.local = addNull(sumObj.local, address.subscriberCount)
              sumObj.remote = addNull(sumObj.remote, address.remoteCount)
              sumObj['in'] = addNull(sumObj['in'], address.deliveriesIngress)
              sumObj.out = addNull(sumObj.out, address.deliveriesEgress)
              sumObj.thru = addNull(sumObj.thru, address.deliveriesTransit)
              sumObj.toproc = addNull(sumObj.toproc, address.deliveriesToContainer)
              sumObj.fromproc = addNull(sumObj.fromproc, address.deliveriesFromContainer)
            }
          })
        }
        for (var obj in addressObjs) {
          addressObjs[obj].inproc = prettyVal(addressObjs[obj].inproc)
          addressObjs[obj].local = prettyVal(addressObjs[obj].local)
          addressObjs[obj].remote = prettyVal(addressObjs[obj].remote)
          addressObjs[obj]['in'] = prettyVal(addressObjs[obj]['in'])
          addressObjs[obj].rawout = addressObjs[obj].out
          addressObjs[obj].out = prettyVal(addressObjs[obj].out)
          addressObjs[obj].thru = prettyVal(addressObjs[obj].thru)
          addressObjs[obj].toproc = prettyVal(addressObjs[obj].toproc)
          addressObjs[obj].fromproc = prettyVal(addressObjs[obj].fromproc)
          addressFields.push(addressObjs[obj])
        }
        if (addressFields.length === 0)
          return;
        // update the grid's data
        addressFields.sort ( function (a,b) {
          return a.address + a['class'] < b.address + b['class'] ? -1 : a.address + a['class'] > b.address + b['class'] ? 1 : 0}
        )
        // callapse all records with same addres+class
        addressFields[0].title = addressFields[0].address
        for (var i=1; i<addressFields.length; ++i) {
          // if this address is the same as the previous address, add a class to the display titles
          if (addressFields[i].address === addressFields[i-1].address) {
            addressFields[i-1].title = addressFields[i-1].address + " (" + addressFields[i-1]['class'] + ")"
            addressFields[i].title = addressFields[i].address + " (" + addressFields[i]['class'] + ")"
          } else
            addressFields[i].title = addressFields[i].address
        }
        addressFields = addressFields.filter( function (address) {
          return address.rawout > 0 || address.rawin > 0
        })
        addressFields.sort ( function (a,b) {
          return a.rawout < b.rawout ? -1 : a.rawout > b.rawout ? 1 : 0}
        )
        // take top 5 records
        addressFields.splice(5)

        $scope.addressesData = addressFields
        callback(null)
      }, gotNode)
    }
    var timer;
    var updateGrid = function () {
      $timeout( function () {
        allAddressInfo(null, function () {console.log('done')})
        expandGridToContent($scope.addressesData.length)
      })
    }
    timer = setInterval(updateGrid, 5000)
    updateGrid()

    var expandGridToContent = function (rows) {
      var height = (rows+1) * 30 + 40 // header is 40px
      var gridDetails = $('#overview-controller .grid')
      gridDetails.css('height', height + "px")
    }

    $scope.anyAddresses = function () {
      return $scope.addressesData.length > 0
    }

    $scope.$on("$destroy", function( event ) {
      if (timer)
        clearInterval(timer)
    });

  });
  return QDR;

} (QDR || {}));
