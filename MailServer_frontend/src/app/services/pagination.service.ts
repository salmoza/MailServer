import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface PaginationContext {
  subject: BehaviorSubject<number>;
  onChange?: (page: number) => void;
  maxLoadedPage: number;
  canGoNext: boolean;
}

export interface PaginationUpdateResult {
  pages: number[];
  canGoNext: boolean;
  shouldFallback: boolean;
  fallbackPage: number;
}

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private contexts = new Map<string, PaginationContext>();
  private static readonly DEFAULT_PAGE_SIZE = 10;

  registerContext(key: string, initialPage = 0, onChange?: (page: number) => void): void {
    if (!this.contexts.has(key)) {
      this.contexts.set(key, {
        subject: new BehaviorSubject<number>(initialPage),
        onChange,
        maxLoadedPage: initialPage,
        canGoNext: true,
      });
    } else {
      const existing = this.contexts.get(key)!;
      if (onChange) {
        existing.onChange = onChange;
      }
    }

    const context = this.contexts.get(key)!;
    if (onChange) {
      context.onChange = onChange;
    }

    context.onChange?.(context.subject.value);
  }

  unregisterContext(key: string): void {
    const context = this.contexts.get(key);
    if (!context) {
      return;
    }

    context.subject.complete();
    this.contexts.delete(key);
  }

  resetState(key: string, initialPage = 0): void {
    const context = this.getContext(key);
    context.maxLoadedPage = initialPage;
    context.canGoNext = true;
  }

  page$(key: string): Observable<number> {
    return this.getContext(key).subject.asObservable();
  }

  getCurrentPage(key: string): number {
    return this.getContext(key).subject.value;
  }

  setPage(key: string, page: number): void {
    const context = this.getContext(key);
    context.subject.next(page);
    context.onChange?.(page);
  }

  updateAfterDataLoad(
    key: string,
    page: number,
    itemsCount: number,
    pageSize: number = PaginationService.DEFAULT_PAGE_SIZE,
  ): PaginationUpdateResult {
    const context = this.getContext(key);
    const hasData = itemsCount > 0;
    if (hasData) {
        context.maxLoadedPage = Math.max(context.maxLoadedPage, page);
    }
    context.canGoNext = itemsCount >= pageSize;
    // Allow next navigation as long as we got any data (user can keep clicking to try next pages)
    // context.canGoNext = hasData;

    return {
        pages: this.buildPages(page, context.maxLoadedPage),
        canGoNext: context.canGoNext,
        shouldFallback: !hasData && page > 0, // Fallback if empty page
        fallbackPage: Math.max(0, page - 1),
        // shouldFallback: false,
        // fallbackPage: page,
    };
  }

  private getContext(key: string): PaginationContext {
    const context = this.contexts.get(key);
    if (!context) {
      throw new Error(`Pagination context "${key}" is not registered.`);
    }
    return context;
  }

    private buildPages(currentPage: number, maxPage: number): number[] {
    const VISIBLE_PAGES = 5; // Show 5 page numbers at a time
    
    if (maxPage < VISIBLE_PAGES) {
        // If total pages < 5, show all
        return Array.from({ length: maxPage + 1 }, (_, i) => i);
    }
    
    // Calculate start and end of visible window
    let start = Math.max(0, currentPage - 2); // Show 2 pages before current
    let end = Math.min(maxPage, start + VISIBLE_PAGES - 1); // Show total of 5 pages
    
    // Adjust if we're near the end
    if (end === maxPage) {
        start = Math.max(0, end - VISIBLE_PAGES + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

  
}
