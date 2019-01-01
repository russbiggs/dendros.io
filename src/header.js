class Header {
  constructor(data) {
    this.siteName = document.querySelector('.header__site-name')
    this.collector = document.querySelector('.header__collector')
    this.species = document.querySelector('.header__species')
    this.dateRange = document.querySelector('.header__date-range');

    this.update = this.update.bind(this);
  }

  update(data) {
    const { siteName = '', siteId = '', leadInvestigator = '', species = '', speciesCode = '', firstYear = '', lastYear = '', location = {} } = data.metadata;
    this.siteName.innerHTML = `${siteName} (${siteId})`;
    this.collector.innerHTML = leadInvestigator;
    this.species.innerHTML = `${species} (${speciesCode})`;
    this.dateRange.innerHTML = `${firstYear}-${lastYear}`;
  }
}

export default Header;