import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContactService } from '../../services/contact.services';
import { ContactDto } from '../../Dtos/ContactDto';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contact-form.html',
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode = false;
  contactId: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private http: HttpClient
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      notes: [''],
      starred: [false],
      emailAddresses: this.fb.array([
        this.fb.control('', {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.emailExistenceValidator()],
          updateOn: 'change',
        }),
      ]),
    });
  }

  ngOnInit(): void {
    this.contactId = this.route.snapshot.paramMap.get('id');
    if (this.contactId) {
      this.isEditMode = true;
      this.loadContactData(this.contactId);
    }
  }

  emailExistenceValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;

      if (!email || control.hasError('email') || control.hasError('required')) {
        return of(null);
      }

      return this.http.get<boolean>(`http://localhost:8080/api/mails/valid/${email}`).pipe(
        map((isValid) => {
          return isValid ? null : { emailNotExist: true };
        }),
        catchError(() => {
          return of(null);
        })
      );
    };
  }

  get emailControls() {
    return (this.contactForm.get('emailAddresses') as FormArray).controls;
  }

  addEmailField() {
    (this.contactForm.get('emailAddresses') as FormArray).push(
      this.fb.control('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailExistenceValidator()],
        updateOn: 'change',
      })
    );
  }

  removeEmailField(index: number) {
    (this.contactForm.get('emailAddresses') as FormArray).removeAt(index);
  }

  loadContactData(id: string) {
    this.contactService.getContacts().subscribe({
      next: (contacts: any) => {
        const contact = contacts.find((c: any) => c.contactId === id);
        if (contact) {
          this.patchForm(contact);
        }
      },
      error: (err: any) => console.error('Failed to load contact', err),
    });
  }

  patchForm(contact: ContactDto) {
    this.contactForm.patchValue({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      notes: contact.notes,
      starred: contact.starred,
    });

    const emailArray = this.contactForm.get('emailAddresses') as FormArray;
    emailArray.clear();
    contact.emailAddresses.forEach((email) => {
      emailArray.push(
        this.fb.control(email, {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.emailExistenceValidator()],
          updateOn: 'change',
        })
      );
    });
  }

  onSubmit() {
    if (this.isSubmitting) return;

    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid || this.contactForm.pending) {
      const emailArray = this.contactForm.get('emailAddresses') as FormArray;
      const hasInvalidEmails = emailArray.controls.some((control) =>
        control.hasError('emailNotExist')
      );

      if (hasInvalidEmails) {
        alert('One or more emails do not exist in the system. Please enter valid email addresses.');
      }
      return;
    }

    this.isSubmitting = true;

    const formValue: ContactDto = this.contactForm.value;

    if (this.isEditMode && this.contactId) {
      this.contactService.editContact(this.contactId, formValue).subscribe({
        next: () => {
          console.log('Contact Updated');
          this.router.navigate(['/contacts']);
          this.isSubmitting = false;
        },
        error: (err: any) => {
          console.error('Update failed', err);
          this.isSubmitting = false;
        },
      });
    } else {
      this.contactService.createContact(formValue).subscribe({
        next: () => {
          console.log('Contact Created');
          this.router.navigate(['/contacts']);
          this.isSubmitting = false;
        },
        error: (err: any) => {
          console.error('Creation failed', err);
          this.isSubmitting = false;
        },
      });
    }
  }

  onEmailEnter(event: Event, index: number) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    const control = (this.contactForm.get('emailAddresses') as FormArray).at(index);
    if (control && control.value) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }
}
