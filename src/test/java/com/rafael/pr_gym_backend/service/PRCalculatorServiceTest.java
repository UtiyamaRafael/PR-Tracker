package com.rafael.pr_gym_backend.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class PRCalculatorServiceTest {

    private final PRCalculatorService service = new PRCalculatorService(null);

    @Test
    void deveCalcular1RMCorretamenteComFormulaDeEpley() {
        // 100kg x 5 reps = 100 * (1 + 5/30) = 116.67
        Double resultado = service.calcularEstimated1RM(100.0, 5);
        assertEquals(116.67, resultado, 0.01);
    }

    @Test
    void deveRetornarNuloQuandoPesoForNulo() {
        Double resultado = service.calcularEstimated1RM(null, 10);
        assertNull(resultado);
    }
}