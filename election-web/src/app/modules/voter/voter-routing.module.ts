import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoterLayoutComponent } from './voter-layout.component';
import { VoterListComponent } from './list/list.component';

const routes: Routes = [
    {
        path: '', component: VoterLayoutComponent,
        children: [
            { path: '', component: VoterListComponent },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VoterRoutingModule { }
