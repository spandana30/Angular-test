import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-football-matches',
  templateUrl: './football-matches.component.html',
  styleUrls: ['./football-matches.component.scss']
})
export class FootballMatchesComponent implements OnInit {
  years: number[] = [2011, 2012, 2013, 2014, 2015, 2016, 2017];
  selectedYear: number;


  ngOnInit(): void {
  }

}

export interface Match {
  name: string;
  winner: string;
}
