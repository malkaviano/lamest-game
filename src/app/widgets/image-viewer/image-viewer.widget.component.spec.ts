import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';

import { first } from 'rxjs';

import { ImageViewerComponent } from './image-viewer.widget.component';
import { ViewableInterface } from '@conceptual/interfaces/viewable.interface';

describe('ImageViewerComponent', () => {
  let component: ImageViewerComponent;
  let fixture: ComponentFixture<ImageViewerComponent>;
  let loader: HarnessLoader;

  const image = {
    title: 'title',
    src: 'image.jpg',
    alt: 'image test',
    width: '400',
    height: '400',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageViewerComponent);

    fixture.componentInstance.image = image;

    component = fixture.componentInstance;

    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clicking view button', () => {
    it('return the the image info', async () => {
      const button = await loader.getHarness(MatButtonHarness);

      let result: ViewableInterface | undefined;

      fixture.componentInstance.imageOpened
        .pipe(first())
        .subscribe((image: ViewableInterface) => {
          result = image;
        });

      await button.click();

      fixture.detectChanges();

      expect(result).toEqual(image);
    });
  });
});
