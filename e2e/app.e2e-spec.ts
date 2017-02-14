import { AvetodoPage } from './app.po';

describe('avetodo App', function() {
  let page: AvetodoPage;

  beforeEach(() => {
    page = new AvetodoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
