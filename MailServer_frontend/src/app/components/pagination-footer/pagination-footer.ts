import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-pagination-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-footer.html',
  styleUrl: './pagination-footer.css',
})
export class PaginationFooterComponent implements OnInit, OnDestroy {
  @Input({ required: true }) contextKey!: string;
  @Input() pages: number[] = [];
  @Input() initialPage = 0;
  @Input() canGoNext = true;

  currentPage = 0;
  private subscription?: Subscription;

  constructor(private paginationService: PaginationService) {}

  private updatePages(): void {
    // Get updated pages based on current page
    const context = this.paginationService['getContext'](this.contextKey);
    this.pages = this.paginationService['buildPages'](
        this.currentPage, 
        context.maxLoadedPage
    );
    }

  ngOnInit(): void {
    if (!this.contextKey) {
      throw new Error('PaginationFooterComponent requires a contextKey input.');
    }

    this.paginationService.registerContext(this.contextKey, this.initialPage);
    this.currentPage = this.paginationService.getCurrentPage(this.contextKey);

    this.subscription = this.paginationService
        .page$(this.contextKey)
        .subscribe((page) => {
        this.currentPage = page;
        this.updatePages(); // Rebuild visible pages
        });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  goToPage(page: number): void {
    if (this.currentPage === page) {
      return;
    }
    this.paginationService.setPage(this.contextKey, page);
  }

  previous(): void {
    const minPage = this.pages.length ? Math.min(...this.pages) : 0;
    if (this.currentPage <= minPage) {
      return;
    }
    this.paginationService.setPage(this.contextKey, this.currentPage - 1);
  }

  next(): void {
    if (!this.canGoNext) {
      return;
    }
    this.paginationService.setPage(this.contextKey, this.currentPage + 1);
  }

  isActive(page: number): boolean {
    return this.currentPage === page;
  }
}
