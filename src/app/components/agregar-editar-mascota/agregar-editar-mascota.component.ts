import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Mascota } from 'src/app/interfaces/mascota';
import { MascotaService } from 'src/app/services/mascota.service';

@Component({
  selector: 'app-agregar-editar-mascota',
  templateUrl: './agregar-editar-mascota.component.html',
  styleUrls: ['./agregar-editar-mascota.component.css']
})
export class AgregarEditarMascotaComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  id: number;
  operacion: string = 'Add';

  constructor(private _snackBar: MatSnackBar,
              private fb: FormBuilder,
              private _router: Router,
              private aRouter: ActivatedRoute,
              private _mascotaService: MascotaService) { 
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      raza: ['', Validators.required],
      color: ['', Validators.required],
      edad: ['', Validators.required],
      peso: ['', Validators.required],
    })

    this.id = Number(this.aRouter.snapshot.paramMap.get('id'));
   }

  ngOnInit(): void {
    if ( this.id != 0 ) {
      this.operacion = 'Edit';
      this.obtenerMascota(this.id);
    }
  }
  
  obtenerMascota(id: number){
    this.loading = true;
    this._mascotaService.getMascota(id).subscribe(data => {
      this.form.setValue({
        nombre: data.nombre,
        raza: data.raza,
        color: data.raza,
        edad: data.edad,
        peso: data.peso
      })
      this.loading = false;
    });
  }

  agregarEditarMascota(){
    //Armamos el objeto
    const mascota: Mascota = {
      nombre: this.form.value.nombre,
      raza: this.form.value.raza,
      color: this.form.value.color,
      edad: this.form.value.edad,
      peso: this.form.value.peso
    }

    if (this.id != 0 )
    {
      mascota.id = this.id;
      this.editarMascota(this.id, mascota);
    } else {
      this.agregarMascota(mascota);
    }
  }

  editarMascota(id: number, mascota: Mascota){
    this.loading = true;
    this._mascotaService.updateMascota(id, mascota).subscribe(() =>{
      this.loading = false;
      this.mensajeExito('updated');
      this._router.navigate(['/listMascotas']);
    });
    
  }

  agregarMascota( mascota: Mascota){
    this.loading = true;
        //Enviamos objeto al back-end
    this._mascotaService.addMascota(mascota).subscribe(data => {
      this.loading = false;
      this.mensajeExito('registered');
      this._router.navigate(['/listMascota']);
    });
  }

  mensajeExito(text: string) {
    this._snackBar.open(`The pet was successfully ${text} ✔️`, '', {
      duration: 4000,
      horizontalPosition: 'right',
    });
  }
}
