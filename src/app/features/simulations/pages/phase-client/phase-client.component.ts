import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProgressStepperComponent } from '../../../../shared/components/progress-stepper/progress-stepper.component';
import { SimulationHeaderComponent } from '../../components/simulation-header/simulation-header.component';
import { SimulationFooterComponent } from '../../components/simulation-footer/simulation-footer.component';
import { ClientListComponent } from '../../../clients/components/client-list/client-list.component';
import { ClientFormComponent } from '../../../clients/components/client-form/client-form.component';
import { Client, shortClientName } from '../../../../core/models/client.model';
import { SimulationStore } from '../../store/simulation.store';

@Component({
  selector: 'app-phase-client',
  standalone: true,
  imports: [
    CommonModule,
    ProgressStepperComponent,
    SimulationHeaderComponent,
    SimulationFooterComponent,
    ClientListComponent,
    ClientFormComponent
  ],
  templateUrl: './phase-client.component.html'
})
export class PhaseClientComponent implements OnInit {
  @ViewChild(ClientFormComponent) clientFormComponent!: ClientFormComponent;

  steps = ['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado'];

  selectedClient = signal<Client | null>(null);

  constructor(
    private router: Router,
    private simulationStore: SimulationStore
  ) {}

  ngOnInit() {
    const previousClient = this.simulationStore.selectedClient();
    if (previousClient) {
      this.selectedClient.set(previousClient);
    }
  }

  selectExistingClient(client: Client) {
    this.selectedClient.set(client);
    this.clientFormComponent.resetForm();
  }

  // Si el usuario empieza a escribir un cliente nuevo, se descarta la selección de la lista
  // para que "Continuar" tome los datos escritos y no el cliente elegido previamente.
  onDocumentNumberFocus() {
    this.selectedClient.set(null);
  }

  get clientName(): string | null {
    const client = this.selectedClient();
    return client ? shortClientName(client) : null;
  }

  // El cliente escrito recién se registra en la BD al generar la cotización (fase Seguro),
  // no aquí: por ahora solo viaja como borrador dentro del store de la simulación.
  onClientFormContinue(client: Client) {
    this.proceedToVehiclePhase(client);
  }

  onFooterContinue() {
    if (this.selectedClient()) {
      this.proceedToVehiclePhase(this.selectedClient()!);
    } else {
      this.clientFormComponent.submitForm();
    }
  }

  private proceedToVehiclePhase(client: Client) {
    this.simulationStore.setClient(client);
    this.router.navigate(['/simulations/vehicle']);
  }
}