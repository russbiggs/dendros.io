import CoreChart from "./core-chart";
import Header from "./header";
import Modal from './modal';
import Observable from "./observer";
import SampleList from "./sample-list";
import SiteNav from './site-nav';
import SiteList from "./site-list";
import TimeSeries from "./time-series";
import Uploader from "./uploader";

import { get, keys, Store } from 'idb-keyval';



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
  const siteList = new SiteList(siteObserver, sampleObserver);
  new SiteNav();

  keys(dataStore).then((keys) => {
    if (keys.length > 0) {
      new Uploader(dataStore, siteObserver, siteList, true);
      get(keys[0], dataStore).then((data) => {
        siteObserver.notify(data);
      });
      const promises = [];
      for (const key of keys) {
        const site = get(key, dataStore);
        promises.push(site);
      }
      Promise.all(promises).then((sites) => {
        siteList.update(sites);
      });
    } else {
      new Uploader(dataStore, siteObserver, siteList, false);
      setTimeout(() => modal.open('Upload a .rwl file to start'), 1000);
    }
  });


}