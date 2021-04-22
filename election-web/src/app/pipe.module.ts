import { NgModule } from '@angular/core';
import { MomentPipe } from '@app/shared/pipes/date.pipe';

@NgModule({
  imports: [],
  declarations: [MomentPipe],
  exports: [MomentPipe],
})
export class PipeModule {}
