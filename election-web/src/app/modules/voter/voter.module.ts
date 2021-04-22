import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { VoterService } from '@services/voters.services';
// import { ElectionService } from '@services/election.services';
// import { BallotService } from '@services/candidate.services';
import { VoterRoutingModule } from './voter-routing.module';
import { MaterialModule } from 'src/app/material.modules';
import { PipeModule } from '@app/pipes';

import { VoterLayoutComponent } from './voter-layout.component';
import { VoterListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VoterRoutingModule,
    MaterialModule,
    PipeModule,
  ],
  declarations: [
    VoterLayoutComponent,
    VoterListComponent,
    ],
  providers: [
    VoterService
  ]
})
export class VoterModule {}
