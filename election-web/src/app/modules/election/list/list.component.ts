import { AfterViewInit, Component } from '@angular/core';
import { Election } from '@app/model/election';
import { ElectionService } from '@services/election.services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [ElectionService],
})
export class ListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'election_name',
    'election_start_date',
    'election_end_date',
    'advanced_polling',
    'locked',
    'progress',
    'view',
  ];

  electionDataSource: Election[] = [];

  // DI ElectionServices
  constructor(private electionServices: ElectionService) {}

  ngAfterViewInit(): void {
    this.setDataSource();
  }

  // Retrieves elections from DB and sets the datasource
  private setDataSource(): void {
    console.log('LOADING...');
    this.electionServices.getAllElections().subscribe((election) => {
      this.electionDataSource = election;
    });
  }

  // Displays whether Advanced Polling is enabled or not
  // disabled: boolean; // 0 - deleted election, 1 - valid election
  getAdvPoll(data: number): string {
    switch (data) {
      case 0: {
        return 'Yes';
      }
      case 1: {
        return 'No';
      }
    }
  }

  // Displays the election status
  // progress: number; // 0 - not running, 1 - in progress, 2 - completed
  getProgress(data: number): string {
    switch (data) {
      case 0: {
        return 'Not Running';
      }
      case 1: {
        return 'In Progress';
      }
      case 2: {
        return 'Completed';
      }
    }
  }

  // Displays whether the electrion has been locked from to prevent changes
  // locked: boolean; // 0 - unlocked(editable), 1 - locked(not running/in progress/completed)
  // Returns the mat_icon string
  getStatus(data): string {
    switch (data) {
      case 0: {
        return 'lock_open';
      }
      case 1: {
        return 'lock';
      }
    }
  }
}
