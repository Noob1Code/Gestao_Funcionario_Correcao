package com.senai.jonatas.funcionarios.controller;

import com.senai.jonatas.funcionarios.dto.FuncionarioRequest;
import com.senai.jonatas.funcionarios.dto.FuncionarioResponse;
import com.senai.jonatas.funcionarios.service.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "http://localhost:4200")
public class FuncionarioController {

    @Autowired
    private FuncionarioService service;

    // GET /api/funcionarios?cargo=Analista&ativo=true
    @GetMapping
    public List<FuncionarioResponse> listarTodos(
            @RequestParam(required = false) String cargo,
            @RequestParam(required = false) Boolean ativo
    ) {
        return service.listar(cargo, ativo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<FuncionarioResponse> cadastrar(@Valid @RequestBody FuncionarioRequest request,
                                                         UriComponentsBuilder uriBuilder) {
        var result = service.cadastrar(request);
        if (result.created()) {
            var location = uriBuilder.path("/api/funcionarios/{id}")
                    .buildAndExpand(result.body().id()).toUri();
            return ResponseEntity.created(location).body(result.body()); // 201 Created
        }
        // Reativado: 200 OK
        return ResponseEntity.ok(result.body());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioResponse> atualizar(@PathVariable Long id,
                                                         @Valid @RequestBody FuncionarioRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @PatchMapping("/{id}/inativar")
    public ResponseEntity<FuncionarioResponse> inativar(@PathVariable Long id) {
        return ResponseEntity.ok(service.inativar(id));
    }
}
