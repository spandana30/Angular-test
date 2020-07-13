import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FootballMatchesComponent} from './football-matches.component';
import fetchMock from 'fetch-mock';

describe('FootballMatchesComponent', () => {
  let component: FootballMatchesComponent;
  let fixture: ComponentFixture<FootballMatchesComponent>;
  let compiled;

  const getByTestId = (testId: string) => {
    return compiled.querySelector(`[data-test-id="${testId}"]`);
  };

  const getYearList = (): HTMLElement[] => {
    const yearList: HTMLElement[] = Array.from(getByTestId('year-list').children);
    yearList.splice(0, 1);
    return yearList;
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FootballMatchesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FootballMatchesComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  afterEach(fetchMock.reset);


  it('Should render the initial UI as expected', async () => {
    const yearList = getYearList();
    expect(yearList.length).toEqual(7);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(getByTestId('total-matches')).toBe(null);
    expect(getByTestId('match-list')).toBe(null);
    expect(getByTestId('no-result')).toBe(null);
  });

  it("Should show no results found if API returns no data", async (done) => {
    const yearList = getYearList();
    const url = 'https://jsonmock.hackerrank.com/api/football_competitions?year=2017';
    fetchMock.getOnce(url, JSON.stringify({page: 1, per_page: 10, total: 0, total_pages: 0, data: []}));
    yearList[6].click();
    await fixture.whenStable();

    setTimeout(async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(fetchMock.called('https://jsonmock.hackerrank.com/api/football_competitions?year=2017')).toBeTrue();
      expect(getByTestId('total-matches')).toBe(null);
      expect(getByTestId('match-list')).toBe(null);
      expect(getByTestId('no-result')).not.toBe(null);
      expect(getByTestId('no-result').innerHTML.trim()).toEqual('No Matches Found');
      done();
    }, 0);
  });

  it('Should render the matches list after data is fetched from API - 1', async (done) => {
    const yearList = getYearList();
    const url = 'https://jsonmock.hackerrank.com/api/football_competitions?year=2011';
    fetchMock.get(url, JSON.stringify({
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
      data: [{
        "name": "UEFA Champions League",
        "country": "",
        "year": 2011,
        "winner": "Chelsea",
        "runnerup": "Bayern Munich"
      }, {
        "name": "Serie A",
        "country": "Italy",
        "year": 2011,
        "winner": "Juventus",
        "runnerup": "AC Milan"
      }, {
        "name": "Bundesliga",
        "country": "Germany",
        "year": 2011,
        "winner": "Borussia Dortmund",
        "runnerup": "Bayern Munchen"
      }]
    }));
    yearList[0].click();
    await fixture.whenStable()

    setTimeout(async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(fetchMock.called('https://jsonmock.hackerrank.com/api/football_competitions?year=2011')).toBeTrue();
      expect(getByTestId('total-matches').innerHTML.trim()).toBe('Total Matches: 3');
      const results = getByTestId('match-list').children;
      expect(results[0].innerHTML.trim()).toEqual('Match UEFA Champions League won by Chelsea');
      expect(results[1].innerHTML.trim()).toEqual('Match Serie A won by Juventus');
      expect(results[2].innerHTML.trim()).toEqual('Match Bundesliga won by Borussia Dortmund');
      expect(getByTestId('no-result')).toBe(null);
      done();
    }, 0);
  })
  it('Should render the matches list after data is fetched from API - 2', async (done) => {
    const yearList = getYearList();
    const url = 'https://jsonmock.hackerrank.com/api/football_competitions?year=2013';
    fetchMock.getOnce(url, JSON.stringify({ page:1,per_page:10,total:0,total_pages:0,data:[{"name":"English Premier League","country":"England","year":2013,"winner":"Manchester City","runnerup":"Liverpool"},{"name":"La Liga","country":"Spain","year":2013,"winner":"Atletico Madrid","runnerup":"FC Barcelona"}]}));

    yearList[2].click();
    await fixture.whenStable()

    setTimeout(async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      expect(fetchMock.called('https://jsonmock.hackerrank.com/api/football_competitions?year=2013')).toBeTrue();
      expect(getByTestId('total-matches').innerHTML.trim()).toBe('Total Matches: 2');
      const results = getByTestId('match-list').children;
      expect(results[0].innerHTML.trim()).toEqual('Match English Premier League won by Manchester City');
      expect(results[1].innerHTML.trim()).toEqual('Match La Liga won by Atletico Madrid');
      expect(getByTestId('no-result')).toBe(null);
      done();
    }, 0);
  })
});
