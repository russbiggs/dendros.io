import Header from "./header";
import { get, keys, Store } from 'idb-keyval';
import Observable from "./observer";
import SampleList from "./sample-list";
import CoreChart from "./core-chart";
import TimeSeries from "./time-series";
import Modal from './modal';
import Uploader from "./uploader";


{
  const dataStore = new Store('dendro-db', 'sites-store');
  const modal = new Modal();
  const coreChart = new CoreChart();
  const timeSeries = new TimeSeries();
  const sampleObserver = new Observable();
  sampleObserver.subscribe(coreChart.update);
  sampleObserver.subscribe(timeSeries.update);
  const sampleList = new SampleList(sampleObserver);
  const header = new Header();
  const siteObserver = new Observable();
  siteObserver.subscribe(header.update);
  siteObserver.subscribe(sampleList.update);
  timeSeries.init();

  keys(dataStore).then((keys) => {
    if (keys.length > 0) {
      new Uploader(dataStore, siteObserver, true);
      get(keys[0], dataStore).then((data) => {
        siteObserver.notify(data);
      });
    } else {
      new Uploader(dataStore, siteObserver, false);
      setTimeout(() => modal.open('Upload a .rwl file to start'), 1000);
    }
  });


}