import { HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api.service';
import { CategoryData } from '../../../models/category/category.interface';
import { CategoriesService } from './categories.service';

describe('Categories Service', () => {
  let apiServiceMock: ApiService;
  let categoriesService: CategoriesService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    when(apiServiceMock.get('categories', anything(), anything(), anything())).thenReturn(
      of([{ categoryPath: [{ id: 'blubb' }] }] as CategoryData[])
    );
    when(apiServiceMock.get('categories/dummyid', anything(), anything(), anything())).thenReturn(
      of({ categoryPath: [{ id: 'blubb' }] } as CategoryData)
    );
    when(apiServiceMock.get('categories/dummyid/dummysubid', anything(), anything(), anything())).thenReturn(
      of({ categoryPath: [{ id: 'blubb' }] } as CategoryData)
    );
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }, CategoriesService],
    });
    categoriesService = TestBed.get(CategoriesService);
  });

  describe('getTopLevelCategories()', () => {
    it('should call ApiService "categories" when called', () => {
      categoriesService.getTopLevelCategories(0);
      verify(apiServiceMock.get('categories', anything(), anything(), anything())).once();
    });

    it('should call ApiService "categories" in tree mode when called with a depth', () => {
      categoriesService.getTopLevelCategories(1);
      verify(apiServiceMock.get('categories', anything(), anything(), anything())).once();
      const args = capture(apiServiceMock.get).last();
      expect(args[0]).toBe('categories');
      const params = args[1] as HttpParams;
      expect(params).toBeTruthy();
      expect(params.get('view')).toBe('tree');
      expect(params.get('limit')).toBe('1');
    });
  });

  describe('getCategory()', () => {
    it('should call underlying ApiService categories/id when asked to resolve a category by id', () => {
      categoriesService.getCategory('dummyid');

      verify(apiServiceMock.get('categories/dummyid', anything(), anything(), anything())).once();
    });

    it('should return error when called with null', () => {
      categoriesService.getCategory(null).subscribe(data => fail(), err => expect(err).toBeTruthy());

      verify(apiServiceMock.get(anything(), anything(), anything(), anything())).never();
    });

    it('should return error when called with empty category', () => {
      categoriesService.getCategory('').subscribe(data => fail(), err => expect(err).toBeTruthy());

      verify(apiServiceMock.get(anything(), anything(), anything(), anything())).never();
    });

    it('should call underlying ApiService categories/id when asked to resolve a subcategory by id', () => {
      categoriesService.getCategory('dummyid/dummysubid');

      verify(apiServiceMock.get('categories/dummyid/dummysubid', anything(), anything(), anything())).once();
    });
  });
});