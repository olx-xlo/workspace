import { provideHttpClient } from '@angular/common/http';
import { applicationConfig } from '@storybook/angular';
import { provideToastr } from 'ngx-toastr';

export const decorators = [
  applicationConfig({
    providers: [provideHttpClient(), provideToastr()],
  }),
];
