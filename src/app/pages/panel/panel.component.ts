import { Component, OnInit, PLATFORM_ID, ChangeDetectorRef, inject, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { AppConfigService } from '../../services/appconfig.service';
import { DesignerService } from '../../services/designer.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, ChartModule, FormsModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  data: any;
  options: any;
  lineData: any;
  lineOptions: any;
  fechaInicio: string;
  fechaFin: string;
  platformId = inject(PLATFORM_ID);
  configService = inject(AppConfigService);
  designerService = inject(DesignerService);
  filtro: string = 'cantidad exitosa';
  
  // Datos para cantidad exitosa
  private datosExitosos = [65, 79, 80, 81, 56, 55, 40];
  // Datos para cantidad no exitosa
  private datosNoExitosos = [35, 21, 20, 19, 44, 45, 60];
  
  // Datos para el gráfico de línea - Ideas registradas por mes
  private ideasRegistradas = [120, 145, 130, 165, 180, 200, 190, 210, 225, 240, 230, 250];
  // Datos para el gráfico de línea - Ideas finalizadas por mes
  private ideasFinalizadas = [85, 95, 90, 110, 125, 140, 135, 150, 160, 175, 170, 185];
  
  // Meses del año
  private meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  constructor(private cd: ChangeDetectorRef) {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.fechaInicio = this.formatDateForInput(lastMonth);
    this.fechaFin = this.formatDateForInput(today);
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  themeEffect = effect(() => {
    if (this.configService.transitionComplete()) {
      if (this.designerService.preset()) {
        this.initChart();
        this.initLineChart();
      }
    }
  });

  ngOnInit() {
    this.initChart();
    this.initLineChart();
  }

  onFiltroChange() {
    this.updateChartData();
  }

  onFechaChange() {
    // Aquí puedes agregar la lógica para filtrar los datos según las fechas seleccionadas
    if (this.fechaInicio && this.fechaFin) {
      const inicio = new Date(this.fechaInicio);
      const fin = new Date(this.fechaFin);
      
      // Validar que la fecha de inicio no sea mayor que la fecha de fin
      if (inicio > fin) {
        alert('La fecha de inicio no puede ser mayor que la fecha de fin');
        this.fechaFin = this.formatDateForInput(inicio);
        return;
      }
      
      console.log('Fechas seleccionadas:', inicio.toLocaleDateString(), 'a', fin.toLocaleDateString());
      // Aquí puedes agregar la lógica de filtrado de datos
      // Por ejemplo: this.filterDataByDateRange(inicio, fin);
    }
  }

  initLineChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
      const primaryColor = documentStyle.getPropertyValue('--p-primary-color') || '#6366f1';
      const primaryColorDark = documentStyle.getPropertyValue('--p-primary-600') || '#4f46e5';
      const successColor = documentStyle.getPropertyValue('--p-green-500') || '#10b981';
      const successColorDark = documentStyle.getPropertyValue('--p-green-600') || '#059669';

      this.lineData = {
        labels: this.meses,
        datasets: [
          {
            label: 'Ideas Registradas',
            data: this.ideasRegistradas,
            fill: false,
            borderColor: primaryColor,
            backgroundColor: primaryColor,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: primaryColor,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 3
          },
          {
            label: 'Ideas Finalizadas',
            data: this.ideasFinalizadas,
            fill: false,
            borderColor: successColor,
            backgroundColor: successColor,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: successColor,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 3
          }
        ]
      };

      this.lineOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
              font: {
                size: 14,
                weight: 500
              },
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context: any) {
                return context.dataset.label + ': ' + context.parsed.y + ' ideas';
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
                size: 12
              }
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary,
              font: {
                size: 12
              },
              callback: function(value: any) {
                return value + ' ideas';
              }
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            },
            beginAtZero: true
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      };

      this.cd.markForCheck();
    }
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.updateChartData();

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500
              }
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            },
            beginAtZero: true
          }
        }
      };

      this.cd.markForCheck();
    }
  }

  updateChartData() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const isExitoso = this.filtro === 'cantidad exitosa';
      
      const backgroundColor = isExitoso 
        ? documentStyle.getPropertyValue('--p-green-500') || '#10b981'
        : documentStyle.getPropertyValue('--p-red-500') || '#ef4444';
      
      const borderColor = isExitoso
        ? documentStyle.getPropertyValue('--p-green-600') || '#059669'
        : documentStyle.getPropertyValue('--p-red-600') || '#dc2626';

      this.data = {
        labels: ['alimentos', 'bebidas', 'electrodomesticos', 'ropa', 'muebles', 'tecnologia', 'otros'],
        datasets: [
          {
            label: isExitoso ? 'Cantidad exitosa' : 'Cantidad no exitosa',
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 2,
            borderRadius: 6,
            data: isExitoso ? this.datosExitosos : this.datosNoExitosos
          },
        ]
      };

      this.cd.markForCheck();
    }
  }
}