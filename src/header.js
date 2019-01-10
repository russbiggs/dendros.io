class Header {
  constructor() {
    this.siteName = document.querySelector('.header__site-name')
    this.collector = document.querySelector('.header__collector')
    this.species = document.querySelector('.header__species')
    this.dateRange = document.querySelector('.header__date-range');

    this.update = this.update.bind(this);
  }

  update(data) {
    if (this.siteName.firstChild) this.siteName.firstChild.remove()
    if (this.collector.firstChild) this.collector.firstChild.remove()
    if (this.species.firstChild) this.species.firstChild.remove()
    if (this.dateRange.firstChild) this.dateRange.firstChild.remove()
    const metadata = data.metadata || {};
    const { siteName = '', siteId = '', leadInvestigator = '', species = '', speciesCode = '', firstYear = '', lastYear = '', location = {} } = metadata;
    if (Object.keys(metadata).length > 0 && metadata.constructor === Object) {
      this.siteName.appendChild(document.createTextNode(`${siteName} (${siteId})`));
      this.collector.appendChild(document.createTextNode(leadInvestigator));
      this.species.appendChild(document.createTextNode(`${species} (${speciesCode})`));
      this.dateRange.appendChild(document.createTextNode(`${firstYear}-${lastYear}`));
    }
  }
}

export default Header;