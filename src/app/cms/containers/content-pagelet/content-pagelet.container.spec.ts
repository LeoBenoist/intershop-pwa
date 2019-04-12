import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { instance, mock, when } from 'ts-mockito';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { SafeHtmlPipe } from 'ish-core/pipes/safe-html.pipe';
import { createSimplePageletView } from 'ish-core/utils/dev/test-data-utils';
import { SfeAdapterService } from '../../../cms/sfe-adapter/sfe-adapter.service';
import { CMSTextComponent } from '../../components/cms-text/cms-text.component';
import { CMS_COMPONENT } from '../../configurations/injection-keys';

import { ContentPageletContainerComponent } from './content-pagelet.container';

describe('Content Pagelet Container', () => {
  let component: ContentPageletContainerComponent;
  let fixture: ComponentFixture<ContentPageletContainerComponent>;
  let element: HTMLElement;
  let pagelet: ContentPagelet;
  let sfeAdapterMock: SfeAdapterService;

  beforeEach(async(() => {
    sfeAdapterMock = mock(SfeAdapterService);
    when(sfeAdapterMock.isInitialized()).thenReturn(true);

    TestBed.configureTestingModule({
      declarations: [CMSTextComponent, ContentPageletContainerComponent, SafeHtmlPipe],
      providers: [
        {
          provide: CMS_COMPONENT,
          useValue: { definitionQualifiedName: 'fq-defined', class: CMSTextComponent },
          multi: true,
        },
        { provide: SfeAdapterService, useValue: instance(sfeAdapterMock) },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ContentPageletContainerComponent, { set: { entryComponents: [CMSTextComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageletContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'pagelet',
      domain: 'domain',
      configurationParameters: {
        HTMLText: 'foo',
      },
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.pagelet = createSimplePageletView(pagelet);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });

  it('should render assigned template if name matches', () => {
    pagelet.definitionQualifiedName = 'fq-defined';
    component.pagelet = createSimplePageletView(pagelet);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
