import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Election } from '@app/model/election';
import { Candidate } from '@app/model/candidate';
import { ElectionService } from '@services/election.services';
import { BallotService } from '@services/candidate.services';
import * as moment from 'moment';
import { Ballot } from '@app/model/ballot';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ElectionService, BallotService],
})
export class EditComponent implements OnInit {
  electionForm: FormGroup;
  candidateForm: FormGroup;
  displayedColumns = ['names', 'district_id', 'remove'];

  loading = false;
  submitted = false;

  // Election Object
  election: Election;
  electionId: string;
  minEndDate: Date;
  // advancedPoll = false;
  private uid = 0;


  @ViewChild('candidateTable') table: MatTable<any>;
  dataSource: MatTableDataSource<AbstractControl>;

  constructor(
    private electionServices: ElectionService,
    private candidateServices: BallotService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder)
  {
    // Currently send the minEndDate to be at least 1 day
    const currentDate = moment();
    this.minEndDate = currentDate.add(1, 'day').toDate();

    // this.dataSource = new MatTableDataSource(
    //   this.candidatesFormArray.controls);
  }

  ngOnInit(): void {
    // Retrieve election_id from url;
    this.electionId = this.route.snapshot.params.id;

    // Load data and patch values into form
    this.loadElection(this.electionId);
    this.loadCandidates(this.electionId);

    this.createElectionForm();
    this.createCandidateForm();
  }

  private createElectionForm(): void {
    this.electionForm = this.formBuilder.group({
      election_name: ['', Validators.required],
      election_start_date: ['', Validators.required],
      election_end_date: ['', Validators.required],
      advanced_start_date: [''],
      advanced_end_date: [''],
      advanced_polling: [false, Validators.required],
    });
  }

  private createCandidateForm(): void  {
    this.candidateForm = this.formBuilder.group({
      names: new FormArray([])
    });
  }

  // // getters to access form fields
  // get candidatesFormArray() {
  //   return this.candidateForm.get('names') as FormArray;
  // }

  // User generate additional district forms
  // addCandidate() {
  //   // this.numCandidate++;
  //   // Create the candidate Forms
  //   this.candidatesFormArray.push(
  //     this.formBuilder.group({
  //       uid: this.increaseUid(),
  //       candidate_name: ['', Validators.required],
  //       district_id: ['', Validators.required]
  //     }));
  //   return;
  // }

    // Delete candidate row from form
  // onDeleteCandidate(e) {
  //   this.candidatesFormArray.removeAt()
  //   this.decreaseUid()
  //   return;
  // }

  // createRow() {
  //   this.addCandidate();
  //   this.table.renderRows();
  // }

  // trackRows(index: number, row: AbstractControl) {
  //   return row.value.uid;
  // }

  // private increaseUid() {
  //   ++this.uid;
  //   return this.uid;
  // }
  
  // private decreaseUid() {

  // }



  // Retrieves the ballot from Election DB
  private loadCandidates(electionId: string): void {
    console.log('Getting Candidates');

    this.candidateServices.getCandidatesByElection(electionId)
      .subscribe( ballot => {
        // const candidateList = ballot;
        console.log(ballot);
      });
  }

  // Retrieves elections from DB
  // Ensures the most up to date information
  private loadElection(electionId: string): void {
    console.log('Getting Election');
    this.electionServices.getElection(electionId).subscribe((election) => {
      this.election = election;
      console.log(election);

      // Update the form from retrieved election;
      this.electionForm.patchValue(election);
    });
  }

  // backClicked() {
  //   this.location.back();
  // }

}
