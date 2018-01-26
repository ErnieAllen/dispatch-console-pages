# dispatch-console-pages

Common angular js/html/css pages for the Apache Qpid Dispatch consoles. Current incarnation are:

  - https://github.com/ErnieAllen/qpid-dispatch/tree/master/console/stand-alone
  - https://github.com/ErnieAllen/dispatch-hawtio2

Pages implemented are:

  - Login
  - Overview
  - Entities
  - Topology
  - Charts
  - Schema

## Install with npm
  npm install dispatch-console-pages

## In index.html

```
<link rel="stylesheet" href="plugins/dispatch/css/plugin.css" type="text/css"/>
<link rel="stylesheet" href="plugins/dispatch/css/dispatch.css" type="text/css"/>
<link rel="stylesheet" href="plugins/dispatch/css/dispatchpf.css" type="text/css"/>

<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrOverview.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrOverviewLogsController.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrOverviewChartsController.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrTopAddressesController.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/dlgChartController.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrList.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrListChart.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrCharts.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrSchema.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrService.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrChartService.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrTopology.js"></script>
<script type="text/javascript" src="node_modules/dispatch-console-pages/dist/js/qdrSettings.js"></script>
```

