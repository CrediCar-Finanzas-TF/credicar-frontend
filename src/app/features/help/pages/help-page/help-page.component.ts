import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GuideStep {
  number: number;
  title: string;
  description: string;
}

interface GlossaryTerm {
  term: string;
  definition: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-page.component.html'
})
export class HelpPageComponent {
  guideSteps: GuideStep[] = [
    { number: 1, title: 'Cliente', description: 'Selecciona un cliente ya registrado o da de alta uno nuevo con sus datos personales, de contacto e información financiera.' },
    { number: 2, title: 'Vehículo', description: 'Elige el vehículo de interés del catálogo disponible para vincularlo a la operación.' },
    { number: 3, title: 'Financiamiento', description: 'Define moneda, modalidad, tasa de interés (efectiva o nominal), período de gracia y cuota balón si aplica.' },
    { number: 4, title: 'Seguro', description: 'Configura el seguro de desgravamen obligatorio, el seguro vehicular y las coberturas opcionales.' },
    { number: 5, title: 'Resultado', description: 'Revisa el cronograma de pagos completo y los indicadores financieros (VAN, TIR, TCEA) antes de guardar la cotización.' }
  ];

  glossary: GlossaryTerm[] = [
    { term: 'VAN (Valor Actual Neto)', definition: 'Trae a valor de hoy todos los flujos futuros del crédito (desde el punto de vista del deudor), descontados a la tasa COK. Si es negativo, el costo del crédito supera el costo de oportunidad del cliente a esa tasa.' },
    { term: 'TIR (Tasa Interna de Retorno)', definition: 'La tasa que hace que el VAN sea exactamente cero. Representa el costo real mensual del crédito considerando todos los flujos de pago.' },
    { term: 'TCEA (Tasa de Costo Efectivo Anual)', definition: 'La TIR anualizada. Es el indicador exigido por la norma de transparencia de la SBS: incluye todos los costos obligatorios del crédito para que el cliente pueda comparar ofertas entre entidades.' },
    { term: 'COK (Costo de Oportunidad del Capital)', definition: 'La tasa a la que el cliente podría haber invertido su dinero en una alternativa comparable. Se usa como tasa de descuento para calcular el VAN.' },
    { term: 'Tasa Efectiva vs. Nominal', definition: 'La tasa efectiva (TEA) ya refleja la capitalización de intereses en el año. La tasa nominal (TNA) necesita convertirse según su capitalización (diaria, mensual, trimestral, etc.) antes de aplicarse al cronograma.' },
    { term: 'Período de Gracia', definition: 'Meses al inicio del crédito donde no se amortiza capital. En gracia "Total" no se paga nada y el interés se capitaliza; en gracia "Parcial" solo se paga el interés generado.' },
    { term: 'Cuota Balón (Compra Inteligente)', definition: 'Cuota final, más alta, que amortiza de una sola vez un porcentaje pactado (20%-50%) del precio del vehículo. Permite cuotas mensuales más bajas durante el resto del plazo.' }
  ];

  faqs: FaqItem[] = [
    { question: '¿Por qué a veces "Gastos Adicionales" aparece en S/ 0.00 en casi todas las cuotas?', answer: 'Ese campo refleja cargos únicos que no se financian (como notaría y registro), cobrados sin generar interés. Por diseño solo aparece con valor en la cuota donde se cobra ese gasto (normalmente la primera); en el resto del cronograma es 0 porque no hay ningún cargo extraordinario en esas cuotas.' },
    { question: '¿Qué diferencia hay entre financiar un gasto y cobrarlo como gasto inicial?', answer: 'Si se financia, el gasto se suma al capital y genera interés diluido en todas las cuotas. Si se cobra como gasto inicial, no se suma al capital, no genera interés, y se cobra de una sola vez en la cuota correspondiente.' },
    { question: '¿Por qué la cuota final en "Compra Inteligente" es mucho más alta?', answer: 'Porque en esa modalidad se pacta amortizar solo una parte del capital durante el plazo regular; el resto (la cuota balón) se amortiza de golpe en la última cuota.' },
    { question: '¿Qué significa que el VAN salga negativo?', answer: 'Es normal en un crédito: el VAN del deudor casi siempre es negativo porque representa el costo del financiamiento a valor presente. Lo relevante es comparar el VAN entre distintas ofertas usando la misma tasa COK.' }
  ];

  supportChannels = [
    { label: 'Correo de soporte', value: 'soporte.tecnico@credicar.pe' },
    { label: 'Línea de asistencia', value: '(01) 555-0192' },
    { label: 'Horario de atención', value: 'Lunes a viernes, 9:00 a.m. - 6:00 p.m.' }
  ];
}
