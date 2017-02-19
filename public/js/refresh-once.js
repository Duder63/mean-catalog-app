'use strict';

function refreshPage() {
  //ensure reloading from server instead of cache
  location.reload(true);
}
function delayRefreshPage(mileSeconds) {
  window.setTimeout(refreshPage, mileSeconds);
  delayRefreshPage(1000);
}