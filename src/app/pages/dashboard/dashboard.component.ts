import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExperienceStateService } from '../../services/experience-state.service';
import { ExperienceResponse } from '../../services/experience.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { ConfirmationDialogOptions } from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  experienceResponse: ExperienceResponse | null = null;
  private destroy$ = new Subject<void>();

  // Modale
  dialogVisible = false;
  dialogOptions!: ConfirmationDialogOptions;
  private response$!: Subject<boolean>;

  constructor(
    private experienceStateService: ExperienceStateService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    console.log('DashboardComponent initialized');

    this.experienceStateService.experience$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.experienceResponse = res;
      });

    this.confirmationService.onDialog()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ options, response }) => {
        this.dialogOptions = options;
        this.response$ = response;
        this.dialogVisible = true;
      });
  }

  handleConfirm(choice: boolean) {
    this.response$.next(choice);
    this.response$.complete();
    this.dialogVisible = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
