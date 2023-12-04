import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent {

  reservationForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private activateRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.reservationForm = this.formBuilder.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      car: ['', Validators.required]
    });

    let id = this.activateRoute.snapshot.paramMap.get('id');

      if (id) {
        this.reservationService.getReservation(id).subscribe(reservation => {
          if (reservation)
            this.reservationForm.patchValue(reservation);
        });       
      }
  }

  onSubmit() {
    if (this.reservationForm.valid) {

      let reservation: Reservation = this.reservationForm.value;
      let id = this.activateRoute.snapshot.paramMap.get('id');
      if (id) //update
        this.reservationService.updateReservation(id, reservation).subscribe(() => {
          console.log("Frissítési kérelem feldolgozva!");
        });
      else //create
        this.reservationService.addReservation(reservation).subscribe(() => {
          console.log("Létrehozási kérelem feldolgozva!");
        });
        
      this.router.navigate(['/list']);
    }
  }

}