import { AfterViewInit, Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProgressStepperComponent } from '../../../../shared/components/progress-stepper/progress-stepper.component';
import { SimulationHeaderComponent } from '../../components/simulation-header/simulation-header.component';
import { SimulationFooterComponent } from '../../components/simulation-footer/simulation-footer.component';
import { ClientListComponent } from '../../../clients/components/client-list/client-list.component';
import { ClientFormComponent } from '../../../clients/components/client-form/client-form.component';
import { Client } from '../../../../core/models/client.model';
import { SimulationStore } from '../../store/simulation.store';
import { ClientService } from '../../../clients/services/client.service';

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
export class PhaseClientComponent implements OnInit, AfterViewInit {
  @ViewChild(ClientFormComponent) clientFormComponent!: ClientFormComponent;

  steps = ['Cliente', 'Vehículo', 'Financiamiento', 'Seguro', 'Resultado'];

  selectedClient = signal<Client | null>(null);
  isSaving = signal(false);
  errorMessage = signal('');

  registeredClients: Client[] = Array(12).fill(null).map((_, index) => ({
    id: `C-${1000 + index}`,
    documentType: 'DNI',
    documentNumber: '45942013',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    phone: '',
    email: '',
    address: '',
    company: '',
    monthlyIncome: null,
    laborSeniority: null
  }));

  constructor(
    private router: Router,
    private simulationStore: SimulationStore,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    const previousClient = this.simulationStore.selectedClient();
    if (previousClient) {
      const matchInList = this.registeredClients.find(c => c.id === previousClient.id);
      if (matchInList) {
        this.selectedClient.set(matchInList);
      }
    }
  }

  ngAfterViewInit() {
    const previousClient = this.simulationStore.selectedClient();
    if (previousClient && !this.selectedClient()) {
      this.clientFormComponent.patchValues(previousClient);
    }
  }

  selectExistingClient(client: Client) {
    this.selectedClient.set(client);
  }

  onClientFormContinue(client: Client) {
    this.isSaving.set(true);
    this.errorMessage.set('');

    this.clientService.createClient(client).subscribe({
      next: (createdClient) => {
        this.isSaving.set(false);
        this.proceedToVehiclePhase(createdClient);
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set('No se pudo registrar el cliente. Verifica los datos e inténtalo de nuevo.');
      }
    });
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