import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExperienceStateService } from '../../services/experience-state.service';
import { ExperienceResponse } from '../../services/experience.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  experienceResponse: ExperienceResponse | null = null;
  private destroy$ = new Subject<void>();

  constructor(private xpState: ExperienceStateService) { }

  ngOnInit(): void {
    console.log('DashboardComponent initialized');
    this.xpState.experience$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.experienceResponse = res;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
