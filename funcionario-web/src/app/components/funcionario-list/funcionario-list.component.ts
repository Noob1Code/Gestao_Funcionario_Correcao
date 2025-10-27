import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FuncionarioService } from '../../services/funcionario.service';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import {FuncionarioResponse} from "../../models/funcionarioResponse";

@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectButtonModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './funcionario-list.component.html',
  styleUrls: ['./funcionario-list.component.css']
})
export class FuncionarioListComponent implements OnInit {

  funcionarios: FuncionarioResponse[] = [];
  filtroCargo: string = '';
  filtroAtivo: boolean | null = null;
  carregando = false;

  statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Ativos', value: true },
    { label: 'Inativos', value: false }
  ];

  constructor(
    private service: FuncionarioService,
    private msg: MessageService,
    private confirm: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;

    const params: any = {};
    if (this.filtroCargo.trim()) params.cargo = this.filtroCargo.trim();
    if (this.filtroAtivo !== null) params.ativo = this.filtroAtivo;

    this.service.listar(params).subscribe({
      next: (lista) => {
        this.funcionarios = lista;
        this.carregando = false;
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar funcionários' });
        this.carregando = false;
      }
    });
  }

  limparFiltros(): void {
    this.filtroCargo = '';
    this.filtroAtivo = null;
    this.carregar();
  }

  editar(id: number): void {
    this.router.navigate(['/funcionarios', id]);
  }

  confirmarInativacao(f: FuncionarioResponse): void {
    this.confirm.confirm({
      message: `Confirma inativar ${f.nome}?`,
      header: 'Confirmar',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => this.inativar(f.id)
    });
  }

  private inativar(id: number): void {
    this.carregando = true;
    this.service.inativar(id).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário inativado' });
        this.carregar();
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível inativar' });
        this.carregando = false;
      }
    });
  }

  novo(): void {
    this.router.navigate(['/funcionarios/novo']);
  }
}
